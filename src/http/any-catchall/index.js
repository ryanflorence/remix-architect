exports.handler = require("./@remix-run/architect")({
  getLoadContext(req) {
    return { req };
  },
});
