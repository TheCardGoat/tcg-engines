import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02EdwardNewgate001, op05Gladius025, op06BearKing012 } from "@tcg/op-cards";

import { processEffectAction } from "../../../src/effects/actions.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function battleBearKing(options: {
  leader?: typeof op02EdwardNewgate001;
  highPowerCharacter?: boolean;
}) {
  const engine = OnePieceTestEngine.create(
    { character: [{ card: op06BearKing012, rested: true, playedOnTurn: 0 }] },
    {
      leaderCardId: options.leader,
      character: [
        { card: eb01Doma005, attachedDon: 4, playedOnTurn: 0 },
        ...(options.highPowerCharacter ? [op05Gladius025] : []),
      ],
    },
    { firstPlayer: "south", activeSeat: "north" },
  );
  const bearKingId = engine.findCardInZone("south", "character", op06BearKing012);
  const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
  engine.declareAttack(attackerId, bearKingId, "north");
  return { engine, bearKingId };
}

describe("OP06-012 Bear.King", () => {
  test("survives battle when the opponent has a base-6000 Leader or Character", () => {
    for (const options of [{ leader: op02EdwardNewgate001 }, { highPowerCharacter: true }]) {
      const { engine, bearKingId } = battleBearKing(options);
      const view = engine.getView("south");
      expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(bearKingId);
      expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(bearKingId);
    }
  });

  test("is K.O.'d when only the attacker's modified power reaches 6000", () => {
    const { engine, bearKingId } = battleBearKing({});
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      bearKingId,
    );
  });

  test("can still be K.O.'d by an effect when the opponent has a base-6000 Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06BearKing012] },
      { leaderCardId: op02EdwardNewgate001 },
    );
    const bearKingId = engine.findCardInZone("south", "character", op06BearKing012);

    expect(
      processEffectAction(
        engine.getState(),
        "north",
        engine.leader("north"),
        {
          action: "ko",
          target: { player: "opponent", zones: ["character"], count: { amount: 1 } },
        },
        [bearKingId],
      ),
    ).toBe(true);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      bearKingId,
    );
  });
});
