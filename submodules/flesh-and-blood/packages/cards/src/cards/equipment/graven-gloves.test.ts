import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { silver } from "../tokens/silver.ts";
import { gravenGloves } from "./graven-gloves.ts";

describe("Graven Gloves (PEN139) AAA", () => {
  it("happy: at the start of your turn, destroy 2 Silver and equip this from GY with no −1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      {
        hero: arakni,
        graveyard: [gravenGloves],
        arena: [silver, silver],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Arakni, gravenGloves).toBeIn("arms");
    expectFabCard(Arakni, gravenGloves).toHaveDefenseCounters(0);
    expect(Arakni.cardsIn("arena", silver)).toHaveLength(0);
  });

  it("boundary: fewer than two Silver cannot equip this from the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      {
        hero: arakni,
        graveyard: [gravenGloves],
        arena: [silver],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(game.as(arakni), gravenGloves).toBeIn("graveyard");
  });

  it("timing: seating from anywhere but the GY puts a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: arakni, arms: [gravenGloves], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.untilIdle();
    expectFabCard(game.as(arakni), gravenGloves).toBeIn("arms");
    expectFabCard(game.as(arakni), gravenGloves).toHaveDefenseCounters(-1);
  });
});
