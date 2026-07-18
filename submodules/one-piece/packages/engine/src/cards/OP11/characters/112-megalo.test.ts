import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11Shirahoshi022 } from "@tcg/op-cards";
import { op11Megalo112 } from "../../../../../cards/src/cards/OP11/characters/112-megalo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-112 Megalo", () => {
  test("gains +4000 power only during the opponent's turn with Shirahoshi", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op11Shirahoshi022, character: [op11Megalo112] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const megaloId = engine.findCardInZone("south", "character", op11Megalo112);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === megaloId)
        ?.power,
    ).toBe(6000);
    engine.endTurn("north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === megaloId)
        ?.power,
    ).toBe(2000);
  });

  test("may become the new target of an opponent's attack as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Megalo112] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const megaloId = engine.findCardInZone("south", "character", op11Megalo112);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [megaloId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
