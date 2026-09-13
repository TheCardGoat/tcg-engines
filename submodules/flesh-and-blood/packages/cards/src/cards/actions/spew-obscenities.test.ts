import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { spewObscenitiesYellow } from "./spew-obscenities.ts";

/**
 * Spew Obscenities (SUP078) — Reviled Guardian AAC 3{p}/3{d}.
 *
 * Printed: If you control a Confidence or Might token, this gets +1{p}.
 * When this hits a hero, create a Confidence and a Might token.
 */

describe("Spew Obscenities (SUP078) AAA", () => {
  it("happy: a hit creates a Confidence and a Might token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [spewObscenitiesYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(spewObscenitiesYellow);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 1).toHaveTokenCount("might", 1);
  });

  it("boundary: a miss creates no Confidence or Might", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [spewObscenitiesYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(spewObscenitiesYellow);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });

  it("timing: tokens are not created until the attack hits", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [spewObscenitiesYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(spewObscenitiesYellow);
    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 0).toHaveTokenCount("might", 0);
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 1).toHaveTokenCount("might", 1);
  });
});
