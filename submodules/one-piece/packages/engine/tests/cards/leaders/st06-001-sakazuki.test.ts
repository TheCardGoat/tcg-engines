import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST06-001 Sakazuki", () => {
  test("pays three DON and a discard to KO only current cost0 once per turn", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST06-001", hand: ["ST06-008", "ST02-002", "ST02-006"], activeDon: 9 },
      { character: ["ST02-002", "ST02-006"] },
    );
    const target = e.findCardInZone("north", "character", "ST02-002");
    e.playCard("ST06-008", "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    e.activateEffect(e.leader("south"), "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const discard = e.findCardInZone("south", "hand", "ST02-002");
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [discard] }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("KO choice");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south).toMatchObject({
      activeDon: 3,
      restedDon: 6,
      handCount: 1,
    });
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
  });
  test("decline keeps DON and hand unchanged", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST06-001",
      hand: ["ST02-002"],
      activeDon: 3,
    });
    e.activateEffect(e.leader("south"), "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south).toMatchObject({
      activeDon: 3,
      restedDon: 0,
      handCount: 1,
    });
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
