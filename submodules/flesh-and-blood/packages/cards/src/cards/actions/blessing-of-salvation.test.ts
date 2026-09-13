import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { blessingOfSalvationRed } from "./blessing-of-salvation.ts";
import { engulfingLightRed } from "./engulfing-light.ts";
import { nimblismBlue } from "./nimblism.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";

/**
 * Blessing of Salvation Red (DTD085) — Light Action.
 *
 * Printed: If a card has been put into your hero's soul this turn, you may
 * play this as though it were an instant.
 * Gain 3{h}
 */

describe("Blessing of Salvation family AAA", () => {
  it("happy: playing it gains 3{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blessingOfSalvationRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(blessingOfSalvationRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Boltyn).toHaveLife(23); // 20 + 3
    expectFabCard(Boltyn, blessingOfSalvationRed).toBeIn("graveyard");
  });

  it("boundary: without a soul entry this turn it cannot be played after the action point is spent", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [woundingBlowBlue, blessingOfSalvationRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(woundingBlowBlue);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveAP(0);

    expectFabUnplayable(
      () => Boltyn.must.playInstant(blessingOfSalvationRed),
      /action-point cost cannot be paid/i,
    );
    expectFabCard(Boltyn, blessingOfSalvationRed).toBeIn("hand");
  });

  it("timing: after charging this turn it plays from arsenal as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [engulfingLightRed, nimblismBlue],
        arsenal: [blessingOfSalvationRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(engulfingLightRed, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveAP(0);

    Boltyn.must.playFromArsenal(blessingOfSalvationRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Boltyn).toHaveLife(23);
    expectFabPlayer(Boltyn).toHaveAP(0);
    expectFabCard(Boltyn, blessingOfSalvationRed).toBeIn("graveyard");
  });
});
