import { describe, expect, it } from "vitest";

import {
  defaultPrintingForLocale,
  localeAssetUrlsForCard,
  withLocaleAssets,
} from "./locale-assets.ts";
import type { FleshAndBloodPrinting } from "@tcg/flesh-and-blood-types/catalog";

const printing = (overrides: Partial<FleshAndBloodPrinting>): FleshAndBloodPrinting =>
  ({
    id: "p-default",
    imageUrl: "https://cdn.example/full/default.webp",
    locale: "en-US",
    ...overrides,
  }) as FleshAndBloodPrinting;

describe("defaultPrintingForLocale", () => {
  const printings = [
    printing({ id: "p-en", locale: "en-US" }),
    printing({ id: "p-fr", locale: "fr-FR", imageUrl: "https://cdn.example/full/fr.webp" }),
    printing({ id: "p-empty", locale: "en-GB", imageUrl: "" }),
  ];

  it("prefers an exact locale match that carries a face image", () => {
    expect(defaultPrintingForLocale(printings, "fr-FR")?.id).toBe("p-fr");
  });

  it("falls back to a language-only match", () => {
    expect(defaultPrintingForLocale(printings, "en-GB")?.id).toBe("p-en");
  });

  it("skips printings without a face image", () => {
    expect(defaultPrintingForLocale(printings, "en-GB")?.id).not.toBe("p-empty");
  });

  it("returns undefined when no printing matches", () => {
    expect(defaultPrintingForLocale(printings, "de-DE")).toBeUndefined();
  });
});

describe("localeAssetUrlsForCard", () => {
  it("derives both asset URLs from the matched printing", () => {
    expect(
      localeAssetUrlsForCard(
        [printing({ boardImageUrl: "https://cdn.example/board/default.webp" })],
        "en-US",
      ),
    ).toEqual({
      imageUrl: "https://cdn.example/full/default.webp",
      boardImageUrl: "https://cdn.example/board/default.webp",
    });
  });

  it("falls back to the face image for the board crop", () => {
    expect(localeAssetUrlsForCard([printing({ boardImageUrl: undefined })], "en-US")).toEqual({
      imageUrl: "https://cdn.example/full/default.webp",
      boardImageUrl: "https://cdn.example/full/default.webp",
    });
  });

  it("returns undefined when nothing matches", () => {
    expect(localeAssetUrlsForCard([printing({ locale: "fr-FR" })], "de-DE")).toBeUndefined();
  });
});

describe("withLocaleAssets", () => {
  it("attaches derived URLs without mutating authored fields", () => {
    const text = { name: "Test", typeText: "Warrior Action - Attack" };
    expect(withLocaleAssets(text, { imageUrl: "a.webp", boardImageUrl: "b.webp" })).toEqual({
      name: "Test",
      typeText: "Warrior Action - Attack",
      imageUrl: "a.webp",
      boardImageUrl: "b.webp",
    });
  });

  it("keeps authored values over derived ones", () => {
    const text = {
      name: "Test",
      typeText: "Warrior Action - Attack",
      imageUrl: "authored.webp",
    };
    expect(withLocaleAssets(text, { imageUrl: "derived.webp", boardImageUrl: "b.webp" })).toEqual({
      name: "Test",
      typeText: "Warrior Action - Attack",
      imageUrl: "authored.webp",
      boardImageUrl: "b.webp",
    });
  });

  it("returns the record unchanged without assets", () => {
    const text = { name: "Test", typeText: "Warrior Action - Attack" };
    expect(withLocaleAssets(text, undefined)).toBe(text);
  });
});
