const arc = require("@architect/functions");
const { URL } = require("url");
const atob = require("atob");

const {
  Headers,
  Request,
  Response,
  fetch,
  createRequestHandler: createRemixRequestHandler,
  readConfig: readRemixConfig,
  createSession,
} = require("@remix-run/core");

global.Headers = Headers;
global.Request = Request;
global.Response = Response;
global.fetch = fetch.defaults({ compress: false });

function handleConfigError(error) {
  console.error(`There was an error reading the Remix config`);
  console.error(error);
  process.exit(1);
}

/**
 * Creates a request handler for Express that generates the response using
 * Remix routing and data loading.
 */
function createRequestHandler({
  getLoadContext,
  root: remixRoot,
  // enableSessions = true,
} = {}) {
  let handleRequest;
  let remixConfig;
  let remixConfigPromise = readRemixConfig(
    remixRoot,
    process.env.NODE_ENV === "testing" ? "development" : "production"
  );

  remixConfigPromise.catch(handleConfigError);

  return async (req) => {
    if (!remixConfig) {
      try {
        remixConfig = await remixConfigPromise;
      } catch (error) {
        handleConfigError(error);
      }

      handleRequest = createRemixRequestHandler(remixConfig);
    }

    let loadContext;
    if (getLoadContext) {
      try {
        loadContext = await getLoadContext(req);
      } catch (error) {
        return {
          statusCode: 500,
        };
      }
    }

    let remixReq = createRemixRequest(req);
    let arcSession = await arc.http.session.read(req);
    let session = createSession(arcSession);

    let remixRes;
    try {
      remixRes = await handleRequest(remixReq, session, loadContext);
    } catch (error) {
      // This is probably an error in one of the loaders.
      console.error(error);
      return { statusCode: 500 };
    }

    if (Object.keys(arcSession).length > 1) {
      let cookie = await arc.http.session.write(arcSession);
      remixRes.headers.append("Set-Cookie", cookie);
    }

    return {
      statusCode: remixRes.status,
      headers: Object.fromEntries(remixRes.headers),
      body: await remixRes.text(),
    };

    // if (Buffer.isBuffer(remixRes.body)) {
    //   res.end(remixRes.body);
    // } else {
    //   remixRes.body.pipe(res);
    // }
  };
}

// https://arc.codes/primitives/http#req
function createRemixRequest(req) {
  let origin = "http://example.com"; // TODO: can't find origin info on req
  let url = new URL(req.rawPath + "?" + req.rawQueryString, origin);
  let method = req.requestContext.http.method;

  let init = { method, headers: createRemixHeaders(req.headers) };

  if (method !== "GET" && method !== "HEAD") {
    init.body = atob(req.body);
  }

  return new Request(url.toString(), init);
}

function createRemixHeaders(requestHeaders) {
  return new Headers(
    Object.keys(requestHeaders).reduce((memo, key) => {
      let value = requestHeaders[key];

      if (typeof value === "string") {
        memo[key] = value;
      } else if (Array.isArray(value)) {
        memo[key] = value.join(",");
      }

      return memo;
    }, {})
  );
}

module.exports = createRequestHandler;
