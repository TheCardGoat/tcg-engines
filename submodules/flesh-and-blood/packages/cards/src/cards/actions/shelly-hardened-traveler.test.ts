import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { giveNoQuarterBlue } from "./give-no-quarter.ts";
import { snatchRed } from "./snatch.ts";
import { shellyHardenedTravelerYellow } from "./shelly-hardened-traveler.ts";

describe("Shelly, Hardened Traveler (SEA078) AAA", () => {
  it("happy: Instant gives the next defending attack action +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: gravyBones,
        arena: [shellyHardenedTravelerYellow],
        hand: [brutalAssaultBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);

    Dash.pass();
    Gravy.activate(shellyHardenedTravelerYellow, {
      abilityId: `${shellyHardenedTravelerYellow.canonicalId}:instantTNextAttackActionDefendWithTurnGetsNumber1Defense`,
    });
    game.helpers.resolveUntilIdle();

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Gravy.defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    // Snatch 4{p} vs defending AAC 3{d}+1 = 0 damage.
    expectFabPlayer(Gravy).toHaveLife(20);
  });

  it("boundary: a defending non-attack action is not buffed", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: gravyBones,
        arena: [shellyHardenedTravelerYellow],
        hand: [giveNoQuarterBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);

    Dash.pass();
    Gravy.activate(shellyHardenedTravelerYellow, {
      abilityId: `${shellyHardenedTravelerYellow.canonicalId}:instantTNextAttackActionDefendWithTurnGetsNumber1Defense`,
    });
    game.helpers.resolveUntilIdle();
    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Gravy.defendWith(giveNoQuarterBlue);
    game.helpers.resolveRestOfCombat();

    // Snatch 4{p} vs Give No Quarter 3{d} unbuffed = 1 damage.
    expectFabPlayer(Gravy).toHaveLife(19);
  });

  it("timing: tap-Attack returns Shelly to the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [shellyHardenedTravelerYellow],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(shellyHardenedTravelerYellow, {
      abilityId: `${shellyHardenedTravelerYellow.canonicalId}:actionResourceResourceResourceTAttack`,
    });
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    expectFabCard(Gravy, shellyHardenedTravelerYellow).toBeIn("arena");
  });
});
