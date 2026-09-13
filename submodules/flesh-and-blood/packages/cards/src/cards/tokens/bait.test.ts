import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bait } from "./bait.ts";

/**
 * Bait (FAB393) — Ranger Token - Aura, created under an opponent's control
 * by Take the Bait (SUP258).
 * Printed: "You can't play or activate cards you own. Action - Destroy this
 * when the chain link resolves: Attack. Once per Turn Attack Reaction - 0:
 * This gets +1{p} and go again."
 */
describe("Bait (FAB393) AAA", () => {
  it("happy: the Bait controller cannot play their own cards while it is in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [bait],
        hand: [brutalAssaultBlue],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabUnplayable(() => Dash.play(brutalAssaultBlue), /rules effect restricts/);
    expectFabCard(Dash, bait).toBeIn("arena");
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("hand");
  });

  it("happy: the opposing hero can still play while Bait is under the other hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [bait],
        hand: [brutalAssaultBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    expectCombat(game).toBeOpen();
  });

  it("happy: the Bait controller can still attack with Bait", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [bait],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activateAttack(bait);
    expectCombat(game).toBeOpen();
    game.closeCombat();
    expectFabPlayer(Dash).toHaveTokenCount("bait", 0);
  });

  it("happy: its attack reaction gives the Bait attack +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [bait],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activateAttack(bait);
    game.toReaction("attacker");
    Dash.activate(bait);
    Dash.pass();
    game.as(bravo).pass();

    expectCombat(game).toHaveAttackPower(1);
    expectCombat(game).toHaveKeyword("go-again");
    Dash.expectActivationRejected(bait, "activation_limit");
  });

  it("boundary: without Bait in the arena the same play goes through", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(brutalAssaultBlue);
    game.as(bravo).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
  });
});
