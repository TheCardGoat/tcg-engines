export interface HttpRequestErrorPayload {
  error?: string;
  message?: string;
}

export class HttpRequestError extends Error {
  readonly status: number;
  readonly url: string;
  readonly payload: unknown;

  constructor(params: { message: string; status: number; url: string; payload: unknown }) {
    super(params.message);
    this.name = "HttpRequestError";
    this.status = params.status;
    this.url = params.url;
    this.payload = params.payload;
  }
}

function toErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "object" && payload !== null) {
    const record = payload as HttpRequestErrorPayload;
    if (typeof record.message === "string" && record.message.length > 0) {
      return record.message;
    }

    if (typeof record.error === "string" && record.error.length > 0) {
      return record.error;
    }
  }

  if (typeof payload === "string" && payload.length > 0) {
    return payload;
  }

  return fallback;
}

async function readResponsePayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => null);
}

function buildInit(init: RequestInit | undefined): RequestInit {
  return {
    credentials: "include",
    ...init,
  };
}

export async function requestJson<T>(
  url: string,
  init?: RequestInit,
  fallbackMessage?: string,
): Promise<T> {
  const response = await fetch(url, buildInit(init));

  if (!response.ok) {
    const payload = await readResponsePayload(response);
    throw new HttpRequestError({
      message: toErrorMessage(payload, fallbackMessage ?? `Request failed: ${response.status}`),
      status: response.status,
      url,
      payload,
    });
  }

  return (await response.json()) as T;
}

export async function requestVoid(
  url: string,
  init?: RequestInit,
  fallbackMessage?: string,
): Promise<void> {
  const response = await fetch(url, buildInit(init));

  if (response.ok || response.status === 204) {
    return;
  }

  const payload = await readResponsePayload(response);
  throw new HttpRequestError({
    message: toErrorMessage(payload, fallbackMessage ?? `Request failed: ${response.status}`),
    status: response.status,
    url,
    payload,
  });
}

export async function requestJsonOrNull<T>(
  url: string,
  init?: RequestInit,
  allowedStatusCodes: number[] = [404],
): Promise<T | null> {
  const response = await fetch(url, buildInit(init));

  if (allowedStatusCodes.includes(response.status)) {
    return null;
  }

  if (!response.ok) {
    const payload = await readResponsePayload(response);
    throw new HttpRequestError({
      message: toErrorMessage(payload, `Request failed: ${response.status}`),
      status: response.status,
      url,
      payload,
    });
  }

  return (await response.json()) as T;
}

export async function requestArrayBuffer(
  url: string,
  init?: RequestInit,
  fallbackMessage?: string,
): Promise<ArrayBuffer> {
  const response = await fetch(url, buildInit(init));

  if (!response.ok) {
    const payload = await readResponsePayload(response);
    throw new HttpRequestError({
      message: toErrorMessage(payload, fallbackMessage ?? `Request failed: ${response.status}`),
      status: response.status,
      url,
      payload,
    });
  }

  return response.arrayBuffer();
}
