import { describe, expect, it } from "bun:test";

import { validateAndNormalizePrivateApiOrigin } from "./fetch-with-cf-utils.js";

describe("validateAndNormalizePrivateApiOrigin", () => {
  it("normalizes absolute http urls", () => {
    expect(validateAndNormalizePrivateApiOrigin("http://api.internal/v1/")).toBe(
      "http://api.internal",
    );
  });

  it("normalizes bare hostnames to https urls", () => {
    expect(validateAndNormalizePrivateApiOrigin("api.example.com/v1")).toBe(
      "https://api.example.com",
    );
  });

  it("normalizes railway private urls with an explicit port", () => {
    expect(validateAndNormalizePrivateApiOrigin("new-api.railway.internal:8080/v1")).toBe(
      "http://new-api.railway.internal:8080",
    );
  });

  it("defaults railway private urls without an explicit port to 8080", () => {
    expect(validateAndNormalizePrivateApiOrigin("new-api.railway.internal/v1")).toBe(
      "http://new-api.railway.internal:8080",
    );
  });

  it("treats railway private hostnames case-insensitively", () => {
    expect(validateAndNormalizePrivateApiOrigin("NEW-API.RAILWAY.INTERNAL/v1")).toBe(
      "http://new-api.railway.internal:8080",
    );
  });

  it("does not downgrade non-railway hostnames that merely contain the suffix", () => {
    expect(validateAndNormalizePrivateApiOrigin("new-api.railway.internal.evil.com/v1")).toBe(
      "https://new-api.railway.internal.evil.com",
    );
  });

  it("rejects non-absolute values", () => {
    expect(() => validateAndNormalizePrivateApiOrigin("/relative/path")).toThrow(
      "Invalid PRIVATE_API_URL: must be an absolute http(s) URL.",
    );
  });

  it("rejects unsupported protocols", () => {
    expect(() => validateAndNormalizePrivateApiOrigin("ftp://api.internal")).toThrow(
      'Invalid PRIVATE_API_URL protocol "ftp:": only http and https are supported.',
    );
  });
});
