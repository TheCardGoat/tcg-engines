import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { solitaryCompanionBlue } from "./solitary-companion.ts";
import { card10000YearReunionRed } from "./10-000-year-reunion.ts";

/**
 * 10,000 Year Reunion, Red (MST131) — Illusionist Action Aura.
 *
 * Printed: "You may remove three +1{p} counters from among auras you control
 * rather than pay 10,000 Year Reunion's {r} cost.\nWard 10" (cost 8, 3{d})
 */

describe("10,000 Year Reunion (MST131) AAA", () => {
  it("happy: removing three +1{p} counters pays the alternative cost", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arena: [{ card: solitaryCompanionBlue, state: { powerCounterTotal: 3 } }],
        hand: [card10000YearReunionRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(card10000YearReunionRed, { modeIds: ["pay"] });
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, card10000YearReunionRed).toBeIn("arena").toHaveKeyword("ward");
    expectFabCard(Enigma, solitaryCompanionBlue).toBeIn("arena");
  });

  it("boundary: declining the alternative cost requires the printed 8{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arena: [{ card: solitaryCompanionBlue, state: { powerCounterTotal: 3 } }],
        hand: [card10000YearReunionRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    expectFabUnplayable(
      () => Enigma.play(card10000YearReunionRed, { modeIds: ["decline"] }),
      /resource cost cannot be paid/,
    );
    expectFabCard(Enigma, card10000YearReunionRed).toBeIn("hand");
  });

  it("timing: paying the printed 8{r} still puts this into the arena with Ward 10", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [card10000YearReunionRed],
        resourcePoints: 8,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(card10000YearReunionRed);
    game.untilIdle();
    expectFabCard(Enigma, card10000YearReunionRed).toBeIn("arena").toHaveKeyword("ward");
  });
});
