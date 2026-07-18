import { describe, expect, test } from "vite-plus/test";
import { eb02Komei034, op01Crocodile062 } from "@tcg/op-cards";
import { op12Crocodile069 } from "../../../../../cards/src/cards/OP12/characters/069-crocodile.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-069 Crocodile", () => {
  test("once per turn returns DON!! on an opponent attack to grant battle power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01Crocodile062,
        character: [op12Crocodile069],
        activeDon: 2,
      },
      {
        character: [
          { card: eb02Komei034, playedOnTurn: 0 },
          { card: eb02Komei034, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackers = engine
      .getView("north")
      .players.north.characters.filter((card) => card?.cardId === eb02Komei034.id)
      .map((card) => card!.instanceId);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(attackers[0]!, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    let view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);

    engine.declareAttack(attackers[1]!, engine.leader("south"), "north");
    view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });
});
