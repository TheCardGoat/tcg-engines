import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { burnishedBunkerplate } from "./burnished-bunkerplate.ts";

describe("Burnished Bunkerplate (PEN316) AAA", () => {
  it("happy: Defense Reaction destroy this may add an arsenal Action as a defender", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        chest: [burnishedBunkerplate],
        arsenal: [nimblismBlue],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    Bravo.activate(burnishedBunkerplate);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, burnishedBunkerplate).toBeIn("graveyard");
    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: declining the optional keeps the arsenal Action", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        chest: [burnishedBunkerplate],
        arsenal: [nimblismBlue],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    Bravo.activate(burnishedBunkerplate);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, burnishedBunkerplate).toBeIn("graveyard");
    expectFabCard(Bravo, nimblismBlue).toBeIn("arsenal");
  });

  it("timing: Defense Reaction is illegal before combat", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [burnishedBunkerplate],
        arsenal: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).expectActivationRejected(burnishedBunkerplate);
    expectFabCard(game.as(bravo), burnishedBunkerplate).toBeIn("chest");
  });
});
