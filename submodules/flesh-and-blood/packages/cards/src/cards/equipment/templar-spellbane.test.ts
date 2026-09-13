import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { flashBoltYellow } from "../instants/flash-bolt.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { templarSpellbane } from "./templar-spellbane.ts";

/**
 * Templar Spellbane (PEN043) — Warrior Head d1 Battleworn.
 *
 * Printed Instant — Destroy this: Prevent the next 1 arcane damage that would
 * be dealt to you this turn. If you've activated a weapon this turn, instead
 * prevent the next 2.
 *
 * performed-this-turn activate-weapon, stamped on activate when the source
 * type-box is Weapon. Never has-status activated-a-weapon-this-turn.
 */

describe("Templar Spellbane (PEN043) AAA", () => {
  it("happy: after activating a weapon this turn, destroy-self prevents the next 2 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        head: [templarSpellbane],
        weapon1: [zenithBlade],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: kano,
        hand: [flashBoltYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Kano = game.as(kano);

    Hala.activateAttack(zenithBlade);
    game.toReaction("defender");
    Kano.play(flashBoltYellow, { target: Hala.id });
    Kano.pass();
    Hala.activate(templarSpellbane);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Hala).toHaveLife(20);
    expectFabCard(Hala, templarSpellbane).toBeIn("graveyard");
  });

  it("boundary: without a weapon activation, destroy-self prevents only 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        head: [templarSpellbane],
        weapon1: [zenithBlade],
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: kano,
        hand: [flashBoltYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Kano = game.as(kano);

    game.helpers.passPriorityTo(Kano);
    Kano.play(flashBoltYellow, { target: Hala.id });
    Kano.pass();
    Hala.activate(templarSpellbane);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Hala).toHaveLife(19);
    expectFabCard(Hala, templarSpellbane).toBeIn("graveyard");
  });

  it("timing: a weapon activation last turn does not upgrade the prevent", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        head: [templarSpellbane],
        weapon1: [zenithBlade],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: kano,
        hand: [flashBoltYellow, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Kano = game.as(kano);

    Hala.activateAttack(zenithBlade);
    game.helpers.resolveRestOfCombat();
    Hala.endTurn();
    game.helpers.resolveUntilIdle();

    Kano.play(flashBoltYellow, { target: Hala.id, pitch: [nimblismBlue] });
    Kano.pass();
    Hala.activate(templarSpellbane);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Hala).toHaveLife(19);
  });
});
