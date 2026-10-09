import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st35-001-hack", () => {
  test("OnPlay KOs by base power while Blocker intercepts an actual attack", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST35-001"], activeDon: 4 },
      { character: ["ST23-004", "ST21-005", { cardId: "ST21-011", attachedDon: 2 }] },
    );
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
    e.playCard("ST35-001");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "ST23-004"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST23-004"));
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST35-001"));
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST35-001");
  });
  test("declines optional KO and Blocker choices", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST35-001"], activeDon: 4 },
      { character: ["ST21-007"] },
    );
    e.playCard("ST35-001");
    e.asSouth().chooseNoTargets();
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("ST21-007");
  });
});
