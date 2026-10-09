import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-016 Gum-Gum Dawn Whip", () => {
  test("Main boosts Leader and disables a low-power Blocker until turn end", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST21-016"], activeDon: 2, character: ["ST21-005"] },
      { character: ["ST21-007", "ST21-008"] },
    );
    e.playCard("ST21-016");
    e.asSouth().chooseTargets(e.leader("south"));
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("blocker");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "ST21-007"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-007"));
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("declines optional targets and still pays Event cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST21-016"], activeDon: 2 },
      { character: ["ST21-007"] },
    );
    e.playCard("ST21-016");
    e.asSouth().chooseNoTargets();
    e.asSouth().chooseNoTargets();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.restedDon).toBe(2);
  });
  test("Life Trigger KOs low-power Character without Main power bonus", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST21-016"] },
      { character: [{ cardId: "ST21-006", playedOnTurn: 0 }, "ST21-005"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST21-006"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-005"));
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("ST21-005");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("skipping the power increase still disables the selected Blocker", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST21-016"], activeDon: 2 },
      { character: ["ST21-007"] },
    );
    e.playCard("ST21-016");
    e.asSouth().chooseNoTargets();
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-007"));
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker(e.findCardInZone("north", "character", "ST21-007"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("ST21-007");
  });
});
