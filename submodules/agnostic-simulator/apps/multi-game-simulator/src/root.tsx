import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { ClientLoaderFunctionArgs, LoaderFunctionArgs } from "react-router";
import { isPlayableGameSlug, type PlayableGameSlug } from "@tcg/protocol";
import type { GatewayTicket } from "@tcg/simulator-runtime/gateway";
import type { SessionResult } from "@tcg/shared/auth";

import { platformAuthSessionContext } from "../server/context";
import { resolveGatewayTicket } from "../server/gateway-ticket";
import { initRootSocket } from "./lib/gateway/root-socket";

import "./app.css";
import "@tcg/simulator-ui/styles/theme.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Derives the active game slug from the FIRST path segment of the request URL
 * (path-prefix routing only). Mirrors the client-side `parseGameSlug` decode
 * handling for safety.
 */
function resolveGameSlugFromPath(pathname: string): PlayableGameSlug | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (!firstSegment) {
    return null;
  }
  let decoded: string;
  try {
    decoded = decodeURIComponent(firstSegment);
  } catch {
    return null;
  }
  return isPlayableGameSlug(decoded) ? decoded : null;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const gameSlug = resolveGameSlugFromPath(url.pathname);
  const auth: SessionResult | null = context.get(platformAuthSessionContext);
  // Fetch the single-use gateway ticket + JWT on the server (cookie forwarded
  // to the per-game ticket endpoint). The gateway-client library receives the
  // resolved credentials via `setCredentials` and never fetches itself.
  const gatewayTicket: GatewayTicket | null = auth?.session
    ? await resolveGatewayTicket({ request, gameSlug })
    : null;
  return { auth, gameSlug, gatewayTicket };
}

/**
 * Initializes the persistent root gateway socket on the client. This is a
 * non-blocking side effect; the server `loader` data is still used for the
 * initial render. `hydrate = true` ensures the socket initializes on the first
 * document load as well as on subsequent client navigations.
 */
export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const serverData = await serverLoader<typeof loader>();
  initRootSocket({
    session: serverData.auth?.session ?? null,
    gameSlug: serverData.gameSlug,
    ticket: serverData.gatewayTicket?.ticket,
    authToken: serverData.gatewayTicket?.authToken,
  });
  return { ...serverData, rootSocketReady: true };
}
clientLoader.hydrate = true as const;

export default function Root() {
  return <Outlet />;
}
