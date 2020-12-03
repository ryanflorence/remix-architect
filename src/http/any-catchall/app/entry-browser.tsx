import React from "react";
import { hydrate } from "react-dom";
import Remix from "@remix-run/react/browser";

import App from "./App";

hydrate(
  // @ts-ignore
  <Remix>
    <App />
  </Remix>,
  document
);
