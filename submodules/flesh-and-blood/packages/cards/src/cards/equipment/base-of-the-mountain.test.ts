import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { baseOfTheMountain } from "./base-of-the-mountain.ts";

describe("Base of the Mountain (MPG113) AAA", () => {
  it("happy: defending banishes action cards from hand and Blade Break destroys Base", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        legs: [baseOfTheMountain],
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(baseOfTheMountain);
    game.advanceToDecision(Dash, "entity-target");
    Dash.chooseTargets(...Dash.cardsIn("hand", nimblismBlue));
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, baseOfTheMountain).toBeIn("graveyard");
    expect(Dash.zone("hand")).toHaveLength(0);
    expect(Dash.zone("graveyard").filter((id) => id === nimblismBlue.canonicalId)).toHaveLength(2);
    expectFabCard(Dash, baseOfTheMountain).toHaveKeyword("blade-break");
  });

  it("happy: can banish exactly two action cards when more are in hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        legs: [baseOfTheMountain],
        hand: [nimblismBlue, nimblismBlue, heartOfFyendalBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(baseOfTheMountain);
    game.advanceToDecision(Dash, "entity-target");
    Dash.chooseTargets(...Dash.cardsIn("hand", nimblismBlue));
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("hand")).toEqual([heartOfFyendalBlue.canonicalId]);
    expect(
      [...Dash.zone("banished"), ...Dash.zone("graveyard")].filter(
        (id) => id === nimblismBlue.canonicalId,
      ),
    ).toHaveLength(2);
  });

  it("boundary: declining to defend leaves Base seated and takes the full 4", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        legs: [baseOfTheMountain],
        hand: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, baseOfTheMountain).toBeIn("legs");
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: empty-hand defend is a no-op for add-defending and still Blade Breaks", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        legs: [baseOfTheMountain],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(baseOfTheMountain);
    game.helpers.resolveUntilIdle();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, baseOfTheMountain).toBeIn("graveyard");
    expect(Dash.zone("banished")).toHaveLength(0);
    // No action cards defending → printed {d} is 0, Snatch deals 4.
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
