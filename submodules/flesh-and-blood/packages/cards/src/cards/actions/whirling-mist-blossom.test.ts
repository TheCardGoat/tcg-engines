import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { headJabYellow } from "./head-jab.ts";
import { snatchRed } from "./snatch.ts";
import { whirlingMistBlossomYellow } from "./whirling-mist-blossom.ts";

describe("Whirling Mist Blossom (IRA003) AAA", () => {
  it("happy: second consecutive hitting link draws 2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabYellow, whirlingMistBlossomYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(bravo);

    Ira.playAttack(headJabYellow);
    game.advanceCombatTo("resolution");
    Ira.playAttack(whirlingMistBlossomYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Ira).toHaveHandCount(2);
  });

  it("boundary: first-link hit does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [whirlingMistBlossomYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(bravo);

    Ira.playAttack(whirlingMistBlossomYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Ira).toHaveHandCount(0);
  });

  it("boundary: a miss on link 1 then a hit on link 2 does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabYellow, whirlingMistBlossomYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(bravo);

    Ira.playAttack(headJabYellow);
    game.as(dash).defendWith(snatchRed);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });
    Ira.playAttack(whirlingMistBlossomYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Ira).toHaveHandCount(0);
  });

  it("timing: printed go again refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [whirlingMistBlossomYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(bravo);

    Ira.playAttack(whirlingMistBlossomYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Ira).toHaveAP(1);
  });
});
