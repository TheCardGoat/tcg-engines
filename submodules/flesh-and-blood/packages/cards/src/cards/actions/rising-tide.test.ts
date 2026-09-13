import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { dash } from "../heroes/dash.ts";
import { homageToAncestorsBlue } from "../instants/homage-to-ancestors.ts";
import { nimblismBlue } from "./nimblism.ts";
import { risingTideBlue } from "./rising-tide.ts";

/**
 * Rising Tide, Blue (MST088) — Mystic Action - Attack, cost 1, 3{p}, 2{d}.
 * Printed: "If you've played another blue card this turn, this gets +2{p}."
 *
 * `played-another-blue-card-this-turn` is handled (playerBlueCardsPlayed ≥ 2,
 * including this blue). Homage to Ancestors is the same-turn blue vehicle.
 */

describe("Rising Tide (MST088) AAA", () => {
  it("happy: after another blue card this turn, Rising Tide is 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [homageToAncestorsBlue, risingTideBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Enigma.playAttack(risingTideBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Enigma, homageToAncestorsBlue).toBeIn("graveyard");
  });

  it("boundary: as the first blue card this turn, Rising Tide stays at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [risingTideBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.playAttack(risingTideBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: a blue card played last turn does not grant +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [homageToAncestorsBlue, risingTideBlue, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);
    const Dash = game.as(dash);

    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Enigma.endTurn();
    Dash.endTurn();
    game.helpers.untilIdle();

    Enigma.playAttack(risingTideBlue, { pitch: [nimblismBlue] });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });
});
