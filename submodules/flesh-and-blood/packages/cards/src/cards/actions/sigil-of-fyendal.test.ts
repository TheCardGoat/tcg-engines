import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { sigilOfFyendalBlue } from "./sigil-of-fyendal.ts";

describe("Sigil of Fyendal (ROS230) AAA", () => {
  it("happy: leaving the arena at the next action phase gains 1{h}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sigilOfFyendalBlue], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(sigilOfFyendalBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, sigilOfFyendalBlue).toBeIn("arena");
    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, sigilOfFyendalBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(21);
  });

  it("boundary: only the controller gains the life", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sigilOfFyendalBlue], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(sigilOfFyendalBlue);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: go again refunds the play AP and this is not combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sigilOfFyendalBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(sigilOfFyendalBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
