import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST07-001 Charlotte Linlin", () => {
  test.each([3, 4])("checks Life after paying at starting Life %s", (life) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST07-001", activeDon: 2, life, hand: ["ST07-002"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hand = e.findCardInZone("south", "hand", "ST07-002");
    e.asSouth().attachDon(e.leader("south"), 2);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");
    if (life === 3) e.asSouth().chooseTargets(hand);
    expect(e.getView("south").players.south.lifeCount).toBe(life === 3 ? 3 : 3);
    expect(e.getView("south").players.south.hand).toHaveLength(life === 3 ? 1 : 2);
    expect(e.getView("judge").players.south.life[0]?.instanceId === hand).toBe(life === 3);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines attack Life payment and preserves Life and hand", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST07-001", activeDon: 2, life: 3 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attachDon(e.leader("south"), 2);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.hand).toHaveLength(0);
  });
  test.each([0, 1])("no activation with Life0 or only one attached DON: %s", (mode) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST07-001", activeDon: mode === 0 ? 2 : 1, life: mode === 0 ? 0 : 3 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attachDon(e.leader("south"), mode === 0 ? 2 : 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.lifeCount).toBe(mode === 0 ? 0 : 3);
  });
});
