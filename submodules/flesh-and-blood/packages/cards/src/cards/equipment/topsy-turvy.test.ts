import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { memorialGroundRed } from "../instants/memorial-ground.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { topsyTurvy } from "./topsy-turvy.ts";

describe("Topsy Turvy (PEN276) AAA", () => {
  it("happy: destroy this so a put-on-top instead goes to the bottom", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [topsyTurvy],
        hand: [memorialGroundRed],
        graveyard: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(topsyTurvy);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, topsyTurvy).toBeIn("graveyard");

    Bravo.must.playInstant(memorialGroundRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    const deck = Bravo.zone("deck");
    expect(deck[0]).toBe(snatchRed.canonicalId);
    expect(deck[deck.length - 1]).not.toBe(snatchRed.canonicalId);
  });

  it("boundary: without Topsy, Memorial Ground puts the card on top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [memorialGroundRed],
        graveyard: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playInstant(memorialGroundRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    const deck = Bravo.zone("deck");
    expect(deck[deck.length - 1]).toBe(snatchRed.canonicalId);
  });

  it("timing: the Instant cannot be activated a second time after destroy", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [topsyTurvy], hand: [], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(topsyTurvy);
    game.helpers.resolveUntilIdle();
    Bravo.expectActivationRejected(topsyTurvy);
    expectFabCard(Bravo, topsyTurvy).toBeIn("graveyard");
  });
});
