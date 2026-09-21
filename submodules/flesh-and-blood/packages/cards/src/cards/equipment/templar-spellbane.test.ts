import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { flashBoltBlue, flashBoltYellow } from "../instants/flash-bolt.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { templarSpellbane } from "./templar-spellbane.ts";

const padding = () => Array.from({ length: 6 }, () => nimblismBlue);

/**
 * Templar Spellbane (PEN043) — Warrior Equipment - Head, d1.
 *
 * Printed Instant — Destroy this: prevent the next 1 arcane damage this turn;
 * after activating a weapon this turn, instead prevent the next 2. Battleworn.
 * CR 6.4.10j makes “prevent the next” a shielding prevention whose unused
 * amount carries across qualifying damage events until exhausted.
 */
describe("Templar Spellbane (PEN043) AAA", () => {
  it("weapon activation: shields exactly 2 across separate 1- and 2-arcane events", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        life: 20,
        head: [templarSpellbane],
        weapon1: [zenithBlade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: padding(),
      },
      {
        hero: oscilio,
        life: 20,
        hand: [flashBoltBlue, flashBoltYellow],
        resourcePoints: 4,
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Oscilio = game.as(oscilio);

    Hala.activateAttack(zenithBlade);
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });
    Hala.activate(templarSpellbane);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    Hala.pass();
    Oscilio.play(flashBoltBlue, { target: Hala.id });
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    expectFabPlayer(Hala).toHaveLife(20);

    Hala.pass();
    Oscilio.play(flashBoltYellow, { target: Hala.id });
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Hala).toHaveLife(19);
    expectFabCard(Hala, templarSpellbane).toBeIn("graveyard");
    expectFabPlayer(Oscilio).toHaveLife(17).toHaveResourceCount(0).toHaveHandCount(0);
    expectWait(game).toBeIdle();
  });

  it("base: without a weapon activation, shields 1 from a 2-arcane event", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [flashBoltYellow],
        resourcePoints: 2,
        deck: padding(),
      },
      {
        hero: halaBladesaintOfTheVow,
        life: 20,
        head: [templarSpellbane],
        weapon1: [zenithBlade],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Hala = game.as(halaBladesaintOfTheVow);

    Oscilio.play(flashBoltYellow, { target: Hala.id });
    Oscilio.pass();
    Hala.activate(templarSpellbane);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Hala).toHaveLife(19);
    expectFabCard(Hala, templarSpellbane).toBeIn("graveyard");
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveResourceCount(0).toHaveHandCount(0);
    expectWait(game).toBeIdle();
  });

  it("timing: a weapon activation from the prior turn does not upgrade the shield", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        life: 20,
        head: [templarSpellbane],
        weapon1: [zenithBlade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: padding(),
      },
      {
        hero: oscilio,
        life: 20,
        hand: [flashBoltYellow, nimblismBlue],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Oscilio = game.as(oscilio);

    Hala.activateAttack(zenithBlade);
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });
    Hala.endTurn();
    Oscilio.must.pitch(nimblismBlue).play(flashBoltYellow, { target: Hala.id });
    Oscilio.pass();
    Hala.activate(templarSpellbane);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Hala).toHaveLife(19);
    expectFabCard(Hala, templarSpellbane).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("timing: an unused shield expires at the end of the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        life: 20,
        head: [templarSpellbane],
        weapon1: [zenithBlade],
        deck: padding(),
      },
      {
        hero: oscilio,
        life: 20,
        hand: [flashBoltYellow, nimblismBlue],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Oscilio = game.as(oscilio);

    Hala.activate(templarSpellbane);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    Hala.endTurn();
    Oscilio.must.pitch(nimblismBlue).play(flashBoltYellow, { target: Hala.id });
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Hala).toHaveLife(18);
    expectFabCard(Hala, templarSpellbane).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("Battleworn: d1 defends once, remains equipped, and receives a -1 defense counter", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [snatchRed],
        actionPoints: 1,
        deck: padding(),
      },
      {
        hero: halaBladesaintOfTheVow,
        life: 20,
        head: [templarSpellbane],
        weapon1: [zenithBlade],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Hala = game.as(halaBladesaintOfTheVow);

    Oscilio.playAttack(snatchRed);
    Hala.defendWith(templarSpellbane);
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Hala).toHaveLife(17);
    expectFabCard(Hala, templarSpellbane).toBeIn("head").toHaveDefenseCounters(-1).toHaveDefense(0);
    expectWait(game).toBeIdle();
  });
});
