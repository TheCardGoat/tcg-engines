import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-111 Charlotte Mont-d'or", () => {
  test("opponent-turn Life Trigger plays Mont-d'Or then reveals cards to K.O. two Characters", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST07-001",
        life: ["OP17-111", "OP17-107"],
        hand: ["OP17-107", "OP17-108", "OP17-109"],
      },
      { leaderCardId: "OP01-002", character: ["OP13-013", "OP13-013", "EB01-005"] },
      { activeSeat: "north" },
    );
    const hand = e.getView("south").players.south.hand;
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter();
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    e.asSouth().acceptOptional();
    const reveal = [
      e.findCardInZone("south", "hand", "OP17-107"),
      e.findCardInZone("south", "hand", "OP17-108"),
    ];
    e.resolveDecision("effectCostRevealFromHand", { selectedIds: reveal }, "south");
    const targets = e
      .getView("south")
      .players.north.characters.flatMap((c) =>
        c?.cardId === "OP13-013" && c.instanceId ? [c.instanceId] : [],
      );
    e.resolveDecision("effectTargetSelection", { selectedIds: targets }, "south");
    const view = e.getView("south");
    expect(view.players.south.characters.some((c) => c?.cardId === "OP17-111")).toBe(true);
    expect(view.players.south.hand.map((c) => c.instanceId)).toEqual(hand.map((c) => c.instanceId));
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.north.trash.map((c) => c.instanceId)).toEqual(targets);
    expect(view.players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });
});
