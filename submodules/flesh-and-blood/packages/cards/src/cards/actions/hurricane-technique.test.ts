import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { risingKneeThrustRed } from "./rising-knee-thrust.ts";

import { hurricaneTechniqueYellow } from "./hurricane-technique.ts";

/**
 * Hurricane Technique (WTR084) — Ninja Action - Attack, cost 1, 4{p}, 3{d}.
 *
 * Printed: 'Combo - If Rising Knee Thrust was the last attack this combat
 * chain, Hurricane Technique gains +1{p}, go again, and "If Hurricane
 * Technique hits, put it into your hand."'
 *
 * Keep the chain open: playAttack → advanceCombatTo("resolution") → next
 * playAttack. `untilIdle` closes combo.
 */

describe("Hurricane Technique (WTR084) AAA", () => {
  it("happy: after Rising Knee Thrust this is 5{p} on an open chain and returns on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [risingKneeThrustRed, hurricaneTechniqueYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(risingKneeThrustRed);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(hurricaneTechniqueYellow);
    game.advanceCombatTo("defend");

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(5);

    game.closeCombat({ optionals: "decline" });
    expectFabCard(Katsu, hurricaneTechniqueYellow).toBeIn("hand");
  });

  it("boundary: without Rising Knee Thrust as the last attack this stays 4{p} and goes to graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [hurricaneTechniqueYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(hurricaneTechniqueYellow);
    expectCombat(game).toHaveAttackPower(4);

    game.closeCombat({ optionals: "decline" });
    expectFabCard(Katsu, hurricaneTechniqueYellow).toBeIn("graveyard");
  });

  it("timing: a closed Rising Knee Thrust chain does not arm combo on a fresh chain", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [risingKneeThrustRed, hurricaneTechniqueYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(risingKneeThrustRed);
    game.closeCombat({ optionals: "decline" });
    Katsu.playAttack(hurricaneTechniqueYellow);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Katsu).toHaveAP(0);
  });
});
