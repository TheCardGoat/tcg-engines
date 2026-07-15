import { serverFetch } from "$lib/server/fetch-with-cf.js";

export class ServerJsonError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly statusText: string,
    readonly url: string,
  ) {
    super(message);
    this.name = "ServerJsonError";
  }
}

export async function serverJsonOrNull<T>(url: string, init?: RequestInit): Promise<T | null> {
  const response = await serverFetch(url, init);
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as T;
}

export async function serverJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await serverFetch(url, init);
  if (!response.ok) {
    throw new ServerJsonError(
      `Server request failed: ${response.status}`,
      response.status,
      response.statusText,
      url,
    );
  }
  return (await response.json()) as T;
}
