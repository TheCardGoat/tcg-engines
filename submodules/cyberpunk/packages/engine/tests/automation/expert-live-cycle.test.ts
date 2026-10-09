import { expect, test } from "vite-plus/test";
import { AIPlayer, buildDecisionContext } from "../../src/automation/index.ts";
import { createExpertOracleStrategy } from "../../src/automation/search/expert-oracle.ts";
import { semanticViewHash } from "../../src/automation/public-view-hash.ts";
import { createPlayerId } from "../../src/types/branded.ts";
import { createMatchState } from "../../src/state/initial-state.ts";
import { LocalEngine } from "../../src/transport/local-engine.ts";
import {
  createStructuredCatalog,
  deckListFromGenerated,
} from "../../../../tools/ai-runner/src/legal-decks.ts";
import { createTestPlayers } from "../../../../tools/ai-runner/src/test-catalog.ts";
import fixture from "./expert-cycle-fixture.json";

function regressionEngine(): LocalEngine {
  const deck = fixture.deck;
  const engine = new LocalEngine(
    createMatchState({
      players: createTestPlayers(),
      catalog: createStructuredCatalog(),
      deckLists: [deckListFromGenerated(deck, "p1"), deckListFromGenerated(deck, "p2")],
      seed: fixture.seed,
    }),
  );
  for (const [index, command] of fixture.commands.entries()) {
    expect(
      engine.processCommand(
        { commandID: `fixture:${index}`, move: command.move, input: { args: command.args } },
        createPlayerId(command.playerId),
      ).success,
    ).toBe(true);
  }
  return engine;
}

test("does not replan into the Alt activation/pass loop from bot-lab seed 57", () => {
  const engine = regressionEngine();
  const player = createPlayerId(fixture.playerId);
  const strategy = createExpertOracleStrategy();
  const context = buildDecisionContext(engine, player, () => 0.5);
  const before = engine.getOracleView(player);
  expect(strategy.decideAction(context)).toEqual(strategy.decideAction(context));
  expect(engine.getOracleView(player)).toEqual(before);
  const bot = new AIPlayer(engine, player, strategy);
  const visited = new Set<string>();
  for (let step = 0; step < 8; step++) {
    if (engine.getPrompt(player).status === "waiting") break;
    const hash = semanticViewHash({
      view: engine.getOracleView(player),
      prompt: engine.getPrompt(player),
    });
    expect(visited.has(hash), `Repeated live state at step ${step}`).toBe(false);
    visited.add(hash);
    expect(bot.step().kind).toBe("acted");
  }
}, 30_000);

test("does not share visited live states between matches using the same strategy", () => {
  const strategy = createExpertOracleStrategy();
  const player = createPlayerId(fixture.playerId);
  const first = regressionEngine();
  const expected = strategy.decideAction(buildDecisionContext(first, player, () => 0.5));
  const bot = new AIPlayer(first, player, strategy);
  expect(bot.step().kind).toBe("acted");
  expect(bot.step().kind).toBe("acted");
  const second = regressionEngine();
  expect(strategy.decideAction(buildDecisionContext(second, player, () => 0.5))).toEqual(expected);
}, 30_000);
