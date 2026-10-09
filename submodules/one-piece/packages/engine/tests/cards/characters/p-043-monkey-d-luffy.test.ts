import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-043-monkey-d-luffy", () => {
  test.each(["south", "north"] as const)(
    "returns either owner's cost3 Character to correct hand: %s",
    (seat) => {
      const e = OnePieceTestEngine.create(
        { hand: ["P-043"], character: ["P-012"], activeDon: 7 },
        { character: ["P-012", "P-033"] },
      );
      e.playCard("P-043");
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("bounce");
      expect(p.candidates.map((c) => c.ref.id)).not.toContain(
        e.findCardInZone("north", "character", "P-033"),
      );
      const id = e.findCardInZone(seat, "character", "P-012");
      e.asSouth().chooseTargets(id);
      expect(e.getView(seat).players[seat].hand.map((c) => c.instanceId)).toContain(id);
      expect(e.getView(seat).players[seat].characters.some((c) => c?.instanceId === id)).toBe(
        false,
      );
    },
  );
  test("declines optional return with legal Characters on both sides", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-043"], character: ["P-012"], activeDon: 7 },
      { character: ["P-012"] },
    );
    e.playCard("P-043");
    e.asSouth().chooseNoTargets();
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("P-012");
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("P-012");
  });
});
