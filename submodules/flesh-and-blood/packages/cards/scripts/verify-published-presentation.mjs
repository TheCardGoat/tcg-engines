import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

export const CORS_ORIGIN = "https://tcg.online";
const REQUEST_TIMEOUT_MS = 15_000;
const IMAGE_CONCURRENCY = 8;
const IMAGE_RETRIES = 2;

export function createCdnRequest(init = {}) {
  const { timeoutMs = REQUEST_TIMEOUT_MS, headers, ...rest } = init;
  return {
    ...rest,
    headers: { Origin: CORS_ORIGIN, ...headers },
    signal: AbortSignal.timeout(timeoutMs),
  };
}

function isRetryable(error) {
  return error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
}

export async function fetchCdn(url, init = {}, { retries = 0, fetchImpl = fetch } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fetchImpl(url, createCdnRequest(init));
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === retries) throw error;
    }
  }
  throw lastError;
}

function assertPublicCors(response, label) {
  if (response.headers.get("access-control-allow-origin") !== "*") {
    throw new Error(`${label} requires public CORS`);
  }
}

export async function verifyPublishedPresentation({
  bytes,
  catalogOnly = false,
  fetchImpl = fetch,
} = {}) {
  const revision = createHash("sha256").update(bytes).digest("hex");
  const catalogUrl = `https://cdn.tcg.online/public/fab/presentation/${revision}.json`;
  const response = await fetchCdn(catalogUrl, {}, { fetchImpl });
  if (!response.ok) throw new Error(`Presentation artifact not published: ${response.status}`);
  const published = Buffer.from(await response.arrayBuffer());
  if (!published.equals(bytes))
    throw new Error("Published catalog bytes differ from generated artifact");
  if (!response.headers.get("cache-control")?.includes("immutable")) {
    throw new Error("Catalog must be immutable");
  }
  assertPublicCors(response, "Catalog");
  const urls = [
    ...new Set(
      Object.values(JSON.parse(bytes).records).flatMap((record) =>
        Object.values(record.printings).flatMap((printing) =>
          [printing.boardImageUrl, printing.printedImageUrl].filter(Boolean),
        ),
      ),
    ),
  ];
  if (catalogOnly) {
    return { revision, imageUrls: urls.length, checkedImageUrls: 0 };
  }
  let cursor = 0;
  await Promise.all(
    Array.from({ length: IMAGE_CONCURRENCY }, async () => {
      while (cursor < urls.length) {
        const url = urls[cursor++];
        const asset = await fetchCdn(
          url,
          { method: "HEAD" },
          { retries: IMAGE_RETRIES, fetchImpl },
        );
        if (!asset.ok) throw new Error(`Published asset missing: ${url} (${asset.status})`);
        assertPublicCors(asset, `Asset ${url}`);
      }
    }),
  );
  return { revision, imageUrls: urls.length, checkedImageUrls: urls.length };
}

if (import.meta.main) {
  const bytes = await readFile(
    new URL("../src/generated/presentation-catalog.json", import.meta.url),
  );
  const result = await verifyPublishedPresentation({
    bytes,
    catalogOnly: process.argv.includes("--catalog-only"),
  });
  console.log(
    result.checkedImageUrls === 0
      ? `Verified catalog ${result.revision} (${result.imageUrls} image URLs not fetched)`
      : `Verified ${result.revision}, ${result.checkedImageUrls} image URLs`,
  );
}
