import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { boltOfCourageRed } from "./bolt-of-courage.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { snatchRed } from "./snatch.ts";
import { luminaAscensionYellow } from "./lumina-ascension.ts";

/**
 * Lumina Ascension (MON034) — Light Warrior Action, cost 0, 3{d}, go again.
 *
 * Printed: Until end of turn, weapons you control gain +1{p} and "If this
 * hits, reveal the top card of your deck. If it's a Light card, put it into
 * your hero's soul and gain 1{h}, otherwise put it on the bottom of your
 * deck." If you've charged this turn, you may attack an additional time
 * with each weapon you control. Go again.
 */

describe("Lumina Ascension (MON034) AAA", () => {
  it("happy: weapons you control gain +1{p} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [luminaAscensionYellow],
        weapon1: [cintariSaber],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Kano = game.as(kano);

    Boltyn.play(luminaAscensionYellow);
    game.untilIdle();
    expectFabPlayer(Boltyn).toHaveAP(1);

    Boltyn.activateAttack(cintariSaber);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Kano).toHaveLife(12);
    expectFabCard(Boltyn, luminaAscensionYellow).toBeIn("graveyard");
  });

  it("boundary: without charging this turn a second saber activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [luminaAscensionYellow],
        weapon1: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(luminaAscensionYellow);
    game.untilIdle();
    Boltyn.activateAttack(cintariSaber);
    game.closeCombat({ optionals: "decline" });

    const rejection = Boltyn.expectActivationRejected(cintariSaber);
    expect(rejection.errorCode).toBe("activation_limit");
  });

  it("timing: on-hit Light reveal files the card to soul and gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [luminaAscensionYellow],
        weapon1: [cintariSaber],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deckTop: [boltOfCourageRed],
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(luminaAscensionYellow);
    game.untilIdle();
    Boltyn.activateAttack(cintariSaber);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Boltyn, boltOfCourageRed).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveLife(21);
  });

  it("timing: the charged-turn extra swing is granted without an optional prompt", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageRed, luminaAscensionYellow, snatchRed],
        weapon1: [cintariSaber],
        resourcePoints: 3,
        actionPoints: 4,
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Kano = game.as(kano);

    // Perform the charge through Bolt of Courage's rider.
    Boltyn.attackWith(boltOfCourageRed, { charge: true, chargeCard: snatchRed });
    game.helpers.resolveRestOfCombat();
    expect(Boltyn.zone("soul")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Kano).toHaveLife(12); // Bolt of Courage printed 3{p}

    Boltyn.play(luminaAscensionYellow);
    game.untilIdle();

    Boltyn.activateAttack(cintariSaber);
    // CR 5.2.3c: with the charge performed the grant applies by itself — a
    // full decline pass must still lift each weapon's limit.
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Kano).toHaveLife(9); // saber 2 + 1 buffed

    Boltyn.activateAttack(cintariSaber);
    game.advanceCombatTo("defend");
    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(3);
  });
});
