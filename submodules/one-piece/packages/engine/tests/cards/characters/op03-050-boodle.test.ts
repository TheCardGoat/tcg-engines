import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op03Boodle050 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function blockedBoodleBattle() {
  const engine = OnePieceTestEngine.create(
    { character: [op03Boodle050], deck: [eb01Doma005, eb01Doma005] },
    { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    { firstPlayer: "south", activeSeat: "north" },
  );
  const boodleId = engine.findCardInZone("south", "character", op03Boodle050);
  const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
  engine.declareAttack(attackerId, engine.leader("south"), "north");
  engine.resolveDecision("battleBlocker", { selectedIds: [boodleId] }, "south");
  return { engine, boodleId };
}

describe("OP03-050 Boodle", () => {
  test("blocks, then may trash one deck card when K.O.'d", () => {
    const { engine, boodleId } = blockedBoodleBattle();
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(boodleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline its On K.O. deck trash", () => {
    const { engine } = blockedBoodleBattle();
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
