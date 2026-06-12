import { createRequestHandler, type GetLoadContextFunction } from "@react-router/express";
import express from "express";
import { RouterContextProvider, type ServerBuild } from "react-router";
import { resolvePlatformAuthSession } from "./auth-session.js";
import { platformAuthSessionContext } from "./context.js";

export const app = express();

const getLoadContext = (async (req: express.Request) => {
  const request = new Request(`${req.protocol}://${req.get("host")}${req.originalUrl}`, {
    headers: buildRequestHeaders(req.headers),
    method: req.method,
  });
  const context = new RouterContextProvider();
  context.set(platformAuthSessionContext, await resolvePlatformAuthSession({ request }));
  return context;
}) as unknown as GetLoadContextFunction;

app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build") as unknown as Promise<ServerBuild>,
    getLoadContext,
  }),
);

function buildRequestHeaders(headers: Record<string, string | string[] | undefined>): Headers {
  const nextHeaders = new Headers();
  for (const [name, value] of Object.entries(headers)) {
    if (typeof value === "string") {
      nextHeaders.set(name, value);
    } else if (Array.isArray(value)) {
      nextHeaders.set(name, value.join(", "));
    }
  }
  return nextHeaders;
}
