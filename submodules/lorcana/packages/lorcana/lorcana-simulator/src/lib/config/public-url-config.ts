import { env } from "$env/dynamic/public";

const DEFAULT_API_ORIGIN = "http://localhost:3000";
const DEFAULT_GAME_SERVER_ORIGIN = "http://localhost:3001";
const DEFAULT_TRACKER_ORIGIN = "https://new.lorcanito.com";
const DEFAULT_SIMULATOR_ASSET_BASE_URL = "https://new-cdn.lorcanito.com/public/lorcana/simulator";
const DEFAULT_LORCANA_ASSET_BASE_URL = "https://new-cdn.lorcanito.com/public/lorcana";

function addDefaultProtocolIfMissing(value: string, allowedProtocols: readonly string[]): string {
  if (/^[a-z][a-z\d+\-.]*:\/\//i.test(value)) {
    return value;
  }

  const hostnameCandidate = value.split("/")[0] ?? "";
  const looksLikeHost =
    hostnameCandidate === "localhost" ||
    hostnameCandidate.startsWith("localhost:") ||
    /^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?$/.test(hostnameCandidate) ||
    /^[a-z\d](?:[a-z\d-]*[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]*[a-z\d])?)+(?::\d+)?$/i.test(
      hostnameCandidate,
    );

  if (!looksLikeHost) {
    return value;
  }

  if (allowedProtocols.includes("https:")) {
    return `https://${value}`;
  }

  if (allowedProtocols.includes("http:")) {
    return `http://${value}`;
  }

  if (allowedProtocols.includes("wss:")) {
    return `wss://${value}`;
  }

  if (allowedProtocols.includes("ws:")) {
    return `ws://${value}`;
  }

  return value;
}

function normalizeConfiguredUrl(
  value: string | undefined,
  {
    envName,
    fallback,
    allowedProtocols,
    stripTrailingV1 = false,
  }: {
    envName: string;
    fallback: string;
    allowedProtocols: readonly string[];
    stripTrailingV1?: boolean;
  },
): string {
  const trimmedValue = value?.trim();
  const candidate = trimmedValue?.length ? trimmedValue : fallback;
  const candidateWithProtocol = addDefaultProtocolIfMissing(candidate, allowedProtocols);
  const normalizedCandidate = stripTrailingV1
    ? candidateWithProtocol.replace(/\/v1\/?$/, "")
    : candidateWithProtocol;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(normalizedCandidate);
  } catch {
    throw new Error(
      `Invalid ${envName} "${trimmedValue}". Expected an absolute URL using ${allowedProtocols.join(" or ")}.`,
    );
  }

  if (!allowedProtocols.includes(parsedUrl.protocol)) {
    throw new Error(
      `Invalid ${envName} "${trimmedValue}". Expected an absolute URL using ${allowedProtocols.join(" or ")}.`,
    );
  }

  return parsedUrl.toString().replace(/\/$/, "");
}

function deriveGatewayWsUrl(gameServerOrigin: string): string {
  const httpBase = new URL(gameServerOrigin);
  const wsUrl = new URL("/v1/gateway/ws", httpBase);
  wsUrl.protocol = httpBase.protocol === "https:" ? "wss:" : "ws:";
  return wsUrl.toString();
}

export interface PublicUrlConfig {
  apiOrigin: string;
  gameServerOrigin: string;
  trackerOrigin: string;
  gatewayWsUrl: string;
  simulatorAssetBaseUrl: string;
  lorcanaAssetBaseUrl: string;
}

export function getPublicUrlConfig(): PublicUrlConfig {
  const apiOrigin = normalizeConfiguredUrl(env.PUBLIC_API_URL, {
    envName: "PUBLIC_API_URL",
    fallback: DEFAULT_API_ORIGIN,
    allowedProtocols: ["http:", "https:"],
    stripTrailingV1: true,
  });

  const gameServerOrigin = normalizeConfiguredUrl(env.PUBLIC_GAME_SERVER_URL, {
    envName: "PUBLIC_GAME_SERVER_URL",
    fallback: DEFAULT_GAME_SERVER_ORIGIN,
    allowedProtocols: ["http:", "https:"],
    stripTrailingV1: true,
  });

  const trackerOrigin = normalizeConfiguredUrl(env.PUBLIC_TRACKER_URL, {
    envName: "PUBLIC_TRACKER_URL",
    fallback: DEFAULT_TRACKER_ORIGIN,
    allowedProtocols: ["http:", "https:"],
  });

  const simulatorAssetBaseUrl = normalizeConfiguredUrl(env.PUBLIC_SIMULATOR_ASSET_BASE_URL, {
    envName: "PUBLIC_SIMULATOR_ASSET_BASE_URL",
    fallback: DEFAULT_SIMULATOR_ASSET_BASE_URL,
    allowedProtocols: ["http:", "https:"],
  });

  const lorcanaAssetBaseUrl = normalizeConfiguredUrl(env.PUBLIC_LORCANA_ASSET_BASE_URL, {
    envName: "PUBLIC_LORCANA_ASSET_BASE_URL",
    fallback: DEFAULT_LORCANA_ASSET_BASE_URL,
    allowedProtocols: ["http:", "https:"],
  });

  const gatewayWsUrl = env.PUBLIC_GATEWAY_WS_URL?.trim().length
    ? normalizeConfiguredUrl(env.PUBLIC_GATEWAY_WS_URL, {
        envName: "PUBLIC_GATEWAY_WS_URL",
        fallback: deriveGatewayWsUrl(gameServerOrigin),
        allowedProtocols: ["ws:", "wss:"],
      })
    : deriveGatewayWsUrl(gameServerOrigin);

  return {
    apiOrigin,
    gameServerOrigin,
    trackerOrigin,
    gatewayWsUrl,
    simulatorAssetBaseUrl,
    lorcanaAssetBaseUrl,
  };
}

export function getApiOrigin(): string {
  return getPublicUrlConfig().apiOrigin;
}

export function getGameServerOrigin(): string {
  return getPublicUrlConfig().gameServerOrigin;
}

export function getTrackerOrigin(): string {
  return getPublicUrlConfig().trackerOrigin;
}

export function getGatewayWsUrl(): string {
  return getPublicUrlConfig().gatewayWsUrl;
}

export function getSimulatorAssetBaseUrl(): string {
  return getPublicUrlConfig().simulatorAssetBaseUrl;
}

export function getLorcanaAssetBaseUrl(): string {
  return getPublicUrlConfig().lorcanaAssetBaseUrl;
}

export function buildSimulatorAssetUrl(path: string): string {
  const relativePath = path.replace(/^\/+/, "");
  return `${getSimulatorAssetBaseUrl()}/${relativePath}`;
}

export function buildLorcanaAssetUrl(path: string): string {
  const relativePath = path.replace(/^\/+/, "");
  return `${getLorcanaAssetBaseUrl()}/${relativePath}`;
}

const FALLBACK_CDN_ORIGIN = "https://r2.tcg.online";

export function getCdnFallbackUrl(url: string): string | null {
  // Collect the distinct origins from both asset base URLs so that both
  // simulator assets (card backs, playmats) and lorcana card images get a
  // fallback even when the two bases are configured to different origins.
  const candidateOrigins = new Set<string>();
  for (const base of [getLorcanaAssetBaseUrl(), getSimulatorAssetBaseUrl()]) {
    try {
      candidateOrigins.add(new URL(base).origin);
    } catch {
      // ignore invalid base
    }
  }

  for (const origin of candidateOrigins) {
    if (origin !== FALLBACK_CDN_ORIGIN && url.startsWith(origin)) {
      return FALLBACK_CDN_ORIGIN + url.slice(origin.length);
    }
  }
  return null;
}
