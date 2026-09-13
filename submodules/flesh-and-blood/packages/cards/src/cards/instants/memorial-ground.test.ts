import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { nimbleStrikeRed } from "../actions/nimble-strike.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { woundedBullRed } from "../actions/wounded-bull.ts";
import { memorialGroundBlue, memorialGroundRed, memorialGroundYellow } from "./memorial-ground.ts";

const variants = [
  {
    label: "Memorial Ground Red (MON303)",
    card: memorialGroundRed,
    boundary: woundedBullRed,
    maxCost: 2,
  },
  {
    label: "Memorial Ground Yellow (MON304)",
    card: memorialGroundYellow,
    boundary: brutalAssaultBlue,
    maxCost: 1,
  },
  {
    label: "Memorial Ground Blue (MON305)",
    card: memorialGroundBlue,
    boundary: nimbleStrikeRed,
    maxCost: 0,
  },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, boundary, maxCost }) => {
  it(`happy: returns a cost-${maxCost}-or-less attack action to the top of the deck`, () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [card],
        graveyard: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(card, { targetInstanceId: Bravo.findCardInZone("graveyard", snatchRed) });

    const deck = Bravo.zone("deck");
    expect(deck[deck.length - 1]).toBe(snatchRed.canonicalId);
    expectFabCard(Bravo, card).toBeIn("graveyard");
  });

  it(`boundary: a cost-${maxCost + 1} attack action is not a legal target`, () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card], graveyard: [boundary], deck: 6, actionPoints: 1 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    expectFabUnplayable(() =>
      Bravo.play(card, { targetInstanceId: Bravo.findCardInZone("graveyard", boundary) }),
    );
    expectFabCard(Bravo, boundary).toBeIn("graveyard");
    expect(Bravo.zone("deck")).not.toContain(boundary.canonicalId);
  });

  it("timing: selecting one legal target leaves another copy in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [card],
        graveyard: [snatchRed, snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const firstSnatch = Bravo.cardsIn("graveyard", snatchRed)[0]!;

    Bravo.play(card, { targetInstanceId: firstSnatch.instanceId });

    const deck = Bravo.zone("deck");
    expect(deck[deck.length - 1]).toBe(snatchRed.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);
  });
});
