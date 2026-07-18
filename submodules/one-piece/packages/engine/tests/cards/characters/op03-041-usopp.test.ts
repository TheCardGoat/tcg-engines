import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Usopp041 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-041 Usopp", () => {
  test("uses Rush, then may trash seven after an attached-DON attack deals Life damage", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Usopp041],
        deck: Array.from({ length: 8 }, () => eb01Doma005),
        activeDon: op03Usopp041.cost + 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const deckBefore = engine.getView("south").players.south.deckCount;
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(op03Usopp041, "south");
    const usoppId = engine.findCardInZone("south", "character", op03Usopp041);
    engine.attachDon(usoppId, 1, "south");
    engine.declareAttack(usoppId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    const optional = engine.pendingDecision("effectOptional", "south").steps[0];
    expect(optional?.kind).toBe("confirm");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 7);
    expect(view.players.south.trash).toHaveLength(7);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the exact seven-card trash after dealing Life damage", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03Usopp041, playedOnTurn: 0, attachedDon: 1 }],
        deck: Array.from({ length: 8 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const usoppId = engine.findCardInZone("south", "character", op03Usopp041);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(usoppId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the self-trash without an attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03Usopp041, playedOnTurn: 0 }],
        deck: Array.from({ length: 8 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const usoppId = engine.findCardInZone("south", "character", op03Usopp041);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(usoppId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
