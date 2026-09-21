import { describe, expect, it } from "vitest";

describe("lightweight catalog data export", () => {
  it("loads card metadata without exposing physical printings", async () => {
    const { fleshAndBloodCardData } = await import("@tcg/flesh-and-blood-cards/catalog-data");
    const snatch = fleshAndBloodCardData.cards.find((card) => card.slug === "snatch-red");

    expect(snatch?.name).toBe("Snatch");
    expect(snatch).not.toHaveProperty("printings");
    expect(snatch).not.toHaveProperty("pitch");
    expect(snatch).not.toHaveProperty("power");
    expect(snatch).not.toHaveProperty("types");
    expect(snatch).not.toHaveProperty("cardKeywords");
    expect(snatch).not.toHaveProperty("abilitiesAndEffects");
    expect(fleshAndBloodCardData.cards).toHaveLength(5_195);
    expect(fleshAndBloodCardData.provenance?.sourceRef).toBe("usurp-the-shadow-throne");
    expect(fleshAndBloodCardData.provenance?.sourceVersion).toBe(
      "9fb8c73011311720bc7add61fb8eaab00b131bc3",
    );
    expect(fleshAndBloodCardData.sets.map((set) => set.id)).toContain("IAR");
    expect(
      [
        "mgHQCcNt99TTCMcGGwK9h",
        "ttmGFLLWpcGcbwNDHNKfQ",
        "J97rQmTfP6zTBJBbmzBJj",
        "98CqQctT9798DjgnBQ6Fg",
        "2vfyA32UrTDEvWN89DzbY",
        "yZVKqsVG5nMJ5jkmz466z",
      ].every((canonicalId) =>
        fleshAndBloodCardData.cards.some((card) => card.canonicalId === canonicalId),
      ),
    ).toBe(true);
  });

  it("ships the 2026-09-18 Banned and Restricted legalities", async () => {
    const { fleshAndBloodCardData } = await import("@tcg/flesh-and-blood-cards/catalog-data");
    type SparseLegalities = NonNullable<(typeof fleshAndBloodCardData.cards)[number]["legalities"]>;
    // https://fabtcg.com/articles/scheduled-banned-and-restricted-announcement-17-09-26/
    const allMatch = (name: string, match: (legalities: SparseLegalities) => boolean): boolean => {
      const cards = fleshAndBloodCardData.cards.filter((card) => card.name === name);
      return cards.length > 0 && cards.every((card) => match(card.legalities ?? {}));
    };
    const bannedIn = (format: keyof SparseLegalities) => (legalities: SparseLegalities) =>
      legalities[format]?.banned === true;

    expect(allMatch("Entwine Lightning", bannedIn("cc"))).toBe(true);
    expect(allMatch("Brand with Cinderclaw", bannedIn("cc"))).toBe(false);

    for (const name of [
      "Absorb in Aether",
      "Beaten Trackers",
      "Emeritus Scolding",
      "Harmonized Kodachi",
      "Lightning Press",
      "Pulping",
      "Sigil of Suffering",
      "Snapback",
    ]) {
      expect(allMatch(name, bannedIn("silverAge"))).toBe(true);
    }
    for (const name of [
      "Beckoning Haunt",
      "Deathly Delight",
      "Flourish",
      "Sirens of Safe Harbor",
      "Vantom Wraith",
      "Ira, Crimson Haze",
      "Kano",
      "Kayo",
    ]) {
      expect(allMatch(name, bannedIn("silverAge"))).toBe(false);
    }
    for (const name of ["Briar", "Oldhim", "Oscilio", "Chane"]) {
      expect(allMatch(name, (legalities) => legalities.silverAge?.legal === false)).toBe(true);
    }
  });
});
