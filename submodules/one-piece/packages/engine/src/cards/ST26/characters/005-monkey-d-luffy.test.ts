import { describe, expect, test } from "vite-plus/test";
import { st26MonkeyDLuffy005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const leaderPower = (engine: OnePieceTestEngine) =>
  engine.getView("south").players.south.leader?.power;

describe("ST26-005 Monkey.D.Luffy", () => {
  test("[On Play] pays DON!! -2 to set a multicolored Straw Hat Leader to 7000", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        hand: [st26MonkeyDLuffy005],
        activeDon: 8,
        donDeckCount: 2,
      },
      { activeDon: 5 },
    );
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(st26MonkeyDLuffy005, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected the DON!! -2 cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      {
        selectedIds: Array.from({ length: 2 }, (_, index) => `active-don:${index}`),
      },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.leader?.power).toBe(7000);
    expect(south.donDeckCount).toBe(donDeckBefore + 2);
  });

  test("[When Attacking] pays the same cost for the same boost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        character: [{ card: st26MonkeyDLuffy005, playedOnTurn: 0 }],
        activeDon: 8,
        donDeckCount: 2,
      },
      { activeDon: 5 },
    );
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(
      engine.findCardInZone("south", "character", st26MonkeyDLuffy005),
      engine.leader("north"),
      "south",
    );
    // Active DON!! cards are fungible, so the 2-DON!! return auto-pays.
    expect(leaderPower(engine)).toBe(7000);
    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("the boost expires after the opponent's next turn and needs the opponent's DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        hand: [st26MonkeyDLuffy005],
        activeDon: 8,
        donDeckCount: 2,
      },
      { activeDon: 2 },
    );
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(st26MonkeyDLuffy005, "south");
    // The opponent's 2-DON!! field is below the 5 needed, so the whole
    // window (cost included) never opens.
    expect(leaderPower(engine)).toBe(5000);
    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
