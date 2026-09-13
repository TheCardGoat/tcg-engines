import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { ankaDragUnderYellow } from "../actions/anka-drag-under.ts";
import { jitteryBonesBlue } from "../actions/jittery-bones.ts";
import { compassOfSunkenDepths } from "../equipment/compass-of-sunken-depths.ts";
import { gold } from "../tokens/gold.ts";
import { gravyBones } from "./gravy-bones.ts";

/** Gravy Bones (AGB002) public acceptance tests with Compass of Sunken Depths (AGB003). */

const opponentHero = dash;

describe("gravy-bones + compass-of-sunken-depths AAA", () => {
  it("loots a blue card, then uses the graveyard permission and Compass in the same turn", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        weapon2: [compassOfSunkenDepths],
        arena: [gold],
        hand: [jitteryBonesBlue],
        graveyard: [ankaDragUnderYellow],
        deck: [jitteryBonesBlue],
        resourcePoints: 2,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Gravy = game.as(gravyBones);
    const [blueCard] = Gravy.cardsIn("hand", jitteryBonesBlue);
    expect(blueCard).toBeDefined();

    // Arrange is complete: Gold is a legal cost, and Anka is already in the
    // graveyard. Act: loot, explicitly discarding the blue card this turn.
    Gravy.activate(gravyBones);
    game.advanceToDecision(Gravy, "entity-target");
    Gravy.chooseTargets(blueCard!);

    expectFabCard(Gravy, gravyBones).toBeTapped();
    expectFabCard(Gravy, blueCard!).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveHandCount(1);

    // The blue discard enables Gravy Bones to play Anka from graveyard.
    game.helpers.passPriorityTo(Gravy);
    Gravy.play(ankaDragUnderYellow, { from: "graveyard" });
    game.passBoth();

    expectFabCard(Gravy, ankaDragUnderYellow).toBeIn("arena");
    // Compass: first watery-grave card played from graveyard this turn gets go again.
    expectFabPlayer(Gravy).toHaveAP(1);

    // Compass's printed instant remains legal after the hero sequence.
    Gravy.activate(compassOfSunkenDepths);
    game.passBoth();
    expectFabCard(Gravy, compassOfSunkenDepths).toBeTapped();
  });

  it("rejects Gravy Bones' loot activation without a Gold to destroy", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, weapon2: [compassOfSunkenDepths], deck: 6 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(gravyBones).expectActivationRejected(gravyBones);
  });
});
