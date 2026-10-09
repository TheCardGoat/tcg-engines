import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST12-003 Dracule Mihawk", () => {
  test.each(["ST12-004", "ST12-015"])("plays qualifying alternative %s rested", (card) => {
    const e = OnePieceTestEngine.create({
      hand: ["ST12-003", card, "ST12-009", "ST12-008", "ST12-003", "ST09-005"],
      activeDon: 3,
    });
    e.playCard("ST12-003");
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "hand", "ST12-003"),
    );
    const id = e.findCardInZone("south", "hand", card);
    expect(p.candidates.map((c) => c.ref.id)).toContain(id);
    expect(p.candidates.map((c) => c.ref.id)).toContain(
      e.findCardInZone("south", "hand", "ST12-008"),
    );
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "hand", "ST12-009"),
    );
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "hand", "ST09-005"),
    );
    e.asSouth().choosePlay(id);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(true);
  });
  test("declines optional hand play with a valid card", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST12-003", "ST12-004"], activeDon: 3 });
    e.playCard("ST12-003");
    e.asSouth().chooseNoPlay();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  });
  test("FAQ counts Mihawk itself as the third Character", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST12-003", "ST12-004"],
      character: ["ST12-009", "ST12-015"],
      activeDon: 3,
    });
    e.playCard("ST12-003");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(3);
  });
});
