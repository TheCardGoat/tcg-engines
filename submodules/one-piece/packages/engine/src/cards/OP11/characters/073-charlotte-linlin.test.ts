import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op11CharlotteKatakuri062 } from "@tcg/op-cards";
import { op11CharlotteLinlin073 } from "../../../../../cards/src/cards/OP11/characters/073-charlotte-linlin.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-073 Charlotte Linlin", () => {
  test("gains Rush with an included Big Mom Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11CharlotteKatakuri062,
        hand: [op11CharlotteLinlin073],
        activeDon: op11CharlotteLinlin073.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op11CharlotteLinlin073, "south");
    const linlinId = engine.findCardInZone("south", "character", op11CharlotteLinlin073);
    engine.declareAttack(linlinId, engine.leader("north"), "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === linlinId)
        ?.rested,
    ).toBe(true);
  });

  test("returns five DON!!, reveals a matching cost, boosts the Leader, and triggers only once", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11CharlotteLinlin073],
        activeDon: 10,
      },
      {
        deck: [eb01Doma005, eb01MountainGod018],
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackers = engine
      .getView("north")
      .players.north.characters.filter((card) => card?.cardId === eb01Doma005.id)
      .map((card) => card!.instanceId);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    const leaderPowerBefore = engine.getView("south").players.south.leader.power ?? 0;
    expect(engine.getView("south").players.south.activeDon).toBe(10);

    engine.declareAttack(attackers[0]!, engine.leader("south"), "north");
    expect(engine.getView("south").players.south.activeDon).toBe(10);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const viewAfterCost = engine.getView("south").players.south;
    expect(viewAfterCost.activeDon).toBe(5);
    expect(viewAfterCost.donDeckCount).toBe(donDeckBefore + 5);
    engine.resolveDecision("effectGuessTopDeckCost", { optionId: "1" }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(engine.getView("south").players.south.leader.power).toBe(leaderPowerBefore + 2000);
    engine.declareAttack(attackers[1]!, engine.leader("south"), "north");
    expect(
      engine.getView("south").prompts.some((prompt) => prompt.label.includes("optional effect")),
    ).toBe(false);
  });
});
