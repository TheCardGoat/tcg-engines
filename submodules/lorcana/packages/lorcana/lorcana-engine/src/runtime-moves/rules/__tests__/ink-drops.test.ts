import { describe, expect, it } from "bun:test";
import {
  PLAYER_ONE,
  PLAYER_TWO,
  createTestContext,
  type TestCardDefinition,
} from "../../../testing/unit-harness";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE as MP_PLAYER_ONE,
  PLAYER_TWO as MP_PLAYER_TWO,
  createMockCharacter,
} from "../../../testing";
import type { CardInstanceId } from "#core";
import type { PlayerId } from "#core";
import { payBasicCost, spendInk, validateBasicCost } from "../play-card-rules";
import { gainInkDrops, getInkDropCount, removeInkDrops } from "../ink-drops";

function makeCtx(inkDrops: Partial<Record<PlayerId, number>>, inkwellCards: string[] = []) {
  const inkCardIds = inkwellCards as unknown as CardInstanceId[];
  const ctx = createTestContext({
    inkDrops,
    zoneCards: { [`inkwell:${PLAYER_ONE}`]: inkCardIds },
    definitions: Object.fromEntries(
      inkCardIds.map((id) => [String(id), { cardType: "character", cost: 1 }]),
    ) as Record<string, TestCardDefinition>,
  });
  // Minimal event capture so ink-drop change triggers are observable.
  const emitted: Array<{ type: string; data: unknown }> = [];
  (ctx.framework as { events: { emit: (e: unknown) => void } }).events = {
    emit: (event: unknown) => {
      const typed = event as { kind?: string; customType?: string; data?: unknown };
      emitted.push({ type: (typed.customType ?? typed.kind) as string, data: typed.data });
    },
  };
  return { ctx, emitted };
}

describe("ink drops (Hyperia City)", () => {
  it("gainInkDrops adds to the player's counter and records the turn metric", () => {
    const { ctx } = makeCtx({});
    gainInkDrops(ctx, PLAYER_ONE, 2, "test");
    expect(getInkDropCount(ctx, PLAYER_ONE)).toBe(2);
    expect(ctx.G.turnMetadata.inkDropsGainedThisTurn[PLAYER_ONE]).toBe(2);
    expect(getInkDropCount(ctx, PLAYER_TWO)).toBe(0);
  });

  it("gainInkDrops emits an ink-drop-gained trigger event with the gained amount", () => {
    const { ctx, emitted } = makeCtx({});
    gainInkDrops(ctx, PLAYER_ONE, 1, "test", "card-1" as unknown as CardInstanceId);
    const inkDropEvents = emitted.filter((e) => e.type === "inkDropChanged");
    expect(inkDropEvents.length).toBe(1);
    expect(inkDropEvents[0]!.data).toMatchObject({
      playerId: PLAYER_ONE,
      operation: "add",
      amount: 1,
      newInkDrops: 1,
    });
    // The buffered trigger event feeds "whenever you gain an ink drop" abilities.
    const pending = ctx.G.triggeredAbilities?.pendingEvents ?? [];
    const gained = pending.filter((event) => event.event === "ink-drop-gained");
    expect(gained.length).toBe(1);
    expect(gained[0]!.eventSnapshot?.triggerAmount).toBe(1);
  });

  it("removeInkDrops clamps to the held amount and emits ink-drop-removed", () => {
    const { ctx } = makeCtx({ [PLAYER_ONE]: 1 });
    const removed = removeInkDrops(ctx, PLAYER_ONE, 3, "test");
    expect(removed).toBe(1);
    expect(getInkDropCount(ctx, PLAYER_ONE)).toBe(0);
    expect(ctx.G.turnMetadata.inkDropsRemovedThisTurn[PLAYER_ONE]).toBe(1);
    const pending = ctx.G.triggeredAbilities?.pendingEvents ?? [];
    expect(pending.some((event) => event.event === "ink-drop-removed")).toBe(true);
  });

  it("payBasicCost spends inkwell ink first and ink drops only when opted in", () => {
    const { ctx } = makeCtx({ [PLAYER_ONE]: 2 }, ["ink-1", "ink-2"]);
    const result = payBasicCost(
      { framework: ctx.framework, cards: ctx.cards, playerId: PLAYER_ONE },
      { ink: 2 },
    );
    expect(result).toEqual({ success: true, inkPaid: 2, inkDropsSpent: 0 });
    // No opt-in: inkwell cards paid the full cost, drops untouched.
    expect(ctx.cards.getMeta("ink-1")?.state).toBe("exerted");
    expect(ctx.cards.getMeta("ink-2")?.state).toBe("exerted");
    expect(getInkDropCount(ctx, PLAYER_ONE)).toBe(2);
  });

  it("payBasicCost covers part of the cost with ink drops when requested", () => {
    const { ctx } = makeCtx({ [PLAYER_ONE]: 2 }, ["ink-1"]);
    const result = payBasicCost(
      { framework: ctx.framework, cards: ctx.cards, playerId: PLAYER_ONE },
      { ink: 3 },
      { inkDrops: 2 },
    );
    expect(result).toEqual({ success: true, inkPaid: 3, inkDropsSpent: 2 });
    expect(ctx.cards.getMeta("ink-1")?.state).toBe("exerted");
    expect(getInkDropCount(ctx, PLAYER_ONE)).toBe(0);
    expect(ctx.G.turnMetadata.inkDropsRemovedThisTurn[PLAYER_ONE]).toBe(2);
  });

  it("payBasicCost uses requested drops even when ready ink covers the cost", () => {
    const { ctx } = makeCtx({ [PLAYER_ONE]: 2 }, ["ink-1", "ink-2"]);
    const result = payBasicCost(
      { framework: ctx.framework, cards: ctx.cards, playerId: PLAYER_ONE },
      { ink: 2 },
      { inkDrops: 2 },
    );
    expect(result).toEqual({ success: true, inkPaid: 2, inkDropsSpent: 2 });
    expect(ctx.cards.getMeta("ink-1")?.state).toBeUndefined();
    expect(ctx.cards.getMeta("ink-2")?.state).toBeUndefined();
    expect(getInkDropCount(ctx, PLAYER_ONE)).toBe(0);
    expect(ctx.G.turnMetadata.inkDropsRemovedThisTurn[PLAYER_ONE]).toBe(2);
  });

  it("payBasicCost lets drops pay the full cost while ready ink remains", () => {
    const { ctx } = makeCtx({ [PLAYER_ONE]: 3 }, ["ink-1", "ink-2"]);
    const result = payBasicCost(
      { framework: ctx.framework, cards: ctx.cards, playerId: PLAYER_ONE },
      { ink: 3 },
      { inkDrops: 3 },
    );
    // Three requested drops pay the full cost. The inkwell remains ready.
    expect(result).toEqual({ success: true, inkPaid: 3, inkDropsSpent: 3 });
    expect(ctx.cards.getMeta("ink-1")?.state).toBeUndefined();
    expect(ctx.cards.getMeta("ink-2")?.state).toBeUndefined();
    expect(getInkDropCount(ctx, PLAYER_ONE)).toBe(0);
    expect(ctx.G.turnMetadata.inkDropsRemovedThisTurn[PLAYER_ONE]).toBe(3);
  });

  it("spendInk caps a large requested drop payment to the cost", () => {
    const { ctx } = makeCtx({ [PLAYER_ONE]: 5 }, ["ink-1"]);
    spendInk(ctx, PLAYER_ONE, 1, 5);
    expect(getInkDropCount(ctx, PLAYER_ONE)).toBe(4);
    expect(ctx.cards.getMeta("ink-1")?.state).toBeUndefined();
  });

  it("validateBasicCost rejects spending more ink drops than held", () => {
    const { ctx } = makeCtx({ [PLAYER_ONE]: 1 }, ["ink-1"]);
    const validation = validateBasicCost(
      { framework: ctx.framework, cards: ctx.cards, playerId: PLAYER_ONE },
      { ink: 3 },
      { inkDrops: 2 },
    );
    expect(validation.valid).toBe(false);
    expect(validation.valid === false && validation.errorCode).toBe("INSUFFICIENT_INK_DROPS");
  });

  it("validateBasicCost accepts ink drops covering a ready-ink shortfall", () => {
    const { ctx } = makeCtx({ [PLAYER_ONE]: 2 }, ["ink-1"]);
    const validation = validateBasicCost(
      { framework: ctx.framework, cards: ctx.cards, playerId: PLAYER_ONE },
      { ink: 3 },
      { inkDrops: 2 },
    );
    expect(validation.valid).toBe(true);
  });

  it("manualSetInkDrops stages a player's counter for tests and manual mode", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({ deck: 2 }, { deck: 2 });
    try {
      expect(engine.asServer().manualSetInkDrops(MP_PLAYER_ONE, 4).success).toBe(true);
      const state = engine.asServer().getState() as { G: { inkDrops: Record<string, number> } };
      expect(state.G.inkDrops[MP_PLAYER_ONE]).toBe(4);
      expect(state.G.inkDrops[MP_PLAYER_TWO]).toBe(0);

      expect(engine.asServer().manualSetInkDrops(MP_PLAYER_TWO, -1).success).toBe(false);
      expect(engine.asServer().manualSetInkDrops(MP_PLAYER_TWO, 2).success).toBe(true);
      const after = engine.asServer().getState() as { G: { inkDrops: Record<string, number> } };
      expect(after.G.inkDrops[MP_PLAYER_TWO]).toBe(2);
    } finally {
      engine.dispose();
    }
  });
});

describe("ink-drop move logs (Hyperia City)", () => {
  function findMoveLog(
    engine: LorcanaMultiplayerTestEngine,
    moveType: string,
  ): { public: Array<{ key: string; values: Record<string, unknown> }> } | undefined {
    return engine
      .asServer()
      .getMoveLogHistory()
      .find((log) => log.moveType === moveType) as
      | { public: Array<{ key: string; values: Record<string, unknown> }> }
      | undefined;
  }

  it("play entry logs ink drops gained from effects", () => {
    const dropGainer = createMockCharacter({
      id: "ink-drop-gainer",
      name: "Drop Gainer",
      cost: 2,
      abilities: [
        {
          id: "bank-drop",
          name: "BANK DROP",
          type: "triggered",
          text: "BANK DROP Whenever you play this character, get 2 ink drops.",
          trigger: { event: "play", on: "SELF", timing: "whenever" },
          effect: { type: "gain-ink-drop", amount: 2, target: "CONTROLLER" },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dropGainer],
      inkwell: dropGainer.cost,
      deck: [],
    });
    try {
      expect(engine.asPlayerOne().playCard(dropGainer)).toBeSuccessfulCommand();
      expect(engine.getInkDrops(MP_PLAYER_ONE)).toBe(2);

      // The gain trigger resolves as its own bag move; the gained line renders
      // under that resolution ("Resolved BANK DROP from Drop Gainer.").
      const resolveEntry = engine
        .asServer()
        .getMoveLogHistory()
        .find((log) => log.moveType === "resolveBag");
      expect(resolveEntry?.public).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: "lorcana.outcome.inkDropsGained",
            values: { playerId: MP_PLAYER_ONE, amount: 2 },
          }),
        ]),
      );
    } finally {
      engine.dispose();
    }
  });

  it("play entry logs ink drops removed as payment", () => {
    const costlyAlly = createMockCharacter({ id: "costly-ally", name: "Costly Ally", cost: 3 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [costlyAlly],
      inkwell: 2,
      inkDrops: 1,
      deck: [],
    });
    try {
      expect(engine.asPlayerOne().playCard(costlyAlly, { inkDrops: 1 })).toBeSuccessfulCommand();
      expect(engine.getInkDrops(MP_PLAYER_ONE)).toBe(0);

      const playEntry = findMoveLog(engine, "playCard");
      expect(playEntry?.public).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: "lorcana.outcome.inkDropsRemoved",
            values: { playerId: MP_PLAYER_ONE, amount: 1 },
          }),
        ]),
      );
    } finally {
      engine.dispose();
    }
  });

  it("shift entry logs mandatory ink-drop shift costs", () => {
    const dropShifter = createMockCharacter({
      id: "drop-shifter",
      name: "Dropster",
      cost: 5,
      abilities: [
        {
          id: "drop-shift",
          name: "Shift Remove 2 ink drops",
          type: "keyword",
          keyword: "Shift",
          text: "Shift Remove 2 ink drops",
          shiftTarget: "Dropster",
          cost: { inkDrops: 2 },
        },
      ],
    });
    const shiftBase = createMockCharacter({ id: "drop-shift-base", name: "Dropster", cost: 2 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dropShifter],
      play: [shiftBase],
      inkwell: 5,
      inkDrops: 2,
      deck: [],
    });
    try {
      const shiftTarget = engine.findCardInstanceId(shiftBase, "play", MP_PLAYER_ONE);
      expect(
        engine.asPlayerOne().playCard(dropShifter, { cost: { cost: "shift", shiftTarget } }),
      ).toBeSuccessfulCommand();
      expect(engine.getInkDrops(MP_PLAYER_ONE)).toBe(0);

      const shiftEntry = findMoveLog(engine, "shiftCard");
      expect(shiftEntry?.public).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: "lorcana.outcome.inkDropsRemoved",
            values: { playerId: MP_PLAYER_ONE, amount: 2 },
          }),
        ]),
      );
    } finally {
      engine.dispose();
    }
  });
});
