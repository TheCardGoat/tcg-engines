import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { rendFleshBlue } from "./rend-flesh.ts";

/**
 * Rend Flesh (PEN050) — Warrior Action.
 *
 * Printed delayed effect: whenever a sword you control hits a hero this turn,
 * you may remove a +1{p} counter from that sword; if you do, they lose 2 life.
 */

describe("Rend Flesh (PEN050) AAA", () => {
  it("happy: removes the counter from the hitting sword and causes 2 life loss", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [{ card: zenithBlade, state: { powerCounterTotal: 1 } }],
        hand: [rendFleshBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(rendFleshBlue);
    game.helpers.resolveUntilIdle();
    Hala.activate(zenithBlade);
    game.closeCombat({ ordering: "listed", optionals: "accept" });

    expectFabCard(Hala, zenithBlade).toHaveCounters(0);
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: without a +1 power counter, only combat damage is dealt", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [rendFleshBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(rendFleshBlue);
    game.helpers.resolveUntilIdle();
    Hala.activate(zenithBlade);
    game.closeCombat({ ordering: "listed", optionals: "accept" });

    expectFabCard(Hala, zenithBlade).toHaveCounters(0);
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("timing: it can trigger for every qualifying sword hit that turn", () => {
    const sharpenedSaber = { card: cintariSaber, state: { powerCounterTotal: 1 } } as const;
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [sharpenedSaber],
        weapon2: [sharpenedSaber],
        hand: [rendFleshBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(rendFleshBlue);
    game.helpers.resolveUntilIdle();
    Hala.activate(cintariSaber, { index: 0 });
    game.closeCombat({ ordering: "listed", optionals: "accept" });
    Hala.activate(cintariSaber, { index: 1 });
    game.closeCombat({ ordering: "listed", optionals: "accept" });

    expectFabPlayer(Dash).toHaveLife(10);
  });
});
