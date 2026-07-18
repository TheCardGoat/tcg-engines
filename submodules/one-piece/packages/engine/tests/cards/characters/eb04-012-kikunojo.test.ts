import { describe, expect, test } from "vite-plus/test";
import { eb01KouzukiOden001, op14eb04KikunojoEb04012012 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-012 Kikunojo", () => {
  test("sets a compound Land of Wano Leader active only when played this turn and only once", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb01KouzukiOden001,
        character: [{ card: op14eb04KikunojoEb04012012, playedOnTurn: 1 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kikunojoId = engine.findCardInZone("south", "character", op14eb04KikunojoEb04012012);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.getView("south").players.south.leader.rested).toBe(true);
    engine.activateEffect(kikunojoId, "activateMain", "south");

    expect(engine.getView("south").players.south.leader.rested).toBe(false);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kikunojoId,
        trigger: "activateMain",
      }).reason,
    ).toContain("already been used this turn");
  });

  test("does not set the Leader active when Kikunojo was played on an earlier turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb01KouzukiOden001,
        character: [{ card: op14eb04KikunojoEb04012012, playedOnTurn: 0 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kikunojoId = engine.findCardInZone("south", "character", op14eb04KikunojoEb04012012);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kikunojoId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation conditions are not met.");

    expect(engine.getView("south").players.south.leader.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
