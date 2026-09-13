import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { volticBoltBlue } from "../actions/voltic-bolt.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { volticBoltYellow } from "../actions/voltic-bolt.ts";
import { blinkBlue } from "./blink.ts";
import { flashBoltRed } from "./flash-bolt.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import {
  chromaticRefinementBlue,
  chromaticRefinementRed,
  chromaticRefinementYellow,
} from "./chromatic-refinement.ts";

const variants = [
  {
    label: "Chromatic Refinement Red (OMN193)",
    card: chromaticRefinementRed,
    matching: volticBoltRed,
    other: blinkBlue,
    timingOther: blinkBlue,
    expectedLifeAfterMatching: 14,
    boundaryPitch: undefined,
    boundaryResourcePoints: undefined,
    boundaryExpectedResourceCount: undefined,
    boundaryExpectedLife: undefined,
    timingActionPoints: undefined,
    expectedLifeAfterTiming: undefined,
  },
  {
    label: "Chromatic Refinement Yellow (OMN194)",
    card: chromaticRefinementYellow,
    matching: volticBoltYellow,
    other: blinkBlue,
    timingOther: blinkBlue,
    expectedLifeAfterMatching: 15,
    boundaryPitch: undefined,
    boundaryResourcePoints: undefined,
    boundaryExpectedResourceCount: undefined,
    boundaryExpectedLife: undefined,
    timingActionPoints: undefined,
    expectedLifeAfterTiming: undefined,
  },
  {
    label: "Chromatic Refinement Blue (OMN195)",
    card: chromaticRefinementBlue,
    matching: volticBoltBlue,
    other: volticBoltRed,
    timingOther: flashBoltRed,
    boundaryPitch: nimblismBlue,
    boundaryResourcePoints: 0,
    boundaryExpectedResourceCount: 1,
    boundaryExpectedLife: 15,
    expectedLifeAfterMatching: 16,
    timingActionPoints: 2,
    expectedLifeAfterTiming: 13,
  },
] as const;

describe.each(variants)(
  "$label family behavior AAA",
  ({
    card,
    matching,
    other,
    timingOther,
    expectedLifeAfterMatching,
    boundaryPitch,
    boundaryResourcePoints,
    boundaryExpectedResourceCount,
    boundaryExpectedLife,
    timingActionPoints,
    expectedLifeAfterTiming,
  }) => {
    it("happy: the next matching-color card costs one less and deals one extra damage", () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          hand: [card, matching, nimblismBlue],
          actionPoints: 1,
          deck: 6,
        },
        { hero: dash, life: 20, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Dash = game.as(dash);

      Oscilio.play(card);
      game.passBoth();
      Oscilio.endTurn();
      Dash.endTurn();
      game.untilIdle();

      expectFabCard(Oscilio, card).toBeIn("graveyard");
      Oscilio.play(matching, { target: Dash.id, pitch: [nimblismBlue] });
      game.passBoth();

      expectFabPlayer(Dash).toHaveLife(expectedLifeAfterMatching);
    });

    it("boundary: a nonmatching-color card does not receive the cost reduction", () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          hand: boundaryPitch ? [card, other, boundaryPitch] : [card, other],
          actionPoints: 1,
          resourcePoints: boundaryResourcePoints,
          deck: 6,
        },
        { hero: dash, life: 20, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Dash = game.as(dash);

      Oscilio.play(card);
      game.passBoth();
      Oscilio.endTurn();
      game.as(dash).endTurn();
      game.untilIdle();
      if (boundaryPitch) {
        Oscilio.play(other, { target: Dash.id, pitch: [boundaryPitch] });
      } else {
        Oscilio.play(other);
      }
      game.passBoth();

      if (boundaryExpectedResourceCount !== undefined) {
        expectFabPlayer(Oscilio).toHaveResourceCount(boundaryExpectedResourceCount);
      } else {
        expectFabPlayer(Oscilio).toHaveAP(2);
      }
      if (boundaryExpectedLife !== undefined) {
        expectFabPlayer(Dash).toHaveLife(boundaryExpectedLife);
      }
    });

    it("timing: the one-damage replacement is limited to the matching card", () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          hand: [card, matching, timingOther, nimblismBlue],
          actionPoints: timingActionPoints ?? 1,
          deck: 6,
        },
        { hero: dash, life: 20, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Dash = game.as(dash);

      Oscilio.play(card);
      game.passBoth();
      Oscilio.endTurn();
      Dash.endTurn();
      game.untilIdle();
      Oscilio.play(matching, { target: Dash.id, pitch: [nimblismBlue] });
      game.passBoth();
      expectFabPlayer(Dash).toHaveLife(expectedLifeAfterMatching);

      Oscilio.play(timingOther, timingOther === flashBoltRed ? { target: Dash.id } : undefined);
      game.passBoth();
      expectFabPlayer(Dash).toHaveLife(expectedLifeAfterTiming ?? expectedLifeAfterMatching);
    });
  },
);
