import { describe, expect, it } from "vite-plus/test";
import { ragingOnslaughtRed } from "../../../../cards/src/cards/actions/raging-onslaught.ts";
import { sloggismRed } from "../../../../cards/src/cards/actions/sloggism.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import {
  woundingBlowBlue,
  woundingBlowRed,
} from "../../../../cards/src/cards/actions/wounding-blow.ts";
import { ironrotLegs } from "../../../../cards/src/cards/equipment/ironrot-legs.ts";
import { bravoShowstopper } from "../../../../cards/src/cards/heroes/bravo-showstopper.ts";
import { rhinarRecklessRampage } from "../../../../cards/src/cards/heroes/rhinar-reckless-rampage.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import { expectCombat, expectFabPlayer } from "../../testing/fluent-assert.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { chooseAutomatedAction, submitAutomatedAction } from "../bot-strategies.ts";
import { listLegalCommands } from "../legal-commands.ts";
import { heroProfileStrategy } from "./profiles/dispatch.ts";
import { buildHeuristicSnapshot } from "./snapshot.ts";

/** Owns bot choices: submit the chosen public command, then verify the played outcome. */
function defendAsBot(game: FabTestEngine) {
  const runtime = game.getRuntime();
  const actorId = game.as(bravoShowstopper).id;
  const chosen = chooseAutomatedAction(runtime, actorId, heroProfileStrategy);
  if (!chosen) throw new Error("Expected a defending bot command.");
  const submitted = submitAutomatedAction(
    runtime,
    actorId,
    chosen,
    listLegalCommands(runtime, actorId),
  );
  expect(submitted.advanced).toBe(true);
  expect(submitted.command).toEqual(chosen);
  game.closeCombat();
  return chosen;
}

function partialBlockGame(life: number) {
  const game = FabTestEngine.start(
    { hero: bravoShowstopper, life, hand: [woundingBlowRed], deck: [], resourcePoints: 0 },
    {
      hero: rhinarRecklessRampage,
      hand: [ragingOnslaughtRed, woundingBlowBlue],
      deck: [],
      resourcePoints: 0,
    },
  );
  game.as(bravoShowstopper).endTurn();
  game.as(rhinarRecklessRampage).must.pitch(woundingBlowBlue).playAttack(ragingOnslaughtRed);
  return game;
}

describe("bot defense survival and on-hits", () => {
  it("takes a partial block that survives lethal instead of retaining the attack", () => {
    const game = partialBlockGame(5);
    expectCombat(game).toHaveAttackPower(7);
    expect(defendAsBot(game).move).toBe("defend");
    expectFabPlayer(game.as(bravoShowstopper)).toHaveLife(1).toHaveHandCount(0);
  });

  it("can retain the same attack when the damage is survivable", () => {
    const game = partialBlockGame(20);
    expect(defendAsBot(game).move).toBe("pass");
    expectFabPlayer(game.as(bravoShowstopper)).toHaveLife(13).toHaveHandCount(1);
  });

  it("uses four defending cards when three would still be lethal", () => {
    const game = FabTestEngine.start(
      { hero: rhinarRecklessRampage, hand: [sloggismRed, ragingOnslaughtRed], deck: [] },
      {
        hero: bravoShowstopper,
        life: 2,
        hand: [woundingBlowRed, woundingBlowRed, woundingBlowRed, woundingBlowRed],
        deck: [],
      },
    );
    game.as(rhinarRecklessRampage).play(sloggismRed);
    game.as(rhinarRecklessRampage).playAttack(ragingOnslaughtRed);
    expectCombat(game).toHaveAttackPower(13);
    expect(defendAsBot(game).payload.instanceIds).toHaveLength(4);
    expectFabPlayer(game.as(bravoShowstopper)).toHaveLife(1).toHaveHandCount(0);
  });

  it("spends armor to stop Snatch's actual draw-on-hit", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [woundingBlowRed], legs: [ironrotLegs], deck: [] },
      {
        hero: rhinarRecklessRampage,
        hand: [snatchRed, woundingBlowBlue, woundingBlowBlue, woundingBlowBlue],
        deck: [woundingBlowRed],
      },
    );
    game.as(bravoShowstopper).endTurn();
    game.as(rhinarRecklessRampage).playAttack(snatchRed);
    const runtime = game.getRuntime();
    const snapshot = buildHeuristicSnapshot(
      runtime,
      game.as(bravoShowstopper).id,
      buildFabRulesView(runtime.getState()),
    );
    // This assertion owns the heuristic's evaluation contract, not the card AST.
    expect(snapshot.attackOnHitValue).toBe(3);
    expect(defendAsBot(game).payload.instanceIds).toHaveLength(2);
    expectFabPlayer(game.as(bravoShowstopper)).toHaveLife(40);
    expectFabPlayer(game.as(rhinarRecklessRampage)).toHaveHandCount(3);
  });

  it("keeps a surviving large block while bounding candidates for an oversized hand", () => {
    const game = FabTestEngine.start(
      { hero: rhinarRecklessRampage, hand: [sloggismRed, ragingOnslaughtRed], deck: [] },
      {
        hero: bravoShowstopper,
        life: 2,
        hand: Array.from({ length: 16 }, () => woundingBlowRed),
        deck: [],
      },
    );
    game.as(rhinarRecklessRampage).play(sloggismRed);
    game.as(rhinarRecklessRampage).playAttack(ragingOnslaughtRed);
    const commands = listLegalCommands(game.getRuntime(), game.as(bravoShowstopper).id).filter(
      (command) => command.move === "defend",
    );
    expect(commands.length).toBeLessThanOrEqual(1_024);
    expect(
      commands.some(
        (command) =>
          Array.isArray(command.payload.instanceIds) && command.payload.instanceIds.length === 16,
      ),
    ).toBe(true);
    defendAsBot(game);
    expectFabPlayer(game.as(bravoShowstopper)).toHaveLife(2);
  });
});
