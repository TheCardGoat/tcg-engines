import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { chane } from "../heroes/chane.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { hazeBendingBlue } from "../actions/haze-bending.ts";
import { browbeatBlue } from "../actions/browbeat.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { fluttersteps } from "./fluttersteps.ts";

/**
 * Fluttersteps — Illusionist Equipment - Legs, ward 1.
 *
 * Printed: "When this is destroyed, you may play your next aura this turn
 * as though it were an instant."
 * Ward 1 destroys the legs on the first hit (Brutal Assault — no on-hit
 * triggers, so the destroy is the only trigger); Haze Bending is the real
 * Illusionist aura that then resolves at instant speed in combat.
 */

describe("Fluttersteps (ROS251) AAA", () => {
  it("happy: the ward destroy lets the next aura resolve as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: enigma,
        legs: [fluttersteps],
        hand: [hazeBendingBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    game.as(chane).playAttack(brutalAssaultBlue);
    Enigma.defendWith();
    game.closeCombat({ optionals: "accept" });
    // The destroy trigger resolves after the chain closes; accepting its
    // "may play" latch marks the next aura as playable as an instant.
    game.untilIdle({ optionals: "accept" });

    // Ward 1 destroyed the legs to prevent 1 of the 4 damage.
    expectFabCard(Enigma, fluttersteps).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(17);

    // The latch lets Haze Bending resolve at instant speed — no action point.
    game.helpers.passPriorityTo(Enigma);
    Enigma.play(hazeBendingBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Enigma, hazeBendingBlue).toBeIn("arena");
  });

  it("boundary: a fully blocked attack never destroys the legs, so no aura latch", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: enigma,
        legs: [fluttersteps],
        hand: [hazeBendingBlue, browbeatBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    game.as(chane).playAttack(brutalAssaultBlue);
    Enigma.defendWith(browbeatBlue, nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // 5{d} ≥ 4{p}: no damage, no ward destroy, no "may play" offer.
    expectFabCard(Enigma, fluttersteps).toBeIn("legs");
    expectFabCard(Enigma, hazeBendingBlue).toBeIn("hand");
  });
});
