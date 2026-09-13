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
import { spilloverBlue } from "./spillover.ts";

/**
 * Spillover, Blue (ENG014) — Mystic Action - Attack, cost 2, 4{p}, 2{d}.
 * Printed: "If you've played another blue card this turn, this gets +2{p}."
 *
 * `played-another-blue-card-this-turn` is handled (playerBlueCardsPlayed ≥ 2,
 * including this blue). Homage to Ancestors is the same-turn blue vehicle.
 */

describe("Spillover (ENG014) AAA", () => {
  it("happy: after another blue card this turn, Spillover is 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [homageToAncestorsBlue, spilloverBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Enigma.playAttack(spilloverBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Enigma, homageToAncestorsBlue).toBeIn("graveyard");
  });

  it("boundary: as the first blue card this turn, Spillover stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [spilloverBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.playAttack(spilloverBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: a blue card played last turn does not grant +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [homageToAncestorsBlue, spilloverBlue, nimblismBlue],
        resourcePoints: 2,
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

    Enigma.playAttack(spilloverBlue, { pitch: [nimblismBlue] });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });
});
