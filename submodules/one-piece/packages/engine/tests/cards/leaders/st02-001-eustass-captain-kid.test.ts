import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST02-001 Kid", () => {
  test("pays three DON and a chosen discard to attack again only once", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST02-001", hand: ["ST02-002", "ST02-006"], activeDon: 3 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.activateEffect(e.leader("south"), "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(3);
    e.activateEffect(e.leader("south"), "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const id = e.findCardInZone("south", "hand", "ST02-002");
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 3,
      handCount: 1,
    });
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
  });
});
