import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "./voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { sekemArchangelOfRavages } from "../allies/sekem-archangel-of-ravages.ts";
import { nimblismBlue } from "./nimblism.ts";
import { chorusOfTheAmphitheaterRed } from "./chorus-of-the-amphitheater.ts";

/**
 * Chorus of the Amphitheater (ROS170) — Wizard Action, red.
 *
 * Printed: Deal 4 arcane. Instant — Discard this: Amp 1 (if an action or
 * instant you control would deal arcane this turn, instead that much plus 1).
 *
 * Amp is the `amp` leaf (Photon Splicing), never a damage replacement whose
 * modification mutates power on self.
 */

describe("Chorus of the Amphitheater (ROS170) AAA", () => {
  it("happy: discarding this amps the next Wizard Action by 1", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [chorusOfTheAmphitheaterRed, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.activate(chorusOfTheAmphitheaterRed);
    game.untilIdle({ ordering: "listed" });
    Kano.play(volticBoltRed, { target: Dash.id });
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Kano, chorusOfTheAmphitheaterRed).toBeIn("graveyard");
  });

  it("boundary: without the Amp discard, Voltic Bolt deals printed 5", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(volticBoltRed, { target: Dash.id });
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("timing: Amp does not raise an opposing Instant copy still in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [chorusOfTheAmphitheaterRed, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [chorusOfTheAmphitheaterRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.activate(chorusOfTheAmphitheaterRed);
    game.untilIdle({ ordering: "listed" });
    Kano.play(volticBoltRed, { target: Dash.id });
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, chorusOfTheAmphitheaterRed).toBeIn("hand");
  });

  it("boundary: ally arcane damage neither gains nor consumes Amp", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        arena: [sekemArchangelOfRavages],
        soul: [nimblismBlue],
        hand: [chorusOfTheAmphitheaterRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.activate(chorusOfTheAmphitheaterRed);
    game.untilIdle({ ordering: "listed" });
    Kano.activateAttack(sekemArchangelOfRavages, { stopAt: "on-attack" });
    Kano.targetRequired(Dash);
    game.advanceToDecision(Kano, "boolean");
    Kano.accept();
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(18);
    game.closeCombat({ optionals: "decline" });

    Kano.play(volticBoltRed, { target: Dash.id });
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(8); // 2 ally arcane + 4 physical + 6 amped Action arcane
  });
});
