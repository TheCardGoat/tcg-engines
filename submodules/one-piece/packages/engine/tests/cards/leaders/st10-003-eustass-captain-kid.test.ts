import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-003-eustass-captain-kid", () => {
  test("four Life reduces own-turn power; attack pays DON and grants turn-long power", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST10-003", life: 4, activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    expect(e.getView("south").players.south.leader.power).toBe(4000);
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.north.lifeCount).toBe(3);
    e.endTurn("south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("declines the optional DON payment at three Life", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST10-003", life: 3, activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
