import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { nastySurpriseBlue } from "./nasty-surprise.ts";

describe("Nasty Surprise (HVY207) AAA", () => {
  it("happy: an opponent's effect putting this into the graveyard creates Agility, Might, and Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [commandAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: briar,
        arsenal: [nastySurpriseBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    game.as(dash).attackWith(commandAndConquerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabCard(Briar, nastySurpriseBlue).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveTokenCount("agility", 1);
    expectFabPlayer(Briar).toHaveTokenCount("might", 1);
    expectFabPlayer(Briar).toHaveTokenCount("vigor", 1);
  });

  it("boundary: playing this yourself does not create Agility, Might, or Vigor", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [nastySurpriseBlue], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(nastySurpriseBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Briar, nastySurpriseBlue).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveTokenCount("agility", 0);
    expectFabPlayer(Briar).toHaveTokenCount("might", 0);
    expectFabPlayer(Briar).toHaveTokenCount("vigor", 0);
  });

  it("timing: defending with this does not create the tokens (combat close is not an opponent effect)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [commandAndConquerRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: briar, hand: [nastySurpriseBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    game.as(dash).attackWith(commandAndConquerRed);
    Briar.defendWith(nastySurpriseBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Briar, nastySurpriseBlue).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveTokenCount("agility", 0);
    expectFabPlayer(Briar).toHaveTokenCount("might", 0);
    expectFabPlayer(Briar).toHaveTokenCount("vigor", 0);
  });
});
