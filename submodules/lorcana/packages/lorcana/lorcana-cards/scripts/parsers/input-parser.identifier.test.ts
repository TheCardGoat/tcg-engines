import { describe, expect, it } from "bun:test";
import { generatePrintingId, parseCardIdentifier } from "./input-parser";

describe("parseCardIdentifier", () => {
  it("parses standard Ravensburger identifiers", () => {
    const p = parseCardIdentifier("18/204 EN 12");
    expect(p).toEqual({
      cardNumber: 18,
      totalCards: 204,
      language: "EN",
      setNumber: 12,
    });
  });

  it("parses promo sheet identifiers (P3)", () => {
    const p = parseCardIdentifier("43/P3 EN 12");
    expect(p).toEqual({
      cardNumber: 43,
      totalCards: 0,
      language: "EN",
      setNumber: 12,
      promoSheetCode: "P3",
    });
  });

  it("is case-insensitive on the promo sheet code", () => {
    const p = parseCardIdentifier("53/p3 EN 12");
    expect(p?.promoSheetCode).toBe("P3");
    expect(p?.cardNumber).toBe(53);
  });
});

describe("generatePrintingId", () => {
  it("uses p3 segment to avoid collisions with main-set numbering", () => {
    expect(generatePrintingId("set12", 53, "challenge", "P3")).toBe("set12-p3-053-challenge");
    expect(generatePrintingId("set12", 53, null, "P3")).toBe("set12-p3-053");
    expect(generatePrintingId("set12", 53, null, undefined)).toBe("set12-053");
  });

  it("combines promo sheet with enchanted suffix", () => {
    expect(generatePrintingId("set12", 54, "enchanted", "P3")).toBe("set12-p3-054-enchanted");
  });
});
