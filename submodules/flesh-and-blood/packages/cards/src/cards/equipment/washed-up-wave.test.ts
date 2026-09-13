import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { barnacleYellow } from "../actions/barnacle.ts";
import { washedUpWave } from "./washed-up-wave.ts";

/**
 * Washed Up Wave (AGB006) — Pirate Necromancer Equipment - Arms, d0.
 *
 * Printed: When this defends, you may discard a card or destroy the top card
 * of your deck. If that card has watery grave, this gets +2{d}. Blade Break.
 */

describe("Washed Up Wave (AGB006) AAA", () => {
  it("happy: discarding a watery-grave card on defense gives this +2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: gravyBones,
        arms: [washedUpWave],
        hand: [barnacleYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    game.as(bravo).playAttack(snatchRed);
    Gravy.defendWith(washedUpWave);
    game.advanceToDecision(Gravy, "boolean");
    Gravy.chooseBoolean(true);
    const choice = Gravy.expectDecision("effect-resolution");
    game.answerDecision(Gravy.id, {
      kind: "effect-resolution",
      optionId: choice.options[0]!.id,
    });
    Gravy.chooseTargets(barnacleYellow);

    // Barnacle (watery grave) discarded, so the wave defends at 0+2{d}:
    // 4{p} - 2{d} = 2 damage.
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Gravy).toHaveLife(18);
    expectFabCard(Gravy, barnacleYellow).toBeIn("graveyard");
    expectFabCard(Gravy, washedUpWave).toBeIn("graveyard");
  });

  it("boundary: discarding a card without watery grave gives no +2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: gravyBones,
        arms: [washedUpWave],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    game.as(bravo).playAttack(snatchRed);
    Gravy.defendWith(washedUpWave);
    game.advanceToDecision(Gravy, "boolean");
    Gravy.chooseBoolean(true);
    const choice = Gravy.expectDecision("effect-resolution");
    game.answerDecision(Gravy.id, {
      kind: "effect-resolution",
      optionId: choice.options[0]!.id,
    });
    Gravy.chooseTargets(nimblismBlue);

    // Nimblism has no watery grave: the wave stays at 0{d}, 4 damage carries.
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Gravy).toHaveLife(16);
    expectFabCard(Gravy, nimblismBlue).toBeIn("graveyard");
  });

  it("timing: destroying a watery-grave top card of the deck also grants +2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: gravyBones,
        arms: [washedUpWave],
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, barnacleYellow],
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    game.as(bravo).playAttack(snatchRed);
    Gravy.defendWith(washedUpWave);
    game.advanceToDecision(Gravy, "boolean");
    Gravy.chooseBoolean(true);
    const choice = Gravy.expectDecision("effect-resolution");
    // The hand is empty, so only the destroy-top-of-deck arm is offered.
    game.answerDecision(Gravy.id, {
      kind: "effect-resolution",
      optionId: choice.options[0]!.id,
    });
    Gravy.chooseTargets(barnacleYellow);

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Gravy).toHaveLife(18);
    expectFabCard(Gravy, barnacleYellow).toBeIn("graveyard");
  });
});
