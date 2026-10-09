import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-016-gum-gum-kong-gatling", () => {
  test("Main KOs <=7000 and excludes larger Characters", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST10-016"], activeDon: 5 },
      { character: ["ST02-013", "OP01-120"] },
    );
    const target = e.findCardInZone("north", "character", "ST02-013");
    e.playCard("ST10-016", "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("targets");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("declines the optional Main target", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST10-016"], activeDon: 5 },
      { character: ["ST02-006"] },
    );
    e.playCard("ST10-016", "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").players.north.trash).toHaveLength(0);
  });
  test("Trigger power lasts through the end of the next own turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { life: ["ST10-016", "ST02-002"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("north")] }, "north");
    expect(e.getView("north").players.north.leader.power).toBe(6000);
    e.endTurn("south");
    expect(e.getView("north").players.north.leader.power).toBe(6000);
    e.endTurn("north");
    expect(e.getView("north").players.north.leader.power).toBe(5000);
  });
});
