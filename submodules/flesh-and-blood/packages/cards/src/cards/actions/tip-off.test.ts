import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { tipOffRed } from "./tip-off.ts";

describe("Tip Off (HNT232) AAA", () => {
  it("happy: Instant — Discard this marks the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tipOffRed], actionPoints: 0, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(tipOffRed);
    game.untilIdle();

    expectFabCard(Bravo, tipOffRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toBeMarked();
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("boundary: playing it as an attack does not mark", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tipOffRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(tipOffRed);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("timing: the discard ability can mark on the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [tipOffRed], actionPoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.pass();
    Bravo.activate(tipOffRed);
    game.untilIdle();

    expectFabCard(Bravo, tipOffRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toBeMarked();
  });
});
