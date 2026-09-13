import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { ankaDragUnderYellow } from "../actions/anka-drag-under.ts";
import { jitteryBonesBlue } from "../actions/jittery-bones.ts";
import { gold } from "../tokens/gold.ts";
import { compassOfSunkenDepths } from "./compass-of-sunken-depths.ts";

describe("Compass of Sunken Depths (AGB003) AAA", () => {
  it("happy: first watery-grave card played from graveyard this turn gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        weapon2: [compassOfSunkenDepths],
        arena: [gold],
        hand: [jitteryBonesBlue],
        graveyard: [ankaDragUnderYellow],
        deck: [jitteryBonesBlue],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const [blueCard] = Gravy.cardsIn("hand", jitteryBonesBlue);

    Gravy.activate(gravyBones);
    game.advanceToDecision(Gravy, "entity-target");
    Gravy.chooseTargets(blueCard!);
    game.helpers.passPriorityTo(Gravy);

    Gravy.play(ankaDragUnderYellow, { from: "graveyard" });
    game.passBoth();

    expectFabCard(Gravy, ankaDragUnderYellow).toBeIn("arena");
    expectFabPlayer(Gravy).toHaveAP(1);
  });

  it("boundary: Instant {t} looks at the top card and taps the off-hand", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        weapon2: [compassOfSunkenDepths],
        deck: [jitteryBonesBlue, jitteryBonesBlue, jitteryBonesBlue, jitteryBonesBlue],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(compassOfSunkenDepths);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Gravy, compassOfSunkenDepths).toBeTapped();
    expectFabCard(Gravy, compassOfSunkenDepths).toBeIn("weapon2");
    expect(Gravy.zone("deck").at(-1)).toBe(jitteryBonesBlue.canonicalId);
  });
});
