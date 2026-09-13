import { describe, expect, it } from "vitest";
import {
  FAB_DECK_TEXT_FIXTURES,
  getFabDeckTextFixture,
  getFabDeckTextFixturesByFormat,
} from "./deck-text-fixtures.ts";

function countCopies(blob: string): number {
  return blob
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((sum, line) => {
      const match = /^(\d+)x\s+/.exec(line);
      return sum + (match ? Number(match[1]) : 0);
    }, 0);
}

describe("FAB deck text fixtures", () => {
  it("registers unique tournament text deck lists", () => {
    const ids = FAB_DECK_TEXT_FIXTURES.map((deck) => deck.id);
    expect(ids.length).toBeGreaterThanOrEqual(25);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("splits classic constructed and silver age pools", () => {
    expect(getFabDeckTextFixturesByFormat("classic-constructed").length).toBeGreaterThanOrEqual(20);
    expect(getFabDeckTextFixturesByFormat("silver-age")).toHaveLength(5);
  });

  it("embeds hero, arena, and pitch-colored main deck in the cards blob", () => {
    const gravy = getFabDeckTextFixture("cc-edinburgh-1st-gravy-bones");
    expect(gravy).toBeDefined();
    expect(gravy!.hero).toBe("Gravy Bones, Shipwrecked Looter");
    expect(gravy!.cards.startsWith("1x Gravy Bones, Shipwrecked Looter\n")).toBe(true);
    expect(gravy!.arena).toContain("1x Gold-Baited Hook");
    expect(gravy!.mainDeck).toContain("3x Blood in the Water (red)");
    expect(gravy!.mainDeck).toContain("3x Tip the Barkeep (blue)");
    expect(countCopies(gravy!.mainDeck)).toBe(69);
    expect(countCopies(gravy!.arena)).toBe(11);
  });

  it("keeps pitch disambiguation on multi-pitch names", () => {
    const tuffnut = getFabDeckTextFixture("cc-edinburgh-3rd-tuffnut");
    expect(tuffnut!.mainDeck).toContain("3x Buckwild (red)");
    expect(tuffnut!.mainDeck).toContain("3x Buckwild (yellow)");
    expect(tuffnut!.mainDeck).toContain("2x Buckwild (blue)");
  });

  it("keeps the supplied Malice and Viserai practice lists exact", () => {
    const malice = getFabDeckTextFixture("cc-2026-09-12-domina-on-my-corpse-malice");
    expect(countCopies(malice!.arena)).toBe(9);
    expect(countCopies(malice!.mainDeck)).toBe(71);
    expect(malice!.mainDeck).toContain("3x Shadowrealm Strength (red)");

    const viserai = getFabDeckTextFixture("cc-2026-09-13-shadow-sun-kissed-technique-viserai");
    expect(countCopies(viserai!.arena)).toBe(4);
    expect(countCopies(viserai!.mainDeck)).toBe(72);
    expect(viserai!.arena).toBe(
      "1x Crown of Dichotomy\n1x Dyadic Carapace\n1x Grasp of the Arknight\n1x Seven Sin Nebula",
    );
  });

  it("registers the grabbed profiled-hero FaBrary lists", () => {
    const crax = getFabDeckTextFixture("cc-mexico-nats-2025-1st-arakni-crax");
    expect(crax?.hero).toBe("Arakni, 5L!p3d 7hRu 7h3 cR4X");
    expect(countCopies(crax!.arena)).toBe(11);
    expect(countCopies(crax!.mainDeck)).toBe(69);

    const huntsman = getFabDeckTextFixture("cc-grave-troll-1st-arakni-huntsman");
    expect(huntsman?.hero).toBe("Arakni, Huntsman");
    expect(countCopies(huntsman!.mainDeck)).toBe(69);

    const web = getFabDeckTextFixture("sa-jakarta-showdown-5th-arakni-web");
    expect(web?.format).toBe("silver-age");
    expect(web?.hero).toBe("Arakni, Web of Deceit");

    const valda = getFabDeckTextFixture("cc-austria-nats-2026-2nd-valda");
    expect(valda?.hero).toBe("Valda, Seismic Impact");
    expect(countCopies(valda!.mainDeck)).toBe(70);

    const aurora = getFabDeckTextFixture("cc-indonesia-nats-2026-3rd-aurora");
    expect(aurora?.hero).toBe("Aurora, Legacy of Tempest");
    expect(aurora?.mainDeck).toContain("3x Burn Up // Shock (red)");
    expect(countCopies(aurora!.mainDeck)).toBe(69);
  });

  it("registers the Calling Hamburg FaBrary lists with exact pitch variants", () => {
    const dash = getFabDeckTextFixture("cc-hamburg-1st-dash-io");
    expect(dash?.hero).toBe("Dash I/O");
    expect(dash?.mainDeck).toContain("3x Backup Protocol: RED (red)");
    expect(dash?.mainDeck).toContain("3x Zero to Sixty (blue)");
    expect(countCopies(dash!.mainDeck)).toBe(72);

    const oscilio = getFabDeckTextFixture("cc-hamburg-2nd-oscilio");
    expect(oscilio?.hero).toBe("Oscilio, Constella Intelligence");
    expect(oscilio?.mainDeck).toContain("3x Comet Storm // Shock (red)");
    expect(oscilio?.mainDeck).toContain("3x Burn Bare");

    const marlynn = getFabDeckTextFixture("cc-hamburg-5th-marlynn");
    expect(marlynn?.hero).toBe("Marlynn, Treasure Hunter");
    expect(marlynn?.mainDeck).toContain("3x Yellow Fin Harpoon (blue)");
    expect(countCopies(marlynn!.mainDeck)).toBe(69);
  });
});
