import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-019-bepo", () => {
  test("one attached DON unlocks attack KO at3000 and excludes4000 and Leaders", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-019", playedOnTurn: 0 }], activeDon: 1 },
      { character: ["P-015", "ST21-005"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const b = e.findCardInZone("south", "character", "P-019");
    e.attachDon(b, 1);
    e.asSouth().attack(b, e.leader("north"));
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "P-015"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "P-015"));
    expect(e.getView("north").players.north.trash.some((c) => c.cardId === "P-015")).toBe(true);
    expect(e.getView("north").players.north.characters[1]?.cardId).toBe("ST21-005");
  });
  test("declines optional attack KO with DON condition met", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-019", attachedDon: 1, playedOnTurn: 0 }] },
      { character: ["P-015"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack("P-019", e.leader("north"));
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("P-015");
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
  test("without attached DON attacking does not KO legal low-power Character", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-019", playedOnTurn: 0 }] },
      { character: ["P-015"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack("P-019", e.leader("north"));
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("P-015");
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
});
