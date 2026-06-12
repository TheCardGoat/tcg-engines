import { describe, expect, it } from "bun:test";
import { GDPR_STRICT_COUNTRIES, isGdprStrictCountry, normalizeCfCountry } from "./eu-countries.js";

describe("isGdprStrictCountry", () => {
  it("returns true for EU member states", () => {
    expect(isGdprStrictCountry("FR")).toBe(true);
    expect(isGdprStrictCountry("DE")).toBe(true);
    expect(isGdprStrictCountry("ES")).toBe(true);
  });

  it("returns true for EEA members (Iceland, Liechtenstein, Norway)", () => {
    expect(isGdprStrictCountry("IS")).toBe(true);
    expect(isGdprStrictCountry("LI")).toBe(true);
    expect(isGdprStrictCountry("NO")).toBe(true);
  });

  it("returns true for the UK (UK GDPR)", () => {
    expect(isGdprStrictCountry("GB")).toBe(true);
  });

  it("returns false for non-GDPR countries", () => {
    expect(isGdprStrictCountry("US")).toBe(false);
    expect(isGdprStrictCountry("BR")).toBe(false);
    expect(isGdprStrictCountry("JP")).toBe(false);
  });

  it("returns false for nullish/empty values", () => {
    expect(isGdprStrictCountry(null)).toBe(false);
    expect(isGdprStrictCountry(undefined)).toBe(false);
    expect(isGdprStrictCountry("")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(isGdprStrictCountry("fr")).toBe(true);
    expect(isGdprStrictCountry("gb")).toBe(true);
  });

  it("covers all 27 EU + 3 EEA + UK = 31 countries", () => {
    expect(GDPR_STRICT_COUNTRIES.size).toBe(31);
  });
});

describe("normalizeCfCountry", () => {
  it("returns the uppercase ISO code for valid 2-letter inputs", () => {
    expect(normalizeCfCountry("fr")).toBe("FR");
    expect(normalizeCfCountry("US")).toBe("US");
  });

  it("returns null for Cloudflare unknown / Tor sentinels", () => {
    expect(normalizeCfCountry("XX")).toBeNull();
    expect(normalizeCfCountry("xx")).toBeNull();
    expect(normalizeCfCountry("T1")).toBeNull();
  });

  it("returns null for nullish or malformed inputs", () => {
    expect(normalizeCfCountry(null)).toBeNull();
    expect(normalizeCfCountry(undefined)).toBeNull();
    expect(normalizeCfCountry("")).toBeNull();
    expect(normalizeCfCountry("USA")).toBeNull();
    expect(normalizeCfCountry("F")).toBeNull();
  });
});
