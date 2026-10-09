import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P005 Kaido", () => {
  test("returns two DON for Banish that trashes Life without Trigger and expires", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-005"], restedDon: 4, donDeckCount: 6 },
      { life: ["ST29-012", "ST29-005", "ST02-002"], deck: ["ST02-006", "ST02-002"] },
    );
    const id = e.findCardInZone("south", "character", "P-005");
    e.asSouth().activateMain(id);
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.restedDon).toBe(2);
    e.asSouth().activateMain(id);
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").players.south.donDeckCount).toBe(10);
    e.asSouth().attack(id, e.leader("north"));
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toContain("ST29-012");
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getView("north").prompts).toHaveLength(0);
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    e.asSouth().attack(id, e.leader("north"));
    e.asNorth().chooseCounter();
    e.pendingDecision("lifeTrigger", "north");
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).not.toContain("ST29-005");
  });
  test("declines optional DON return and damage permits Trigger", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-005"], restedDon: 2 },
      { life: ["ST29-012", "ST02-002"] },
    );
    const id = e.findCardInZone("south", "character", "P-005");
    e.asSouth().activateMain(id);
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.restedDon).toBe(2);
    e.asSouth().attack(id, e.leader("north"));
    e.asNorth().activateLifeTrigger();
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("ST29-012");
  });
  test("one DON cannot partially pay activation", () => {
    const e = OnePieceTestEngine.create({ character: ["P-005"], restedDon: 1 });
    const f = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "P-005"),
      trigger: "activateMain",
    });
    expect(OnePieceTestEngine.fromState(f.state).getView("south").players.south.restedDon).toBe(1);
  });
});
