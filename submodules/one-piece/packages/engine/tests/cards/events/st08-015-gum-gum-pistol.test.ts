import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST08-015 Gum-Gum Pistol", () => {
  test("Main KOs an opposing cost-two Character and excludes cost three", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-015"], activeDon: 3 },
      { character: ["ST08-003", "ST08-011"] },
    );
    const id = e.findCardInZone("north", "character", "ST08-003");
    e.playCard("ST08-015");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("KO choice");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.asSouth().chooseTargets(id);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
  });
  test("Main may choose zero targets", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-015"], activeDon: 3 },
      { character: ["ST08-003"] },
    );
    e.playCard("ST08-015");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("ST08-003");
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("Life Trigger draws a card without a KO choice", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST08-015"], deck: ["ST08-003", "ST08-010"] },
      { character: [{ cardId: "ST08-010", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST08-010"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST08-003"]);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
