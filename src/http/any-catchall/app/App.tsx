import React from "react";
import { Meta, Scripts, Styles, Routes } from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <link rel="shortcut icon" href="/_static/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dosis:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Styles />
      </head>
      <body>
        <Routes />
        <Scripts />
      </body>
    </html>
  );
}
