import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-017-punk-vise", () => {
  test("Main rests <=2 and independently adds rested DON", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST10-017"], activeDon: 3 },
      { character: ["ST01-006", "ST02-006"] },
    );
    const target = e.findCardInZone("north", "character", "ST01-006");
    e.playCard("ST10-017", "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("targets");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.south.restedDon).toBe(4);
  });
  test("declines the rest target but still adds DON", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST10-017"], activeDon: 3 },
      { character: ["ST01-006"] },
    );
    e.playCard("ST10-017", "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.restedDon).toBe(4);
  });
  test("Trigger adds active DON", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { life: ["ST10-017"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "north");
    expect(e.getView("north").players.north.activeDon).toBe(1);
    expect(e.getView("north").players.north.restedDon).toBe(0);
  });
});
