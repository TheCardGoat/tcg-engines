import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { barnacleYellow } from "./barnacle.ts";
import { dash } from "../heroes/dash.ts";
import { gold } from "../tokens/gold.ts";
import { fai } from "../heroes/fai.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { ankaDragUnderYellow } from "./anka-drag-under.ts";

describe("Anka, Drag Under (AGB014) AAA", () => {
  it("happy: Action — {r}, {t}: Attack hits for printed 5", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        arena: [ankaDragUnderYellow],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.activate(ankaDragUnderYellow, {
      abilityId: `${ankaDragUnderYellow.canonicalId}:actionAttack`,
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Fai, ankaDragUnderYellow).toBeIn("arena");
  });

  it("timing: Instant discard-a-Watery-Grave: the next opponent draw this action phase discards", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [gold],
        resourcePoints: 1,
        actionPoints: 2,
        deck: [brutalAssaultBlue],
        hand: [snatchRed, crackedBaubleYellow],
      },
      {
        hero: fai,
        arena: [ankaDragUnderYellow],
        hand: [barnacleYellow],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Fai = game.as(fai);

    Dash.pass();
    Fai.activate(ankaDragUnderYellow, {
      abilityId: `${ankaDragUnderYellow.canonicalId}:instantDiscardWateryGraveNextTimeOpponentDrawsOne`,
    });
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: barnacleYellow.canonicalId });

    Dash.activate(gold);
    game.helpers.resolveUntilIdle({
      paymentCanonicalId: snatchRed.canonicalId,
      entityTargetCanonicalId: brutalAssaultBlue.canonicalId,
    });

    expect(Dash.handCount()).toBe(1);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
    expectFabCard(Dash, crackedBaubleYellow).toBeIn("hand");
  });

  it("boundary: Watery Grave turns Anka face-down when it dies from the arena", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: fai,
        arena: [ankaDragUnderYellow],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Fai = game.as(fai);
    const allyId = Fai.findCardInZone("arena", ankaDragUnderYellow);

    // I'd like to have a syntax like
    //Dash.attackWith(brutalAssaultBlue, { target: ankaDragUnderYellow });
    Dash.attackWith(brutalAssaultBlue, { target: allyId });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Fai, ankaDragUnderYellow).toBeIn("graveyard");
    expectFabCard(Fai, ankaDragUnderYellow).toBeFaceDown();
  });
});
