import { createRequestHandler, type GetLoadContextFunction } from "@react-router/express";
import express from "express";
import { RouterContextProvider, type ServerBuild } from "react-router";
import { getPlatformAuthBaseUrl, resolvePlatformAuthSession } from "./auth-session.js";
import { platformAuthSessionContext } from "./context.js";

export const app = express();

logStartupConfig();

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

function logStartupConfig(): void {
  const runtimeApiUrls = process.env.VITE_GAME_RUNTIME_API_URLS?.trim();
  console.info("[simulator-auth] startup config", {
    authBaseUrl: getPlatformAuthBaseUrl(),
    hasAuthInternalUrl: Boolean(process.env.AUTH_INTERNAL_URL?.trim()),
    gatewayWsOrigin:
      process.env.VITE_GAME_SERVER_WS_URL ??
      process.env.VITE_GATEWAY_WS_URL ??
      "wss://gateway.tcg.online",
    runtimeApiUrlMapConfigured: Boolean(runtimeApiUrls),
    authCookieDomain: process.env.AUTH_COOKIE_DOMAIN ?? "(unset)",
    expectedCookieDomain: "tcg.online",
  });
}
