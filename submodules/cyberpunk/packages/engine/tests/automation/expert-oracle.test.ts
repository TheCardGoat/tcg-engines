import {
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
  welcomeToNightCityRetailTowerfall,
} from "@tcg/cyberpunk-cards";
import { describe, expect, test } from "vite-plus/test";
import { defaultStrategy } from "../../src/index.ts";
import {
  AIPlayer,
  buildDecisionContext,
  createExpertOracleStrategy,
  getSafeAutomatedActionStrategyOption,
  runAutoMatch,
  tacticalStrategy,
} from "../../src/automation/index.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockUnit,
  createMockGear,
  createMockLegend,
} from "../../src/testing/index.ts";
import { createTestCatalog, createTestDecks, createTestPlayers } from "./fixtures.ts";

const expert = createExpertOracleStrategy({ maxNodes: 160 });

describe("full-information practice expert", () => {
  test("reveals both hands, deck order and Legends only in the explicit oracle view", () => {
    const hidden = createMockUnit({ name: "Hidden threat" });
    const legend = createMockLegend({ name: "Hidden Legend" });
    const game = CyberpunkTestEngine.createWithFixture(
      { deck: [hidden], hand: [hidden] },
      { hand: [hidden], deck: [hidden, hidden], legendArea: [{ card: legend, faceDown: true }] },
    );
    const engine = game.getLocalEngine();
    const before = engine.getFilteredView(P1);
    const oracle = engine.getOracleView(P1);
    expect(before.players[P2]?.zones.hand).toBe(1);
    expect(typeof before.players[P2]?.zones.deck).toBe("number");
    expect(oracle.players[P2]?.zones.hand).toEqual([
      expect.objectContaining({ cardName: "Hidden threat" }),
    ]);
    expect(oracle.players[P2]?.zones.deck).toHaveLength(before.players[P2]?.zones.deck as number);
    expect(oracle.players[P1]?.zones.deck).toHaveLength(before.players[P1]?.zones.deck as number);
    expect(oracle.players[P2]?.zones.legendArea).toEqual([
      expect.objectContaining({ cardName: "Hidden Legend", faceDown: true }),
    ]);
    expect(engine.getFilteredView(P1)).toEqual(before);
    expect(engine.fork().getOracleView(P1)).toEqual(oracle);
  });

  test("defaults bot games to the labelled full-information mode", () => {
    expect(getSafeAutomatedActionStrategyOption().informationPolicy).toBe("oracle");
    expect(getSafeAutomatedActionStrategyOption("expert-oracle")).toMatchObject({
      informationPolicy: "oracle",
      label: "Expert (full information)",
    });
  });

  test("sells to fund a Unit, then legally plays it without mutating the engine during search", () => {
    const funds = createMockUnit({ name: "Sell me", cost: 9, power: 0, hasSellTag: true });
    const threat = createMockUnit({ name: "Threat", cost: 4, power: 12 });
    const game = CyberpunkTestEngine.createWithFixture(
      { hand: [funds, threat], eddies: 0, deck: 10 },
      { deck: 10 },
    );
    const engine = game.getLocalEngine();
    const before = engine.getFilteredView(P1);
    const decision = expert.decideAction(buildDecisionContext(engine, P1, () => 0.5));
    expect(engine.getFilteredView(P1)).toEqual(before);
    expect(decision).toMatchObject({ kind: "command", move: "sellCard" });
    const bot = new AIPlayer(engine, P1, expert);
    expect(bot.step()).toMatchObject({ kind: "acted", decision: { move: "sellCard" } });
    expect(bot.step()).toMatchObject({ kind: "acted", decision: { move: "playCard" } });
    expect(game.getCardsInZone("field", P1).some((card) => card.definitionId === threat.id)).toBe(
      true,
    );
  });

  test("does not loop through an unaffordable optional replay", () => {
    const game = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: false },
        ],
        trash: [welcomeToNightCityRetailTowerfall],
        eddies: 2,
        deck: 10,
      },
      { eddies: 0, deck: 10 },
    );
    const bot = new AIPlayer(game.getLocalEngine(), P1, expert);
    const moves: string[] = [];
    for (let step = 0; step < 6; step++) {
      const result = bot.step();
      if (result.kind === "idle") break;
      expect(result.kind).toBe("acted");
      if (result.kind !== "acted") break;
      moves.push(result.decision.move);
      if (result.decision.move === "passPhase") break;
    }
    expect(moves).toContain("passPhase");
    expect(moves.filter((move) => move === "activateAbility").length).toBeLessThan(2);
  });

  test("search is deterministic and stays within its node budget", () => {
    const unit = createMockUnit({ power: 4, cost: 1 });
    const game = CyberpunkTestEngine.createWithFixture(
      { hand: [unit], eddies: 3, deck: 10 },
      { deck: 10 },
    );
    const ctx = buildDecisionContext(game.getLocalEngine(), P1, () => 0.5);
    const first = expert.decideAction(ctx);
    expect(expert.decideAction(ctx)).toEqual(first);
    expect(first.kind).toBe("command");
    if (first.kind === "command")
      expect(first.diagnostics?.nodesEvaluated ?? 0).toBeLessThanOrEqual(160);
  });

  test.each([
    ["Expert", createExpertOracleStrategy()],
    ["public default export", defaultStrategy],
  ] as const)(
    "%s develops a second Unit before adding power to a lagging host",
    (_label, strategy) => {
      const unit = createMockUnit({ name: "Second Unit", cost: 2, power: 2, hasSellTag: false });
      const host = createMockUnit({ name: "Lagging host", cost: 2, power: 3 });
      const gear = createMockGear({ name: "Extra power", cost: 2, power: 3, hasSellTag: false });
      const game = CyberpunkTestEngine.createWithFixture(
        {
          hand: [unit, gear],
          field: [{ card: host, hasLag: true }],
          eddies: 2,
          legendArea: [],
          deck: 10,
        },
        { legendArea: [], deck: 10 },
      );
      const engine = game.getLocalEngine();
      const before = engine.getFilteredView(P1);
      const cardId = game
        .getCardsInZone("hand", P1)
        .find((card) => card.definitionId === unit.id)!.instanceId;
      const gearId = game
        .getCardsInZone("hand", P1)
        .find((card) => card.definitionId === gear.id)!.instanceId;
      expect(
        createExpertOracleStrategy({ unitDevelopmentWeight: 0 }).decideAction(
          buildDecisionContext(engine, P1, () => 0.5),
        ),
      ).toMatchObject({ kind: "command", move: "playCard", args: { cardId: gearId } });
      const bot = new AIPlayer(engine, P1, strategy);
      const decision = strategy.decideAction(buildDecisionContext(engine, P1, () => 0.5));
      expect(decision).toMatchObject({
        kind: "command",
        move: "playCard",
        args: { cardId },
        diagnostics: { strategy: "expert-oracle" },
      });
      expect(engine.getFilteredView(P1)).toEqual(before);
      expect(bot.step()).toMatchObject({ kind: "acted", decision: { move: "playCard" } });
      expect(engine.getFilteredView(P1).players[P1]?.zones.field).toEqual([
        expect.objectContaining({ cardName: "Lagging host", type: "unit" }),
        expect.objectContaining({ cardName: "Second Unit", type: "unit", hasLag: true }),
      ]);
    },
  );

  test("finishes games against tactical in both seats", () => {
    for (const swapped of [false, true]) {
      const result = runAutoMatch({
        players: createTestPlayers(),
        decks: createTestDecks(),
        catalog: createTestCatalog(),
        seed: "expert-smoke",
        maxSteps: 800,
        strategies: swapped ? [tacticalStrategy, expert] : [expert, tacticalStrategy],
      });
      expect(["winCondition", "deckOut", "concede"], result.reason).toContain(result.reason);
      expect(result.automationConcessionApplied).not.toBe(true);
    }
  }, 120_000);
});
