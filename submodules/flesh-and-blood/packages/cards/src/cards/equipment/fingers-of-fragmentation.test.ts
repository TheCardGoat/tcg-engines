import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { zyggy } from "../heroes/zyggy.ts";
import { dash } from "../heroes/dash.ts";
import { shatteringFlowtideBlue } from "../actions/shattering-flowtide.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { fingersOfFragmentation } from "./fingers-of-fragmentation.ts";

/**
 * Fingers of Fragmentation — Illusionist Equipment - Arms, d0.
 *
 * Printed: "Instant - {r}{r}, destroy this: Target attack action card that
 * has fragmented gets +2{p}."
 * Shattering Flowtide (Fragment) defended by a 2{d} card is the real
 * fragmented attack: 3{p} − 2 = 1 before the arms restore it to 3.
 */

describe("Fingers of Fragmentation (OMN039) AAA", () => {
  it("happy: destroy this to give the fragmented attack +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        arms: [fingersOfFragmentation],
        hand: [shatteringFlowtideBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggy);
    const Dash = game.as(dash);

    Zyggy.playAttack(shatteringFlowtideBlue);
    Dash.defendWith(nimblismBlue);
    game.toReaction("attacker");

    // Fragment: the 2{d} block already cut 3{p} down to 1{p}.
    expectCombat(game).toHaveAttackPower(1);

    Zyggy.activate(fingersOfFragmentation);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Zyggy, fingersOfFragmentation).toBeIn("graveyard");
  });

  it("boundary: an attack that has not fragmented cannot be targeted", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        arms: [fingersOfFragmentation],
        hand: [shatteringFlowtideBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggy);

    Zyggy.playAttack(shatteringFlowtideBlue);
    game.toReaction("attacker");

    // No defence at all — nothing fragmented, no legal +2{p} subject.
    Zyggy.expectActivationRejected(fingersOfFragmentation);
    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Zyggy, fingersOfFragmentation).toBeIn("arms");
  });
});
