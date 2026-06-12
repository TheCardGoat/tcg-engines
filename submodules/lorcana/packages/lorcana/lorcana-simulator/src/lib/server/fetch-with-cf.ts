import { env } from "$env/dynamic/private";
import { validateAndNormalizePrivateApiOrigin } from "./fetch-with-cf-utils.js";

function getClientId(): string | undefined {
  return env.CF_ACCESS_CLIENT_ID ?? env["CF-ACCESS-CLIENT-ID"];
}

function getClientSecret(): string | undefined {
  return env.CF_ACCESS_CLIENT_SECRET ?? env["CF-ACCESS-CLIENT-SECRET"];
}

function getInternalServiceToken(): string | undefined {
  return env.INTERNAL_SERVICE_TOKEN;
}

export function getServerApiOrigin(publicOrigin: string): string {
  const privateOrigin = env.PRIVATE_API_URL?.trim();
  return privateOrigin ? validateAndNormalizePrivateApiOrigin(privateOrigin) : publicOrigin;
}

export function getServerGameServerOrigin(publicOrigin: string): string {
  const privateOrigin = env.PRIVATE_GAME_SERVER_URL?.trim();
  return privateOrigin ? validateAndNormalizePrivateApiOrigin(privateOrigin) : publicOrigin;
}

export async function serverFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = init?.headers ? new Headers(init.headers) : new Headers();
  const clientId = getClientId();
  const clientSecret = getClientSecret();
  const internalToken = getInternalServiceToken();

  if (clientId && clientSecret) {
    headers.set("CF-Access-Client-Id", clientId);
    headers.set("CF-Access-Client-Secret", clientSecret);
  }

  if (internalToken) {
    headers.set("X-Internal-Token", internalToken);
  }

  const response = await fetch(url, { ...init, headers });

  return response;
}
