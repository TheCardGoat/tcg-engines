import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { eloquence } from "./eloquence.ts";

describe("Eloquence (DTD233) AAA", () => {
  it("happy: playing a non-attack action destroys this and that card gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [eloquence],
        hand: [tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).not.toContain(eloquence.canonicalId);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: playing an attack action does not consume Eloquence", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [eloquence],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, eloquence).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("timing: Eloquence refunds the Action AP of the non-attack it consumed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [eloquence],
        hand: [tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabPlayer(Bravo).toHaveAP(1);
    Bravo.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, tomeOfFyendalYellow).toBeIn("graveyard");
  });
});
