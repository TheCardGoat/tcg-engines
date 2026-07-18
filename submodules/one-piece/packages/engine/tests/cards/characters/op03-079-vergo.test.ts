import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op03Vergo079 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function attackVergo(attachedDon: number) {
  const engine = OnePieceTestEngine.create(
    { character: [{ card: op03Vergo079, attachedDon, rested: true, playedOnTurn: 0 }] },
    { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    { firstPlayer: "south", activeSeat: "north" },
  );
  const vergoId = engine.findCardInZone("south", "character", op03Vergo079);
  const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
  engine.declareAttack(attackerId, vergoId, "north");
  return { engine, vergoId };
}

describe("OP03-079 Vergo", () => {
  test("with DON!! attached cannot be K.O.'d in battle", () => {
    const { engine, vergoId } = attackVergo(1);
    expect(engine.getView("south").players.south.characters[0]?.instanceId).toBe(vergoId);
    expect(engine.getView("south").players.south.trash).toHaveLength(0);
  });

  test("without attached DON!! is K.O.'d by the same battle", () => {
    const { engine, vergoId } = attackVergo(0);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      vergoId,
    );
  });
});
