import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { fai } from "../heroes/fai.ts";
import { sandSketchedPlanBlue } from "./sand-sketched-plan.ts";
import { snatchRed } from "./snatch.ts";
import { backAlleyBreaklineRed } from "./back-alley-breakline.ts";

describe("Back Alley Breakline family AAA", () => {
  it("happy: an action effect putting this face-up from deck grants 1 AP", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [sandSketchedPlanBlue],
        deck: [
          backAlleyBreaklineRed,
          backAlleyBreaklineRed,
          backAlleyBreaklineRed,
          backAlleyBreaklineRed,
          backAlleyBreaklineRed,
          backAlleyBreaklineRed,
        ],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    Rhinar.play(sandSketchedPlanBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: backAlleyBreaklineRed.canonicalId });
    expectFabCard(Rhinar, backAlleyBreaklineRed).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveAP(1);
  });
  it("boundary: drawing this from deck does not grant AP", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed],
        deck: [
          backAlleyBreaklineRed,
          backAlleyBreaklineRed,
          backAlleyBreaklineRed,
          backAlleyBreaklineRed,
          backAlleyBreaklineRed,
          backAlleyBreaklineRed,
        ],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Fai, backAlleyBreaklineRed).toBeIn("hand");
    expectFabPlayer(Fai).toHaveAP(0);
  });
  it("timing: an attack from hand does not refund AP", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [backAlleyBreaklineRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(backAlleyBreaklineRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveAP(0);
  });
});
