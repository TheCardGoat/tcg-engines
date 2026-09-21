import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { grindingGearsBlue } from "../actions/grinding-gears.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { throttleRed } from "../actions/throttle.ts";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { flashBoltBlue, flashBoltYellow } from "../instants/flash-bolt.ts";
import { misfireDampener } from "./misfire-dampener.ts";

const padding = () => Array.from({ length: 6 }, () => nimblismBlue);

/**
 * Misfire Dampener (HNT250) — Mechanologist Equipment - Arms, d1.
 *
 * Printed Instant — Destroy this: prevent the next 1 arcane damage this turn;
 * after a boost this turn, instead prevent the next 2. Blade Break.
 * CR 6.4.10j makes “prevent the next” a shielding prevention whose unused
 * amount carries across qualifying damage events until exhausted.
 */
describe("Misfire Dampener (HNT250) AAA", () => {
  it("base: destroys itself in response and shields 1 from a 2-arcane event", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [flashBoltYellow],
        resourcePoints: 2,
        deck: padding(),
      },
      {
        hero: dash,
        life: 20,
        arms: [misfireDampener],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(flashBoltYellow, { target: Dash.id });
    Oscilio.pass();
    Dash.activate(misfireDampener);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, misfireDampener).toBeIn("graveyard");
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveResourceCount(0).toHaveHandCount(0);
    expectWait(game).toBeIdle();
  });

  it("boosted: shields exactly 2 across separate 1- and 2-arcane events", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: 20,
        hand: [throttleRed],
        arms: [misfireDampener],
        resourcePoints: 2,
        actionPoints: 1,
        deck: padding(),
        deckTop: [grindingGearsBlue],
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
    const Dash = game.as(dash);
    const Oscilio = game.as(oscilio);

    Dash.playAttack(throttleRed, { boost: true });
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });
    Dash.activate(misfireDampener);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    Dash.pass();
    Oscilio.play(flashBoltBlue, { target: Dash.id });
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    expectFabPlayer(Dash).toHaveLife(20);

    Dash.pass();
    Oscilio.play(flashBoltYellow, { target: Dash.id });
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, grindingGearsBlue).toBeBanished();
    expectFabCard(Dash, misfireDampener).toBeIn("graveyard");
    expectFabPlayer(Oscilio).toHaveLife(14).toHaveResourceCount(0).toHaveHandCount(0);
    expectWait(game).toBeIdle();
  });

  it("timing: an unused shield expires at the end of the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: 20,
        arms: [misfireDampener],
        deck: padding(),
      },
      {
        hero: oscilio,
        hand: [flashBoltYellow, nimblismBlue],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oscilio = game.as(oscilio);

    Dash.activate(misfireDampener);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    Dash.endTurn();
    Oscilio.must.pitch(nimblismBlue).play(flashBoltYellow, { target: Dash.id });
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, misfireDampener).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("timing: a boost from the prior turn does not upgrade the shield", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: 20,
        hand: [throttleRed],
        arms: [misfireDampener],
        resourcePoints: 2,
        actionPoints: 1,
        deck: padding(),
        deckTop: [grindingGearsBlue],
      },
      {
        hero: oscilio,
        life: 20,
        hand: [flashBoltYellow, nimblismBlue],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oscilio = game.as(oscilio);

    Dash.playAttack(throttleRed, { boost: true });
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });
    Dash.endTurn();
    Oscilio.must.pitch(nimblismBlue).play(flashBoltYellow, { target: Dash.id });
    Oscilio.pass();
    Dash.activate(misfireDampener);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, misfireDampener).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("restriction: the shield does not prevent physical attack damage", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [snatchRed],
        actionPoints: 1,
        deck: padding(),
      },
      {
        hero: dash,
        life: 20,
        arms: [misfireDampener],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.pass();
    Dash.activate(misfireDampener);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    Oscilio.playAttack(snatchRed);
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, misfireDampener).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("Blade Break: d1 defends once, then the chain close destroys it", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [snatchRed],
        actionPoints: 1,
        deck: padding(),
      },
      {
        hero: dash,
        life: 20,
        arms: [misfireDampener],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.playAttack(snatchRed);
    Dash.defendWith(misfireDampener);
    game.closeCombat({ optionals: "throw", entityTargets: "throw" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, misfireDampener).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });
});
