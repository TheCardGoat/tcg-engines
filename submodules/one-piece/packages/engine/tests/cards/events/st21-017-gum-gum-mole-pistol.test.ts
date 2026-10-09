import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-017 Gum-Gum Mole Pistol", () => {
  test("Main reduces power before checking KO range and counts attached DON for own threshold", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST21-017"], activeDon: 5, character: ["ST21-006"] },
      { character: ["ST21-008"] },
    );
    e.asSouth().attachDon(e.findCardInZone("south", "character", "ST21-006"), 1);
    e.playCard("ST21-017");
    const t = e.findCardInZone("north", "character", "ST21-008");
    e.asSouth().chooseTargets(t);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(1000);
    e.asSouth().chooseTargets(t);
    expect(e.getView("north").players.north.trash[0]?.instanceId).toBe(t);
    expect(e.getView("south").players.south.restedDon).toBe(4);
  });
  test("without a 6000-power Character only the reduction applies and expires", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST21-017"], activeDon: 4, character: ["ST21-006"] },
      { character: ["ST21-008"] },
    );
    e.playCard("ST21-017");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-008"));
    expect(e.getView("north").players.north.characters[0]?.power).toBe(1000);
    expect(e.getView("south").prompts).toHaveLength(0);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(6000);
  });
  test("declines optional reduction and KO with eligible targets", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST21-017"], activeDon: 4, character: ["ST21-008"] },
      { character: ["ST21-007"] },
    );
    e.playCard("ST21-017");
    e.asSouth().chooseNoTargets();
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(2000);
    expect(e.getView("south").players.south.restedDon).toBe(4);
  });
  test("Life Trigger activates both Main clauses without DON payment", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST21-017"], character: ["ST21-008"] },
      { character: [{ cardId: "ST21-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const t = e.findCardInZone("north", "character", "ST21-006");
    e.asNorth().attack(t, e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseTargets(t);
    e.asSouth().chooseTargets(t);
    expect(e.getView("north").players.north.trash[0]?.instanceId).toBe(t);
    expect(e.getView("south").players.south.restedDon).toBe(0);
  });
});
