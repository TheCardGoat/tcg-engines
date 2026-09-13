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
import { tidalSurgeBlue } from "./tidal-surge.ts";

/**
 * Tidal Surge, Blue (MST090) — Mystic Action - Attack, cost 3, 5{p}, 2{d}.
 * Printed: "If you've played another blue card this turn, this gets +2{p}."
 *
 * `played-another-blue-card-this-turn` is handled (playerBlueCardsPlayed ≥ 2,
 * including this blue). Homage to Ancestors is the same-turn blue vehicle.
 */

describe("Tidal Surge (MST090) AAA", () => {
  it("happy: after another blue card this turn, Tidal Surge is 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [homageToAncestorsBlue, tidalSurgeBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Enigma.playAttack(tidalSurgeBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Enigma, homageToAncestorsBlue).toBeIn("graveyard");
  });

  it("boundary: as the first blue card this turn, Tidal Surge stays at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [tidalSurgeBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.playAttack(tidalSurgeBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: a blue card played last turn does not grant +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [homageToAncestorsBlue, tidalSurgeBlue, nimblismBlue],
        resourcePoints: 3,
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

    Enigma.playAttack(tidalSurgeBlue, { pitch: [nimblismBlue] });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });
});
