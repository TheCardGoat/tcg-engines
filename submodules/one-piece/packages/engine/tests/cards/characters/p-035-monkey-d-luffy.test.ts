import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-035-monkey-d-luffy", () => {
  test("DON attack discards then KOs exact cost0 excluding cost1", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          { cardId: "P-035", attachedDon: 1, playedOnTurn: 0 },
          { cardId: "P-032", attachedDon: 1 },
        ],
        hand: ["P-012"],
      },
      { character: ["P-015", "P-012"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("P-035", e.leader("north"));
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "P-015"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "P-015"));
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("P-012");
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("P-015");
  });
  test("declines optional discard with DON and legal KO", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          { cardId: "P-035", attachedDon: 1, playedOnTurn: 0 },
          { cardId: "P-032", attachedDon: 1 },
        ],
        hand: ["P-012"],
      },
      { character: ["P-015"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("P-035", e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("P-015");
  });
  test("no DON suppresses attack cost and KO", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          { cardId: "P-035", playedOnTurn: 0 },
          { cardId: "P-032", attachedDon: 1 },
        ],
        hand: ["P-012"],
      },
      { character: ["P-015"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("P-035", e.leader("north"));
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("P-015");
  });
});
