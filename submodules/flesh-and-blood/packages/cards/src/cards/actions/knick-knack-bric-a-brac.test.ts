import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { potionOfSeeingBlue } from "./potion-of-seeing.ts";
import { knickKnackBricABracRed } from "./knick-knack-bric-a-brac.ts";

describe("Knick Knack Bric-a-brac (EVR159) AAA", () => {
  it("happy: destroying 1 Gold repeats the search once more", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [fabToken("gold")],
        hand: [knickKnackBricABracRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [snatchRed, potionOfSeeingBlue, potionOfSeeingBlue],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.playInstance(Dash.id, Dash.findCardInZone("hand", knickKnackBricABracRed), {}, "explicit");
    Dash.accept();
    Dash.target(fabToken("gold"));
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: potionOfSeeingBlue.canonicalId,
    });

    expectFabCard(Dash, knickKnackBricABracRed).toBeIn("graveyard");
    expect(Dash.zone("arena").filter((id) => id === potionOfSeeingBlue.canonicalId)).toHaveLength(
      2,
    );
  });

  it("boundary: destroying 3 Copper does not pay a 4-Copper unit, so the search happens once", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [fabToken("copper"), fabToken("copper"), fabToken("copper")],
        hand: [knickKnackBricABracRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [snatchRed, potionOfSeeingBlue, potionOfSeeingBlue],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.playInstance(Dash.id, Dash.findCardInZone("hand", knickKnackBricABracRed), {}, "explicit");
    Dash.accept();
    Dash.target(...Dash.cardsIn("arena", fabToken("copper")));
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: potionOfSeeingBlue.canonicalId,
    });

    expect(Dash.zone("arena").filter((id) => id === potionOfSeeingBlue.canonicalId)).toHaveLength(
      1,
    );
    expect(Dash.zone("deck")).toContain(potionOfSeeingBlue.canonicalId);
  });

  it("timing: declining the metal-token cost still searches once and leaves the Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [fabToken("gold")],
        hand: [knickKnackBricABracRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [snatchRed, potionOfSeeingBlue],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.playInstance(Dash.id, Dash.findCardInZone("hand", knickKnackBricABracRed), {}, "explicit");
    Dash.decline();
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: potionOfSeeingBlue.canonicalId,
    });

    expectFabCard(Dash, potionOfSeeingBlue).toBeIn("arena");
    expectFabPlayer(Dash).toHaveTokenCount("gold", 1);
  });
});
