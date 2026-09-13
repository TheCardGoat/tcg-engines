import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { hazeShelterBlue, hazeShelterRed, hazeShelterYellow } from "./haze-shelter.ts";

const variants = [
  { label: "Haze Shelter Red (ENG009)", card: hazeShelterRed },
  { label: "Haze Shelter Yellow (MST038)", card: hazeShelterYellow },
  { label: "Haze Shelter Blue (MST039)", card: hazeShelterBlue },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card }) => {
  it("happy: the aura enters the arena after pitching blue cards", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [card, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card, { pitch: [nimblismBlue, nimblismBlue] });
    game.untilIdle();

    expectFabCard(Bravo, card).toBeIn("arena").toHaveKeyword("ward");
  });

  it("boundary: without a blue in pitch the aura still has ward", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();

    expectFabCard(Bravo, card).toBeIn("arena").toHaveKeyword("ward");
  });

  it("timing: the aura remains in the arena through the turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.endTurn();

    expectFabCard(Bravo, card).toBeIn("arena").toHaveKeyword("ward");
  });
});
