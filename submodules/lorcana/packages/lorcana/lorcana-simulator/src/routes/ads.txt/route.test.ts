import { beforeEach, describe, expect, it, mock } from "bun:test";

const privateEnv: Record<string, string | undefined> = {};

mock.module("$env/dynamic/private", () => ({ env: privateEnv }));

const { GET } = await import("./+server");

describe("GET /ads.txt", () => {
  beforeEach(() => {
    delete privateEnv.UPSTREAM_ADS_TXT_URL;
  });

  it("returns an intentional empty response when no upstream is configured", async () => {
    const fetchMock = mock(async () => new Response("unused"));

    const response = await GET({ fetch: fetchMock } as never);

    expect(response.status).toBe(204);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.headers.get("cache-control")).toBe("public, max-age=86400");
  });

  it("proxies and caches the configured upstream file", async () => {
    privateEnv.UPSTREAM_ADS_TXT_URL = "https://ads.example/ads.txt";
    const fetchMock = mock(async () => new Response("example.com, seller, DIRECT"));

    const response = await GET({ fetch: fetchMock } as never);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("example.com, seller, DIRECT");
    expect(fetchMock).toHaveBeenCalledWith("https://ads.example/ads.txt");
    expect(response.headers.get("content-type")).toBe("text/plain");
  });
});
