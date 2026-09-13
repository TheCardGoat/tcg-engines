import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import {
  CORS_ORIGIN,
  createCdnRequest,
  fetchCdn,
  verifyPublishedPresentation,
} from "./verify-published-presentation.mjs";

const imageHash = "a".repeat(64);
const catalog = {
  schemaVersion: 1,
  game: "flesh-and-blood",
  records: {
    card: {
      printings: {
        printing: {
          boardImageUrl: `https://cdn.tcg.online/public/fab/assets/board/${imageHash}.webp`,
          printedImageUrl: `https://cdn.tcg.online/public/fab/assets/full/${imageHash}.webp`,
        },
      },
    },
  },
};
const bytes = Buffer.from(`${JSON.stringify(catalog)}\n`);
const revision = createHash("sha256").update(bytes).digest("hex");

const corsHeaders = (extra = {}) =>
  new Headers({
    "access-control-allow-origin": "*",
    "cache-control": "public,max-age=31536000,immutable",
    ...extra,
  });

test("CDN requests send Origin so Cloudflare returns CORS headers", () => {
  const request = createCdnRequest({ method: "HEAD" });
  assert.equal(request.headers.Origin, CORS_ORIGIN);
  assert.equal(request.method, "HEAD");
  assert.ok(request.signal);
});

test("fetchCdn retries timeout errors with a fresh abort signal", async () => {
  let attempts = 0;
  const fetchImpl = async (_url, init) => {
    attempts += 1;
    assert.equal(init.headers.Origin, CORS_ORIGIN);
    if (attempts === 1) {
      const error = new Error("The operation was aborted due to timeout");
      error.name = "TimeoutError";
      throw error;
    }
    return new Response(null, { status: 200, headers: corsHeaders() });
  };
  const response = await fetchCdn(
    "https://cdn.tcg.online/public/fab/assets/board/x.webp",
    { method: "HEAD" },
    {
      retries: 2,
      fetchImpl,
    },
  );
  assert.equal(attempts, 2);
  assert.equal(response.ok, true);
});

test("verifies catalog bytes, immutable cache, and CORS without fetching images", async () => {
  const fetchImpl = async (url) => {
    assert.equal(url, `https://cdn.tcg.online/public/fab/presentation/${revision}.json`);
    return new Response(bytes, { status: 200, headers: corsHeaders() });
  };
  const result = await verifyPublishedPresentation({ bytes, catalogOnly: true, fetchImpl });
  assert.deepEqual(result, { revision, imageUrls: 2, checkedImageUrls: 0 });
});

test("full verify HEADs each referenced image with Origin", async () => {
  const seen = [];
  const fetchImpl = async (url, init) => {
    seen.push({ url, method: init.method ?? "GET", origin: init.headers.Origin });
    if (url.endsWith(".json")) return new Response(bytes, { status: 200, headers: corsHeaders() });
    return new Response(null, { status: 200, headers: corsHeaders() });
  };
  const result = await verifyPublishedPresentation({ bytes, fetchImpl });
  assert.equal(result.checkedImageUrls, 2);
  assert.deepEqual(
    seen.map((entry) => entry.origin),
    [CORS_ORIGIN, CORS_ORIGIN, CORS_ORIGIN],
  );
  assert.equal(seen[1].method, "HEAD");
  assert.equal(seen[2].method, "HEAD");
});
