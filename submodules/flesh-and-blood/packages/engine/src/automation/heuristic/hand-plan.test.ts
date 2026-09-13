import { describe, expect, it } from "vite-plus/test";
import { ankaDragUnderYellow } from "../../../../cards/src/cards/actions/anka-drag-under.ts";
import { legTapRed, legTapYellow } from "../../../../cards/src/cards/actions/leg-tap.ts";
import { ragingOnslaughtRed } from "../../../../cards/src/cards/actions/raging-onslaught.ts";
import {
  woundingBlowBlue,
  woundingBlowRed,
} from "../../../../cards/src/cards/actions/wounding-blow.ts";
import { faiRisingRebellion } from "../../../../cards/src/cards/heroes/fai-rising-rebellion.ts";
import { gravyBonesShipwreckedLooter } from "../../../../cards/src/cards/heroes/gravy-bones-shipwrecked-looter.ts";
import { rhinarRecklessRampage } from "../../../../cards/src/cards/heroes/rhinar-reckless-rampage.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import { expectCombat, expectFabPlayer } from "../../testing/fluent-assert.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { chooseAutomatedAction, submitAutomatedAction } from "../bot-strategies.ts";
import { listLegalCommands } from "../legal-commands.ts";
import { planHandOffense } from "./hand-value.ts";
import { heroProfileStrategy } from "./profiles/dispatch.ts";
import { buildHeuristicSnapshot } from "./snapshot.ts";

function snapshot(game: FabTestEngine, actorId: string) {
  const runtime = game.getRuntime();
  return buildHeuristicSnapshot(runtime, actorId, buildFabRulesView(runtime.getState()));
}

/** Owns bot command selection and submission; outcomes are asserted through play. */
function takeBotAction(game: FabTestEngine, actorId: string) {
  const runtime = game.getRuntime();
  const command = chooseAutomatedAction(runtime, actorId, heroProfileStrategy);
  if (!command) throw new Error("Expected a bot command.");
  const submitted = submitAutomatedAction(
    runtime,
    actorId,
    command,
    listLegalCommands(runtime, actorId),
  );
  expect(submitted.advanced).toBe(true);
  expect(submitted.command).toEqual(command);
  return command;
}

describe("hand plans and activation prices", () => {
  it("opens the go-again chain and carries one blue across two paid attacks", () => {
    const game = FabTestEngine.start(
      {
        hero: faiRisingRebellion,
        hand: [woundingBlowRed, legTapRed, legTapYellow, woundingBlowBlue],
        deck: [],
        resourcePoints: 0,
      },
      { hero: rhinarRecklessRampage, hand: [], deck: [] },
    );
    const fai = game.as(faiRisingRebellion);
    const read = snapshot(game, fai.id);
    const plan = planHandOffense(read);
    expect(plan.damage).toBe(11);
    const chosen = takeBotAction(game, fai.id);
    const opener = read.hand.find((card) => card.instanceId === chosen?.payload.instanceId);
    expect(opener?.canonicalId).toBe(legTapRed.canonicalId);

    const payment = takeBotAction(game, fai.id);
    const blueId = read.hand.find(
      (card) => card.canonicalId === woundingBlowBlue.canonicalId,
    )!.instanceId;
    expect(payment.payload.answer).toEqual({ kind: "payment", instanceIds: [blueId] });
    game.advanceUntil({ stopAt: "defend" });
    game.as(rhinarRecklessRampage).defendWith();
    game.closeCombat();
    expectFabPlayer(fai).toHaveResourceCount(2).toHaveAP(1);
    fai.playAttack(legTapYellow);
    game.as(rhinarRecklessRampage).defendWith();
    game.closeCombat();
    expectFabPlayer(fai).toHaveResourceCount(1).toHaveAP(1);
    fai.playAttack(woundingBlowRed);
    game.as(rhinarRecklessRampage).defendWith();
    game.closeCombat();
    expectFabPlayer(game.as(rhinarRecklessRampage)).toHaveLife(29);
  });

  it("cannot fund an attack by pitching the blue in arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: faiRisingRebellion,
        hand: [ragingOnslaughtRed],
        arsenal: [woundingBlowBlue],
        deck: [],
        resourcePoints: 0,
      },
      { hero: rhinarRecklessRampage, hand: [], deck: [] },
    );
    const fai = game.as(faiRisingRebellion);
    const plan = planHandOffense(snapshot(game, fai.id));
    expect(plan.damage).toBe(2);
    expect(plan.pitchInstanceIds).toEqual([]);
    fai.playAttack(woundingBlowBlue, { from: "arsenal" });
    game.as(rhinarRecklessRampage).defendWith();
    game.closeCombat();
    expectFabPlayer(fai).toHaveHandCount(1).toHaveResourceCount(0);
    expectFabPlayer(game.as(rhinarRecklessRampage)).toHaveLife(38);
  });

  it("uses an ally's affordable attack activation instead of its summon cost", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBonesShipwreckedLooter,
        hand: [],
        arena: [ankaDragUnderYellow],
        deck: [],
        resourcePoints: 1,
      },
      { hero: rhinarRecklessRampage, hand: [], deck: [] },
    );
    const gravy = game.as(gravyBonesShipwreckedLooter);
    const chosen = takeBotAction(game, gravy.id);
    expect(chosen?.move).toBe("activate");
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.as(rhinarRecklessRampage).defendWith();
    game.closeCombat();
    expectFabPlayer(gravy).toHaveResourceCount(0);
    expectFabPlayer(game.as(rhinarRecklessRampage)).toHaveLife(35);
  });
});
