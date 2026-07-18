import { describe, expect, test } from "vite-plus/test";
import { op06Aramaki043, op06Tokikake052 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function battleTokikake(handCount: number, attachedDon: number) {
  const engine = OnePieceTestEngine.create(
    { character: [{ card: op06Aramaki043, playedOnTurn: 0 }] },
    {
      hand: handCount,
      character: [{ card: op06Tokikake052, attachedDon, rested: true }],
    },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const attackerId = engine.findCardInZone("south", "character", op06Aramaki043);
  const tokikakeId = engine.findCardInZone("north", "character", op06Tokikake052);
  const beforeBattle = engine.getView("north");

  expect(beforeBattle.players.north.handCount).toBe(handCount);
  expect(
    beforeBattle.players.north.characters.find((card) => card?.instanceId === tokikakeId)
      ?.attachedDon,
  ).toBe(attachedDon);

  engine.declareAttack(attackerId, tokikakeId, "south");
  expect(engine.pendingDecision("battleCounter", "north").actorId).toBe("north");
  engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

  return { engine, tokikakeId };
}

describe("OP06-052 Tokikake", () => {
  test("cannot be K.O.'d in battle with one DON!! and four cards in hand", () => {
    const { engine, tokikakeId } = battleTokikake(4, 1);
    const view = engine.getView("south");

    expect(view.players.north.characters.some((card) => card?.instanceId === tokikakeId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(tokikakeId);
    expect(view.prompts).toHaveLength(0);
  });

  test("is K.O.'d in battle without a given DON!!", () => {
    const { engine, tokikakeId } = battleTokikake(4, 0);

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      tokikakeId,
    );
  });

  test("is K.O.'d in battle with five cards in hand", () => {
    const { engine, tokikakeId } = battleTokikake(5, 1);

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      tokikakeId,
    );
  });
});
