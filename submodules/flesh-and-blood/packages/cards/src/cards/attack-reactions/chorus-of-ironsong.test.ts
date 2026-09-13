import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { chorusOfIronsongYellow } from "./chorus-of-ironsong.ts";

/**
 * Chorus of Ironsong (DTD208) — Warrior Attack Reaction, Dorinthea Specialization.
 * Printed: Until end of turn, target Dawnblade gets +1{p} and "Damage this
 * would deal can't be prevented." Unity — When this defends together with a
 * card from hand, create a Courage token under any number of heroes' control.
 */

describe("Chorus of Ironsong (DTD208) AAA", () => {
  it("happy: Unity creates Courage when this defends together with a card from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dorinthea,
        hand: [chorusOfIronsongYellow, nimblismBlue],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dori = game.as(dorinthea);

    game.as(dash).playAttack(snatchRed);
    Dori.defendWith(chorusOfIronsongYellow, nimblismBlue);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Dori).toHaveTokenCount("courage", 1);
  });

  it("boundary: Unity does not fire when this defends alone", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dorinthea,
        hand: [chorusOfIronsongYellow],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dori = game.as(dorinthea);

    game.as(dash).playAttack(snatchRed);
    Dori.defendWith(chorusOfIronsongYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dori).toHaveTokenCount("courage", 0);
  });
});
