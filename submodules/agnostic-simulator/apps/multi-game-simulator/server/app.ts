import { createRequestHandler, type GetLoadContextFunction } from "@react-router/express";
import express from "express";
import { RouterContextProvider, type ServerBuild } from "react-router";
import { getPlatformAuthBaseUrl, resolvePlatformAuthSession } from "./auth-session.js";
import { platformAuthSessionContext } from "./context.js";

export const app = express();

logStartupConfig();

const getLoadContext = (async (req: express.Request, res: express.Response) => {
  // HTML and router data contain viewer-private state and scoped credentials.
  res.setHeader("Cache-Control", "private, no-store");
  res.vary("Cookie");
  res.vary("Authorization");
  const request = new Request(`${req.protocol}://${req.get("host")}${req.originalUrl}`, {
    headers: buildRequestHeaders(req.headers),
    method: req.method,
  });
  const context = new RouterContextProvider();
  context.set(
    platformAuthSessionContext,
    await resolvePlatformAuthSession({
      request,
      onSetCookie: (cookie) => res.append("set-cookie", cookie),
    }),
  );
  return context;
}) as unknown as GetLoadContextFunction;

const reactRouterRequestHandler = createRequestHandler({
  build: () => import("virtual:react-router/server-build") as unknown as Promise<ServerBuild>,
  getLoadContext,
});

app.use((req, res, next) => {
  // Express' router warns when a bundled handler returns a cross-realm or
  // otherwise Promise-like value. Assimilate it here and deliberately return
  // void to keep rejection handling without exposing the thenable to Express.
  void Promise.resolve(reactRouterRequestHandler(req, res, next)).catch(next);
});

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
  const internalRuntimeApiUrls = process.env.GAME_RUNTIME_API_INTERNAL_URLS?.trim();
  const publicRuntimeApiUrls = process.env.VITE_GAME_RUNTIME_API_URLS?.trim();
  console.info("[simulator-auth] startup config", {
    authBaseUrl: getPlatformAuthBaseUrl(),
    hasAuthInternalUrl: Boolean(process.env.AUTH_INTERNAL_URL?.trim()),
    gatewayWsOrigin:
      process.env.VITE_GAME_SERVER_WS_URL ??
      process.env.VITE_GATEWAY_WS_URL ??
      "wss://gateway.tcg.online",
    internalRuntimeApiUrlMapConfigured: Boolean(internalRuntimeApiUrls),
    publicRuntimeApiUrlMapConfigured: Boolean(publicRuntimeApiUrls),
    authCookieDomain: process.env.AUTH_COOKIE_DOMAIN ?? "(unset)",
    expectedCookieDomain: "tcg.online",
  });
}
