import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { nimblismYellow } from "./nimblism.ts";
import { beamingBravadoRed } from "./beaming-bravado.ts";

/**
 * Beaming Bravado, Red (DTD057) — Light Warrior Action - Attack, cost 0, 3{p}.
 * Printed: "As an additional cost to play this, you may charge your hero's
 * soul.
 * If a yellow card is charged this way, this gets +1{p}"
 *
 * Charge is optional. A non-yellow charge or a declined charge grants no
 * +1{p}. Do not defend with an attack action: Boltyn's charged-this-turn
 * static would add another +1{p}.
 */

describe("Beaming Bravado (DTD057) AAA", () => {
  it("happy: charging a yellow card this way grants +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [beamingBravadoRed, nimblismYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(beamingBravadoRed, {
      charge: true,
      chargeCard: nimblismYellow,
    });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Boltyn, nimblismYellow).toBeIn("soul");
  });

  it("boundary: charging a non-yellow card this way grants no +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [beamingBravadoRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(beamingBravadoRed, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
  });

  it("boundary: declining the optional charge grants no +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [beamingBravadoRed, nimblismYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(beamingBravadoRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Boltyn, nimblismYellow).toBeIn("hand");
    expect(Boltyn.zone("soul")).toHaveLength(0);
  });
});
