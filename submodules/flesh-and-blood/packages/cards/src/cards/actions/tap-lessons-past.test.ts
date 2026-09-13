import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { tapLessonsPastRed } from "./tap-lessons-past.ts";

/**
 * Tap Lessons Past (OMN124) — Lightning Wizard Action, cost 1, 4 arcane.
 * If this deals damage, you may tap your hero; if you do, put an instant from GY to bottom.
 */

describe("Tap Lessons Past (OMN124) AAA", () => {
  it("happy: deals 4 arcane; declining the tap leaves the hero ready", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [tapLessonsPastRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(tapLessonsPastRed, { targetInstanceId: Dash.ref(dash).instanceId });
    game.passBoth();
    Blaze.decline();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, blazeFiremind).toBeReady();
    expectFabCard(Blaze, tapLessonsPastRed).toBeIn("graveyard");
  });

  it("boundary: unpayable cost keeps the card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [tapLessonsPastRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    expectFabUnplayable(() =>
      Blaze.play(tapLessonsPastRed, { targetInstanceId: Dash.ref(dash).instanceId }),
    );
    expectFabCard(Blaze, tapLessonsPastRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: accepting the tap puts an instant from GY on the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [tapLessonsPastRed],
        graveyard: [lightningPressRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(tapLessonsPastRed, { targetInstanceId: Dash.ref(dash).instanceId });
    game.passBoth();
    Blaze.accept();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, blazeFiremind).toBeTapped();
    expect(Blaze.zone("graveyard")).toHaveLength(1);
    expectFabCard(Blaze, tapLessonsPastRed).toBeIn("graveyard");
  });
});
