import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { headJabRed } from "./head-jab.ts";
import { hypothermiaBlue } from "./hypothermia.ts";

describe("Hypothermia (UPR139) AAA", () => {
  it("happy: the afflicted hero's go-again attack does not refund AP", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [hypothermiaBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [headJabRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(hypothermiaBlue);
    game.untilIdle();
    expect(Dash.zone("arena")).toContain(hypothermiaBlue.canonicalId);
    Bravo.endTurn();

    Dash.playAttack(headJabRed, { stopAt: "defend" });
    // Pin: printed go again is not stripped by restrict/gain-keyword.
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: the controller's attacks are not restricted by the affliction", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hypothermiaBlue, headJabRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(hypothermiaBlue);
    game.untilIdle();
    Bravo.playAttack(headJabRed, { stopAt: "defend" });
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("timing: the affliction self-destroys at the afflicted hero's end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [hypothermiaBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(hypothermiaBlue);
    game.untilIdle();
    expect(Dash.zone("arena")).toContain(hypothermiaBlue.canonicalId);
    Bravo.endTurn();
    Dash.endTurn();
    game.untilIdle();
    expectFabCard(Dash, hypothermiaBlue).toBeIn("graveyard");
  });
});
