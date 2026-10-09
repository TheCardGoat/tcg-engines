import { describe, it, expect } from "vite-plus/test";
import "../gundam/testing/register-matchers.ts";
import type { PlayerId } from "../types/branded.ts";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockResource,
} from "../index.ts";

function resources(n: number) {
  return Array.from({ length: n }, () => createMockResource());
}

describe("Per-player undo", () => {
  it("player who moved can undo their own move", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(2) }, {});
    engine.asPlayer(PLAYER_ONE).deployUnit(unit);
    const deployedStateID = engine.getState().ctx._stateID;

    const result = engine.undo(PLAYER_ONE as PlayerId);
    expect(result).not.toBeNull();
    if (!result || !result.success) throw new Error("Expected the undo to succeed.");
    expect(result.stateID).toBeGreaterThan(deployedStateID);
    expect(result.processedCommand.move).toBe("undo");
    expect(result.state.ctx._stateID).toBe(result.stateID);
    expect(result.patches.length).toBeGreaterThan(0);
  });

  it("other player cannot undo the move", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(2) }, {});
    engine.asPlayer(PLAYER_ONE).deployUnit(unit);

    const result = engine.undo(PLAYER_TWO as PlayerId);
    expect(result).toBeNull();
  });

  it("canUndo returns true only for the acting player", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(2) }, {});
    engine.asPlayer(PLAYER_ONE).deployUnit(unit);
    const runtime = engine.getRuntime();

    expect(runtime.canUndo(PLAYER_ONE as PlayerId)).toBe(true);
    expect(runtime.canUndo(PLAYER_TWO as PlayerId)).toBe(false);
  });

  it("different player's move clears the undo stack", () => {
    const u1 = createMockUnit({ level: 1, cost: 1, name: "Unit-A" });
    const u2 = createMockUnit({ level: 1, cost: 1, name: "Unit-B" });
    const engine = GundamTestEngine.create(
      { hand: [u1], resourceArea: resources(2) },
      { hand: [u2], resourceArea: resources(2) },
      { initialActivePlayer: PLAYER_ONE },
    );
    engine.asPlayer(PLAYER_ONE).deployUnit(u1);

    engine.getRuntime().state.ctx.status.activePlayer = PLAYER_TWO as unknown as PlayerId;
    engine.asPlayer(PLAYER_TWO).deployUnit(u2);

    expect(engine.getRuntime().canUndo(PLAYER_ONE as PlayerId)).toBe(false);
    expect(engine.getRuntime().canUndo(PLAYER_TWO as PlayerId)).toBe(true);
  });

  it("restores the current turn in one versioned transition", () => {
    const first = createMockUnit({ level: 1, cost: 1, name: "First" });
    const second = createMockUnit({ level: 1, cost: 1, name: "Second" });
    const engine = GundamTestEngine.create(
      { hand: [first, second], resourceArea: resources(3) },
      {},
    );
    const runtime = engine.getRuntime();
    const startState = structuredClone(engine.getState());
    engine.asPlayer(PLAYER_ONE).deployUnit(first);
    engine.asPlayer(PLAYER_ONE).deployUnit(second);

    expect(runtime.canUndoToTurnStart(PLAYER_ONE as PlayerId)).toBe(true);
    expect(runtime.canUndoToTurnStart(PLAYER_TWO as PlayerId)).toBe(false);
    const previousVersion = engine.getState().ctx._stateID;
    const result = runtime.undoToTurnStart(PLAYER_ONE as PlayerId);
    expect(result?.success).toBe(true);
    if (!result?.success) throw new Error("Expected turn undo to succeed.");
    expect(result.processedCommand.move).toBe("undoToTurnStart");
    expect(result.stateID).toBe(previousVersion + 1);
    expect(result.state.G).toEqual(startState.G);
    expect(runtime.canUndoToTurnStart(PLAYER_ONE as PlayerId)).toBe(false);
  });

  it("blocks undo after a deck look, then permits later safe moves", () => {
    const look: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 2,
            return: "chooseTop",
            remainingDestination: "bottom",
          },
        },
      ],
      sourceText: "Look at the top 2 cards of your deck and return 1 to the top.",
    };
    const source = createMockUnit({ effects: [look] });
    const later = createMockUnit({ level: 1, cost: 1, name: "Later" });
    const engine = GundamTestEngine.create(
      {
        play: [source],
        hand: [later],
        deck: [createMockUnit(), createMockUnit()],
        resourceArea: resources(3),
      },
      {},
    );
    const runtime = engine.getRuntime();
    const player = engine.asPlayer(PLAYER_ONE);
    const sourceId = player.getCardsInZone("battleArea")[0]!;
    expect(player.activateAbility(sourceId, 0).success).toBe(true);
    expect(player.getBoardView().pendingChoice?.kind).toBe("deckLook");
    expect(runtime.canUndo(PLAYER_ONE as PlayerId)).toBe(false);
    const choice = player.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    const resolved = player.resolveEffect({
      deckLookAnswers: {
        0: {
          toTop: [choice.revealedCardIds[0]!],
          toBottom: [choice.revealedCardIds[1]!],
        },
      },
    });
    expect(resolved.success, JSON.stringify(resolved)).toBe(true);
    expect(player.deployUnit(later).success).toBe(true);

    expect(runtime.canUndo(PLAYER_ONE as PlayerId)).toBe(true);
    expect(runtime.canUndoToTurnStart(PLAYER_ONE as PlayerId)).toBe(false);
  });

  it("blocks undo when an ability draws a hidden card", () => {
    const draw: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "Draw 1.",
    };
    const source = createMockUnit({ effects: [draw] });
    const later = createMockUnit({ level: 1, cost: 1, name: "Later" });
    const secondLater = createMockUnit({ level: 1, cost: 1, name: "Second Later" });
    const engine = GundamTestEngine.create(
      { play: [source], hand: [later, secondLater], deck: 4, resourceArea: resources(3) },
      {},
    );
    const player = engine.asPlayer(PLAYER_ONE);
    const sourceId = player.getCardsInZone("battleArea")[0]!;
    expect(player.activateAbility(sourceId, 0).success).toBe(true);
    expect(player.getHand()).toHaveLength(3);
    const runtime = engine.getRuntime();
    const afterBarrier = structuredClone(engine.getState());
    expect(runtime.canUndo(PLAYER_ONE as PlayerId)).toBe(false);
    expect(player.deployUnit(later).success).toBe(true);
    expect(player.deployUnit(secondLater).success).toBe(true);
    expect(runtime.canUndo(PLAYER_ONE as PlayerId)).toBe(true);
    expect(runtime.canUndoToTurnStart(PLAYER_ONE as PlayerId)).toBe(false);
    expect(runtime.undo(PLAYER_ONE as PlayerId)?.success).toBe(true);
    expect(runtime.canUndo(PLAYER_ONE as PlayerId)).toBe(true);
    expect(runtime.undo(PLAYER_ONE as PlayerId)?.success).toBe(true);
    expect(engine.getState().G).toEqual(afterBarrier.G);
    expect(runtime.canUndo(PLAYER_ONE as PlayerId)).toBe(false);
  });
});
