import { createHash } from "crypto";
import React from "react";
import { renderToString } from "react-dom/server";
import type { EntryContext } from "@remix-run/core";
import Remix from "@remix-run/react/server";

import App from "./App";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let markup = renderToString(
    <Remix url={request.url} context={remixContext}>
      <App />
    </Remix>
  );

  responseHeaders.set("etag", createHash("md5").update(markup).digest("hex"));

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
    },
  });
}
