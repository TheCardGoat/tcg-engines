/**
 * Display-name normalization tests for card lookup matching.
 */

import { describe, expect, it } from "bun:test";
import {
  normalizeDisplayNameApostropheInsensitive,
  normalizeDisplayNameForMatch,
} from "./display-name-normalize";

describe("normalizeDisplayNameForMatch", () => {
  it("trims whitespace", () => {
    expect(normalizeDisplayNameForMatch("  Ariel - On Human Legs  ")).toBe("ariel - on human legs");
  });

  it("strips trailing ! and ?", () => {
    expect(normalizeDisplayNameForMatch("You Can Fly!")).toBe("you can fly");
    expect(normalizeDisplayNameForMatch("What?")).toBe("what");
    expect(normalizeDisplayNameForMatch("Title?!")).toBe("title");
  });

  it("normalizes hyphen-like code points to ASCII hyphen", () => {
    // U+2011 NON-BREAKING HYPHEN
    expect(normalizeDisplayNameForMatch("Fix\u2011It")).toBe("fix-it");
    // U+2212 MINUS SIGN
    expect(normalizeDisplayNameForMatch("Card\u2212Name")).toBe("card-name");
    expect(normalizeDisplayNameForMatch("Fix-It")).toBe("fix-it");
  });

  it("normalizes apostrophe-like code points to ASCII apostrophe", () => {
    // U+2019 RIGHT SINGLE QUOTATION MARK
    expect(normalizeDisplayNameForMatch("A Pirate\u2019s Life")).toBe("a pirate's life");
    expect(normalizeDisplayNameForMatch("Funso's Funzone")).toBe("funso's funzone");
  });

  it("normalizes comma-like code points to ASCII comma", () => {
    // U+FF0C FULLWIDTH COMMA
    expect(normalizeDisplayNameForMatch("Title\uFF0C Subtitle")).toBe("title, subtitle");
    // U+060C ARABIC COMMA
    expect(normalizeDisplayNameForMatch("Name\u060C Version")).toBe("name, version");
  });

  it("normalizes fullwidth space to ASCII space", () => {
    expect(normalizeDisplayNameForMatch("Card\u3000Name")).toBe("card name");
  });

  it("applies NFKC and lowercasing", () => {
    expect(normalizeDisplayNameForMatch("Sail The Azurite Sea")).toBe("sail the azurite sea");
    expect(normalizeDisplayNameForMatch("MOTHER GOTHEL - DEVIOUS CONSPIRATOR")).toBe(
      "mother gothel - devious conspirator",
    );
  });

  it("combines multiple normalizations", () => {
    expect(normalizeDisplayNameForMatch("  Fix\u2011It\uFF0C Version!  ")).toBe("fix-it, version");
  });
});

describe("normalizeDisplayNameApostropheInsensitive", () => {
  it("removes ASCII apostrophe after full normalization", () => {
    expect(normalizeDisplayNameApostropheInsensitive("Funso's Funzone")).toBe("funsos funzone");
    expect(normalizeDisplayNameApostropheInsensitive("Duckburg - Funso's Funzone")).toBe(
      "duckburg - funsos funzone",
    );
  });

  it("matches query without apostrophe to card with apostrophe", () => {
    const withApos = normalizeDisplayNameApostropheInsensitive("Duckburg - Funso's Funzone");
    const withoutApos = normalizeDisplayNameApostropheInsensitive("Duckburg - Funsos Funzone");
    expect(withApos).toBe(withoutApos);
  });

  it("still normalizes hyphens and other punctuation", () => {
    expect(normalizeDisplayNameApostropheInsensitive("Fix\u2011It!")).toBe("fix-it");
  });
});
