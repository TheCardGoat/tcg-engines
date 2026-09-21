import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { bravo } from "../heroes/bravo.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { flashBoltYellow } from "../instants/flash-bolt.ts";
import { runebleedRobe } from "./runebleed-robe.ts";

const padding = () => Array.from({ length: 6 }, () => nimblismBlue);

/**
 * Runebleed Robe (PEN094 / SVI006) — Runeblade Equipment - Chest, d0.
 *
 * Printed Instant — Destroy this and a Runechant you control: prevent the next
 * 1 arcane damage that would be dealt to you this turn. Arcane Barrier 1.
 */
describe("Runebleed Robe (PEN094 / SVI006) AAA", () => {
  it("mixed cost: destroys the robe and one controlled Runechant to shield 1 arcane", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, life: 20, hand: [flashBoltYellow], resourcePoints: 2, deck: padding() },
      {
        hero: bravo,
        life: 20,
        chest: [runebleedRobe],
        arena: [fabToken("runechant")],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Bravo = game.as(bravo);

    Oscilio.play(flashBoltYellow, { target: Bravo.id });
    Oscilio.pass();
    Bravo.activate(runebleedRobe);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabCard(Bravo, runebleedRobe).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 0).toHaveLife(19);
    expectFabPlayer(Oscilio).toHaveResourceCount(0).toHaveHandCount(0);
    expectWait(game).toBeIdle();
  });

  it("mixed cost: with two controlled Runechants, the chosen one alone is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [runebleedRobe],
        arena: [fabToken("runechant"), fabToken("runechant")],
        deck: padding(),
      },
      { hero: oscilio, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(runebleedRobe);
    Bravo.expectDecision("entity-target");
    Bravo.chooseTargets(Bravo.cardsIn("arena", fabToken("runechant"))[0]!);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabCard(Bravo, runebleedRobe).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 1);
    expectWait(game).toBeIdle();
  });

  it("mixed cost: an opposing Runechant cannot pay the activation cost", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [runebleedRobe], deck: padding() },
      { hero: oscilio, arena: [fabToken("runechant")], deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(runebleedRobe);

    expectFabCard(Bravo, runebleedRobe).toBeIn("chest");
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 0);
    expectFabPlayer(game.as(oscilio)).toHaveTokenCount("runechant", 1);
  });

  it("timing: an unused shield expires at the end of the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        chest: [runebleedRobe],
        arena: [fabToken("runechant")],
        deck: padding(),
      },
      { hero: oscilio, hand: [flashBoltYellow, nimblismBlue], deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Oscilio = game.as(oscilio);

    Bravo.activate(runebleedRobe);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    Bravo.endTurn();
    Oscilio.must.pitch(nimblismBlue).play(flashBoltYellow, { target: Bravo.id });
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabCard(Bravo, runebleedRobe).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 0).toHaveLife(18);
    expectWait(game).toBeIdle();
  });

  it("restriction: the shield does not prevent physical attack damage", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [snatchRed], actionPoints: 1, deck: padding() },
      {
        hero: bravo,
        life: 20,
        chest: [runebleedRobe],
        arena: [fabToken("runechant")],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Bravo = game.as(bravo);

    Oscilio.pass();
    Bravo.activate(runebleedRobe);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    Oscilio.playAttack(snatchRed);
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, runebleedRobe).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("Arcane Barrier 1: paying one resource prevents one without destroying the robe", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: padding(),
      },
      { hero: bravo, life: 20, chest: [runebleedRobe], resourcePoints: 1, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(blazeFiremind).play(volticBoltRed, { target: Bravo.id });
    game.passBoth();
    const choice = Bravo.expectDecision("option");
    Bravo.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Bravo).toHaveLife(16).toHaveResourceCount(0);
    expectFabCard(Bravo, runebleedRobe).toBeIn("chest").toHaveKeyword("arcane-barrier");
  });

  it("Arcane Barrier 1: declining pays nothing and takes the full arcane event", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: padding(),
      },
      { hero: bravo, life: 20, chest: [runebleedRobe], resourcePoints: 1, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(blazeFiremind).play(volticBoltRed, { target: Bravo.id });
    game.passBoth();
    Bravo.expectDecision("option");
    Bravo.chooseOptions();

    expectFabPlayer(Bravo).toHaveLife(15).toHaveResourceCount(1);
    expectFabCard(Bravo, runebleedRobe).toBeIn("chest");
  });

  it("Arcane Barrier 1: without resources or a pitchable hand, no prevention is offered", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: padding(),
      },
      {
        hero: bravo,
        life: 20,
        chest: [runebleedRobe],
        hand: [],
        resourcePoints: 0,
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(blazeFiremind).play(volticBoltRed, { target: Bravo.id });
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Bravo).toHaveLife(15).toHaveResourceCount(0);
    expectFabCard(Bravo, runebleedRobe).toBeIn("chest");
    expectWait(game).toBeIdle();
  });

  it("defense 0: defending with the robe prevents no physical damage and leaves it equipped", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [snatchRed], actionPoints: 1, deck: padding() },
      { hero: bravo, life: 20, chest: [runebleedRobe], deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Bravo = game.as(bravo);

    Oscilio.playAttack(snatchRed);
    Bravo.defendWith(runebleedRobe);
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, runebleedRobe).toBeIn("chest").toHaveDefense(0);
    expectWait(game).toBeIdle();
  });
});
