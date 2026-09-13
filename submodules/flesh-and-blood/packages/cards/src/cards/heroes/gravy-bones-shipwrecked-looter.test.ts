import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { gold } from "../tokens/gold.ts";
import { ankaDragUnderYellow } from "../actions/anka-drag-under.ts";
import { jitteryBonesBlue } from "../actions/jittery-bones.ts";
import { gravyBonesShipwreckedLooter } from "./gravy-bones-shipwrecked-looter.ts";

describe("Gravy Bones, Shipwrecked Looter (AGB001) AAA", () => {
  it("happy: loot draws then discards, and a blue graveyard card enables watery grave from the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBonesShipwreckedLooter,
        arena: [gold],
        hand: [jitteryBonesBlue],
        graveyard: [ankaDragUnderYellow],
        deck: [jitteryBonesBlue],
        resourcePoints: 2,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBonesShipwreckedLooter);
    const [blueCard] = Gravy.cardsIn("hand", jitteryBonesBlue);

    Gravy.activate(gravyBonesShipwreckedLooter);
    game.advanceToDecision(Gravy, "entity-target");
    Gravy.chooseTargets(blueCard!);

    expectFabCard(Gravy, gravyBonesShipwreckedLooter).toBeTapped();
    expectFabCard(Gravy, blueCard!).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveHandCount(1);

    game.helpers.passPriorityTo(Gravy);
    Gravy.play(ankaDragUnderYellow, { from: "graveyard" });
    game.passBoth();

    expectFabCard(Gravy, ankaDragUnderYellow).toBeIn("arena");
  });

  it("boundary: loot is rejected without a Gold, and watery grave stays illegal without a blue graveyard card this turn", () => {
    const noGold = FabTestEngine.start(
      { hero: gravyBonesShipwreckedLooter, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    noGold.as(gravyBonesShipwreckedLooter).expectActivationRejected(gravyBonesShipwreckedLooter);

    const noBlue = FabTestEngine.start(
      {
        hero: gravyBonesShipwreckedLooter,
        graveyard: [ankaDragUnderYellow],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expect(() =>
      noBlue.as(gravyBonesShipwreckedLooter).play(ankaDragUnderYellow, { from: "graveyard" }),
    ).toThrow();
  });

  it("timing: watery-grave graveyard play is illegal on the following turn", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBonesShipwreckedLooter,
        arena: [gold],
        hand: [jitteryBonesBlue],
        graveyard: [ankaDragUnderYellow],
        deck: [jitteryBonesBlue],
        resourcePoints: 2,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBonesShipwreckedLooter);
    const [blueCard] = Gravy.cardsIn("hand", jitteryBonesBlue);

    Gravy.activate(gravyBonesShipwreckedLooter);
    game.advanceToDecision(Gravy, "entity-target");
    Gravy.chooseTargets(blueCard!);
    game.helpers.passPriorityTo(Gravy);
    Gravy.endTurn();
    game.as(dash).endTurn();

    expect(() => Gravy.play(ankaDragUnderYellow, { from: "graveyard" })).toThrow();
  });
});
