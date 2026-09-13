import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { silver } from "../tokens/silver.ts";
import { gravenCowl } from "./graven-cowl.ts";

describe("Graven Cowl (PEN137) AAA", () => {
  it("happy: at the start of your turn, destroy 2 Silver and equip this from GY with no −1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      {
        hero: arakni,
        graveyard: [gravenCowl],
        arena: [silver, silver],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Arakni, gravenCowl).toBeIn("head");
    expectFabCard(Arakni, gravenCowl).toHaveDefenseCounters(0);
    expect(Arakni.cardsIn("arena", silver)).toHaveLength(0);
  });

  it("boundary: fewer than two Silver cannot equip this from the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      {
        hero: arakni,
        graveyard: [gravenCowl],
        arena: [silver],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(game.as(arakni), gravenCowl).toBeIn("graveyard");
  });

  it("timing: seating from anywhere but the GY puts a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: arakni, head: [gravenCowl], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.untilIdle();
    expectFabCard(game.as(arakni), gravenCowl).toBeIn("head");
    expectFabCard(game.as(arakni), gravenCowl).toHaveDefenseCounters(-1);
  });
});
