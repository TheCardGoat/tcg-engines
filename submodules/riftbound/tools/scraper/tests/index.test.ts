import { readFile } from "node:fs/promises";

import { describe, expect, it, vi } from "vitest";

import {
  extractGalleryPayloadFromHtml,
  scrapeRiotCardGallery,
  scrapeRiotContentApi,
} from "../src/index.ts";

const fixtureUrl = new URL("./fixtures/card-gallery.html", import.meta.url);

describe("Riftbound official-source scraper", () => {
  it("extracts the single complete Card Gallery payload without executing it", async () => {
    const html = await readFile(fixtureUrl, "utf8");
    expect(extractGalleryPayloadFromHtml(html)).toEqual({
      sets: [{ id: "OGN", name: "Origins", collectorNumberMax: 298 }],
      cards: [{ id: "ogn-001-298", collectorNumber: 1, name: "Test Unit" }],
      reportedTotal: 1,
    });
  });

  it("rejects missing, duplicated, injected, and incomplete Next data", () => {
    expect(() => extractGalleryPayloadFromHtml("<html></html>")).toThrow(
      "Expected exactly one __NEXT_DATA__ script",
    );
    const valid = '<script id="__NEXT_DATA__" type="application/json">{}</script>';
    expect(() => extractGalleryPayloadFromHtml(valid + valid)).toThrow("received 2");
    expect(() =>
      extractGalleryPayloadFromHtml(
        '<script id="__NEXT_DATA__" type="application/json">{"x":"</script><script>alert(1)</script>"}</script>',
      ),
    ).toThrow("did not contain valid JSON");
    expect(() =>
      extractGalleryPayloadFromHtml(
        '<script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"page":{"blades":[{"type":"riftboundCardGallery","sets":{"items":[]},"cards":{"items":[],"async":{"linkdata":{"totalItems":1}}}}]}}}}</script>',
      ),
    ).toThrow("returned no cards");
  });

  it("marks Card Gallery snapshots as local-development-only", async () => {
    const html = await readFile(fixtureUrl, "utf8");
    const snapshot = await scrapeRiotCardGallery("en_US", {
      fetchImpl: vi.fn(async () => new Response(html)) as typeof fetch,
      now: () => new Date("2026-07-20T12:00:00.000Z"),
    });
    expect(snapshot).toMatchObject({
      source: "riot-card-gallery",
      locale: "en-US",
      fetchedAt: "2026-07-20T12:00:00.000Z",
    });
    expect(snapshot.sha256).toMatch(/^[a-f0-9]{64}$/);
  });

  it("authenticates the official API and never places the key in its URL or snapshot", async () => {
    const fetchSpy = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect(new Headers(init?.headers).get("X-Riot-Token")).toBe("secret-key");
      return Response.json({ game: "riftbound", version: "2026.7", sets: [] });
    });
    const fetchImpl = fetchSpy as typeof fetch;
    const snapshot = await scrapeRiotContentApi({
      apiKey: "secret-key",
      fetchImpl,
      now: () => new Date("2026-07-20T12:00:00.000Z"),
    });
    expect(snapshot.source).toBe("riot-content-api");
    expect(snapshot.sourceVersion).toBe("2026.7");
    expect(JSON.stringify(snapshot)).not.toContain("secret-key");
    expect(String(fetchSpy.mock.calls[0]?.[0])).not.toContain("secret-key");
  });

  it("retries rate limits and transient failures but not authentication failures", async () => {
    const sleep = vi.fn(async () => undefined);
    const rateLimited = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 429, headers: { "retry-after": "1" } }))
      .mockResolvedValueOnce(Response.json({ game: "riftbound", version: "v1", sets: [] }));
    await scrapeRiotContentApi({
      apiKey: "key",
      fetchImpl: rateLimited as typeof fetch,
      sleep,
    });
    expect(rateLimited).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledWith(1_000);

    const unauthorized = vi.fn(async () => new Response(null, { status: 401 }));
    await expect(
      scrapeRiotContentApi({ apiKey: "key", fetchImpl: unauthorized as typeof fetch }),
    ).rejects.toMatchObject({ status: 401 });
    expect(unauthorized).toHaveBeenCalledTimes(1);
  });

  it("reports malformed official API JSON without leaking credentials", async () => {
    const response = new Response("not-json", {
      status: 200,
      headers: { "content-type": "application/json" },
    });
    await expect(
      scrapeRiotContentApi({
        apiKey: "do-not-log-this",
        fetchImpl: vi.fn(async () => response) as typeof fetch,
      }),
    ).rejects.toThrow("malformed JSON");
  });

  it("retries transient server failures and reports timeouts safely", async () => {
    const transient = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json({ game: "riftbound", version: "v1", sets: [] }));
    await scrapeRiotContentApi({
      apiKey: "key",
      fetchImpl: transient as typeof fetch,
      sleep: async () => undefined,
    });
    expect(transient).toHaveBeenCalledTimes(2);

    const timeoutFetch = vi.fn(
      async (_input: string | URL | Request, init?: RequestInit): Promise<Response> =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    await expect(
      scrapeRiotContentApi({
        apiKey: "timeout-secret",
        fetchImpl: timeoutFetch as typeof fetch,
        timeoutMs: 1,
      }),
    ).rejects.toThrow("timed out");
  });
});
