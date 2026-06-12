import { DiscordSDK } from "@discord/embedded-app-sdk";
import type { CommandInput } from "@discord/embedded-app-sdk";

const DISCORD_READY_TIMEOUT_MS = 5_000;
const DISCORD_SCOPE_IDENTIFY = "identify";
const DISCORD_SCOPE_ACTIVITY_WRITE = "rpc.activities.write";
const TCG_ONLINE_HOSTNAME = "tcg.online";
const DISCORD_SENSITIVE_QUERY_PARAMS = [
  "authToken",
  "code",
  "frame_id",
  "instance_id",
  "platform",
  "playerId",
  "ticket",
] as const;

export type DiscordRichPresenceSkipReason =
  | "server"
  | "missing-client-id"
  | "outside-discord-activity"
  | "access-token-unavailable";

export type DiscordRichPresenceFailureReason = "ready-timeout" | "sdk-error";

export type DiscordRichPresenceResult =
  | { ok: true }
  | { ok: false; skipped: true; reason: DiscordRichPresenceSkipReason }
  | { ok: false; skipped: false; reason: DiscordRichPresenceFailureReason; error: Error };

export interface PlayingGamePresenceInput {
  readonly gameName: string;
  readonly startedAtMs?: number;
  readonly matchUrl?: string;
}

export interface UpdateDiscordRichPresenceInput extends PlayingGamePresenceInput {
  readonly clientId: string | null | undefined;
  readonly accessToken?: string | null;
  readonly exchangeAuthorizationCode?: DiscordAuthorizationCodeExchange;
  readonly href?: string;
  readonly readyTimeoutMs?: number;
  /** @internal Test seam for SDK command sequencing. */
  readonly sdkFactory?: DiscordRichPresenceSdkFactory;
}

export interface ClearDiscordRichPresenceInput {
  readonly clientId: string | null | undefined;
  readonly accessToken?: string | null;
  readonly exchangeAuthorizationCode?: DiscordAuthorizationCodeExchange;
  readonly href?: string;
  readonly readyTimeoutMs?: number;
  /** @internal Test seam for SDK command sequencing. */
  readonly sdkFactory?: DiscordRichPresenceSdkFactory;
}

export interface DiscordAuthorizationCodeExchangeInput {
  readonly clientId: string;
  readonly code: string;
}

export type DiscordAuthorizationCodeExchange = (
  input: DiscordAuthorizationCodeExchangeInput,
) => Promise<string | null | undefined>;

type DiscordPresenceCommands = Pick<
  DiscordSDK["commands"],
  "authenticate" | "authorize" | "setActivity"
>;

type DiscordRichPresenceSdk = Pick<DiscordSDK, "ready"> & {
  readonly commands: DiscordPresenceCommands;
};

type DiscordRichPresenceSdkFactory = (clientId: string) => DiscordRichPresenceSdk;

export function buildPlayingGameActivity({
  gameName,
  startedAtMs,
  matchUrl,
}: PlayingGamePresenceInput): CommandInput<"setActivity">[0]["activity"] {
  const details = `Playing ${gameName} on TCG.online`;
  const startSeconds =
    typeof startedAtMs === "number" && Number.isFinite(startedAtMs)
      ? Math.floor(startedAtMs / 1000)
      : Math.floor(Date.now() / 1000);

  return {
    type: 0,
    details,
    ...detailsUrlFor(matchUrl),
    state: "In a match",
    timestamps: {
      start: startSeconds,
    },
  };
}

export function buildDiscordRichPresenceMatchUrl(href: string): string | undefined {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return undefined;
  }

  for (const param of DISCORD_SENSITIVE_QUERY_PARAMS) {
    url.searchParams.delete(param);
  }
  url.hash = "";
  return detailsUrlFor(url.toString()).details_url;
}

export function isDiscordActivityLaunch(href: string): boolean {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }

  const params = url.searchParams;
  return Boolean(params.get("frame_id") && params.get("instance_id") && params.get("platform"));
}

export async function updateDiscordPlayingGamePresence({
  clientId,
  href,
  accessToken,
  exchangeAuthorizationCode,
  readyTimeoutMs = DISCORD_READY_TIMEOUT_MS,
  sdkFactory = createDiscordSdk,
  ...activityInput
}: UpdateDiscordRichPresenceInput): Promise<DiscordRichPresenceResult> {
  return runDiscordActivityCommand(
    { accessToken, clientId, exchangeAuthorizationCode, href, readyTimeoutMs, sdkFactory },
    (discordSdk) =>
      discordSdk.commands.setActivity({
        activity: buildPlayingGameActivity(activityInput),
      }),
  );
}

export async function clearDiscordPlayingGamePresence({
  accessToken,
  clientId,
  exchangeAuthorizationCode,
  href,
  readyTimeoutMs = DISCORD_READY_TIMEOUT_MS,
  sdkFactory = createDiscordSdk,
}: ClearDiscordRichPresenceInput): Promise<DiscordRichPresenceResult> {
  return runDiscordActivityCommand(
    { accessToken, clientId, exchangeAuthorizationCode, href, readyTimeoutMs, sdkFactory },
    (discordSdk) => discordSdk.commands.setActivity({ activity: null }),
  );
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_resolve, reject) => {
        timeout = setTimeout(
          () => reject(new Error("Timed out waiting for Discord SDK ready")),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

async function runDiscordActivityCommand(
  input: Required<Pick<ClearDiscordRichPresenceInput, "readyTimeoutMs" | "sdkFactory">> &
    Pick<
      ClearDiscordRichPresenceInput,
      "accessToken" | "clientId" | "exchangeAuthorizationCode" | "href"
    >,
  command: (discordSdk: DiscordRichPresenceSdk) => Promise<unknown>,
): Promise<DiscordRichPresenceResult> {
  const browserHref = getBrowserHref();
  if (!browserHref) {
    return { ok: false, skipped: true, reason: "server" };
  }

  const normalizedClientId = input.clientId?.trim();
  if (!normalizedClientId) {
    return { ok: false, skipped: true, reason: "missing-client-id" };
  }

  const currentHref = input.href ?? browserHref;
  if (!isDiscordActivityLaunch(currentHref)) {
    return { ok: false, skipped: true, reason: "outside-discord-activity" };
  }

  try {
    const discordSdk = input.sdkFactory(normalizedClientId);
    await withTimeout(discordSdk.ready(), input.readyTimeoutMs);
    const authorization = await discordSdk.commands.authorize({
      client_id: normalizedClientId,
      response_type: "code",
      prompt: "none",
      scope: [DISCORD_SCOPE_IDENTIFY, DISCORD_SCOPE_ACTIVITY_WRITE],
    });
    const accessToken = await resolveDiscordAccessToken({
      accessToken: input.accessToken,
      authorizationCode: authorization.code,
      clientId: normalizedClientId,
      exchangeAuthorizationCode: input.exchangeAuthorizationCode,
    });
    if (!accessToken) {
      return {
        ok: false,
        skipped: true,
        reason: "access-token-unavailable",
      };
    }
    await discordSdk.commands.authenticate({ access_token: accessToken });
    await command(discordSdk);
    return { ok: true };
  } catch (error) {
    const normalized = normalizeError(error);
    return {
      ok: false,
      skipped: false,
      reason:
        normalized.message === "Timed out waiting for Discord SDK ready"
          ? "ready-timeout"
          : "sdk-error",
      error: normalized,
    };
  }
}

async function resolveDiscordAccessToken({
  accessToken,
  authorizationCode,
  clientId,
  exchangeAuthorizationCode,
}: {
  readonly accessToken: string | null | undefined;
  readonly authorizationCode: string;
  readonly clientId: string;
  readonly exchangeAuthorizationCode: DiscordAuthorizationCodeExchange | undefined;
}): Promise<string | null> {
  const normalizedAccessToken = accessToken?.trim();
  if (normalizedAccessToken) {
    return normalizedAccessToken;
  }
  const exchangedAccessToken = await exchangeAuthorizationCode?.({
    clientId,
    code: authorizationCode,
  });
  return exchangedAccessToken?.trim() || null;
}

function detailsUrlFor(matchUrl: string | undefined): { readonly details_url?: string } {
  if (!matchUrl) {
    return {};
  }
  let url: URL;
  try {
    url = new URL(matchUrl.trim());
  } catch {
    return {};
  }
  if (url.protocol !== "https:" || !isTcgOnlineHostname(url.hostname)) {
    return {};
  }
  for (const param of DISCORD_SENSITIVE_QUERY_PARAMS) {
    url.searchParams.delete(param);
  }
  url.hash = "";
  return { details_url: url.toString() };
}

function isTcgOnlineHostname(hostname: string): boolean {
  return hostname === TCG_ONLINE_HOSTNAME || hostname.endsWith(`.${TCG_ONLINE_HOSTNAME}`);
}

function createDiscordSdk(clientId: string): DiscordRichPresenceSdk {
  return new DiscordSDK(clientId, { disableConsoleLogOverride: true });
}

function getBrowserHref(): string | null {
  const global = globalThis as typeof globalThis & {
    location?: {
      href?: string;
    };
  };
  return typeof global.location?.href === "string" ? global.location.href : null;
}
