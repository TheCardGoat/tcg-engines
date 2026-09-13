import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { dash } from "../heroes/dash.ts";
import { homageToAncestorsBlue } from "../instants/homage-to-ancestors.ts";
import { moonChakraBlue } from "../instants/moon-chakra.ts";
import { nimblismBlue } from "./nimblism.ts";
import { secondTenetOfChiTideBlue } from "./second-tenet-of-chi-tide.ts";

/**
 * Second Tenet of Chi: Tide, Blue (ENG019) — Mystic Action - Attack, cost 3,
 * 5{p}, 3{d}.
 * Printed: "If you've transcended this turn, this gets +2{p}."
 *
 * `transcended-this-turn` is handled (CR 8.5.48). Homage to Ancestors after
 * another blue is the transcend vehicle (ENG023).
 */

describe("Second Tenet of Chi: Tide (ENG019) AAA", () => {
  it("happy: after transcending this turn, the attack is 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [moonChakraBlue, homageToAncestorsBlue, secondTenetOfChiTideBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(moonChakraBlue);
    game.helpers.resolveUntilIdle();
    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();

    Enigma.playAttack(secondTenetOfChiTideBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: without transcending this turn, the attack stays at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [secondTenetOfChiTideBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.playAttack(secondTenetOfChiTideBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: a last-turn transcend does not grant +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [moonChakraBlue, homageToAncestorsBlue, secondTenetOfChiTideBlue, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);
    const Dash = game.as(dash);

    Enigma.play(moonChakraBlue);
    game.helpers.resolveUntilIdle();
    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Enigma.endTurn();
    Dash.endTurn();
    game.helpers.untilIdle();

    Enigma.playAttack(secondTenetOfChiTideBlue, { pitch: [nimblismBlue] });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });
});
