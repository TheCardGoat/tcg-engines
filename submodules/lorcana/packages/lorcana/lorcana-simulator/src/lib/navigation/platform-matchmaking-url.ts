const DEFAULT_PLATFORM_MATCHMAKING_URL = "https://tcg.online/lorcana/matchmaking";
const PLATFORM_MATCHMAKING_PATH = "/lorcana/matchmaking";

const PLATFORM_LOBBY_SUFFIXES = [
  "atelier",
  "community",
  "deck-vault",
  "events",
  "leaderboard",
  "match-history",
  "recent",
  "replays",
  "room",
  "season",
] as const;

function parsePlatformBase(configuredUrl?: string): URL {
  try {
    const candidate = new URL(configuredUrl?.trim() || DEFAULT_PLATFORM_MATCHMAKING_URL);
    if (
      (candidate.protocol === "http:" || candidate.protocol === "https:") &&
      candidate.pathname.replace(/\/$/, "") === PLATFORM_MATCHMAKING_PATH
    ) {
      candidate.pathname = PLATFORM_MATCHMAKING_PATH;
      candidate.search = "";
      candidate.hash = "";
      return candidate;
    }
  } catch {
    // Fall through to the production default.
  }

  return new URL(DEFAULT_PLATFORM_MATCHMAKING_URL);
}

function supportedLobbySuffix(pathname: string): string {
  const marker = "/matchmaking";
  const markerIndex = pathname.indexOf(marker);
  if (markerIndex < 0) return "";

  const suffix = pathname.slice(markerIndex + marker.length).replace(/^\/+|\/+$/g, "");
  if (!suffix) return "";
  return PLATFORM_LOBBY_SUFFIXES.some(
    (prefix) => suffix === prefix || suffix.startsWith(`${prefix}/`),
  )
    ? suffix
    : "";
}

function isAllowedReturnUrl(candidate: URL, platformBase: URL): boolean {
  const isSameLoopbackHostAcrossDevPorts =
    candidate.protocol === platformBase.protocol &&
    candidate.hostname === platformBase.hostname &&
    (candidate.hostname === "localhost" || candidate.hostname === "127.0.0.1");

  return (
    (candidate.origin === platformBase.origin || isSameLoopbackHostAcrossDevPorts) &&
    (candidate.pathname === PLATFORM_MATCHMAKING_PATH ||
      candidate.pathname.startsWith(`${PLATFORM_MATCHMAKING_PATH}/`))
  );
}

export function buildPlatformMatchmakingRedirect(sourceUrl: URL, configuredUrl?: string): string {
  const target = parsePlatformBase(configuredUrl);
  const suffix = supportedLobbySuffix(sourceUrl.pathname);
  if (suffix) target.pathname = `${PLATFORM_MATCHMAKING_PATH}/${suffix}`;
  target.search = sourceUrl.search;
  return target.toString();
}

export function resolvePlatformMatchmakingReturnUrl(
  currentUrl: URL,
  configuredUrl?: string,
  fallbackSuffix = "",
): string {
  // Simulator and matchmaking are mounted behind the same platform origin.
  // Deriving the lobby from the active page prevents a stale `returnTo` value
  // (or a production value in a staging configuration) from crossing domains.
  // Keep the configured value only as a defensive fallback for non-web URLs.
  const platformBase =
    currentUrl.protocol === "http:" || currentUrl.protocol === "https:"
      ? new URL(`${currentUrl.origin}${PLATFORM_MATCHMAKING_PATH}`)
      : parsePlatformBase(configuredUrl);

  // Explicit subroutes (atelier, replays, …) are intentional CTAs. Prefer them
  // over a generic matchmaking `returnTo`, which would otherwise send the
  // player back to the lobby root after a hosted match.
  const suffix = fallbackSuffix.replace(/^\/+|\/+$/g, "");
  if (suffix) {
    platformBase.pathname = `${PLATFORM_MATCHMAKING_PATH}/${suffix}`;
    return platformBase.toString();
  }

  const returnTo = currentUrl.searchParams.get("returnTo");
  if (returnTo) {
    try {
      const candidate = new URL(returnTo);
      if (isAllowedReturnUrl(candidate, platformBase)) return candidate.toString();
    } catch {
      // Ignore malformed return targets and use the configured platform URL.
    }
  }

  return platformBase.toString();
}
