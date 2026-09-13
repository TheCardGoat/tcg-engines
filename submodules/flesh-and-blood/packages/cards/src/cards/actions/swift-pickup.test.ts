import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { razorRingBlue } from "../instants/razor-ring.ts";
import { swiftPickupRed } from "./swift-pickup.ts";

/**
 * Swift Pickup (OMN231) — Ninja Action - Attack, cost 0, 3{p}, go again.
 *
 * Printed: When this attacks, you may put a shuriken item from your graveyard
 * on the bottom of your deck. If you do, this gets +1{p}.
 */

describe("Swift Pickup (OMN231) AAA", () => {
  it("happy: putting a GY shuriken on the bottom grants +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [swiftPickupRed],
        graveyard: [razorRingBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(swiftPickupRed, { stopAt: "on-attack" });
    Katsu.accept();
    Katsu.target(razorRingBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expect(Katsu.cardsIn("deck", razorRingBlue)).toHaveLength(1);
  });

  it("boundary: empty GY keeps printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [swiftPickupRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(swiftPickupRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
  });

  it("timing: declining leaves the shuriken in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [swiftPickupRed],
        graveyard: [razorRingBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(swiftPickupRed, { stopAt: "on-attack" });
    Katsu.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabCard(Katsu, razorRingBlue).toBeIn("graveyard");
  });
});
