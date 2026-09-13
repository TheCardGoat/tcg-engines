import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { silver } from "../tokens/silver.ts";
import { gravenVestment } from "./graven-vestment.ts";

describe("Graven Vestment (PEN138) AAA", () => {
  it("happy: at the start of your turn, destroy 2 Silver and equip this from GY with no −1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      {
        hero: arakni,
        graveyard: [gravenVestment],
        arena: [silver, silver],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Arakni, gravenVestment).toBeIn("chest");
    expectFabCard(Arakni, gravenVestment).toHaveDefenseCounters(0);
    expect(Arakni.cardsIn("arena", silver)).toHaveLength(0);
  });

  it("boundary: fewer than two Silver cannot equip this from the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      {
        hero: arakni,
        graveyard: [gravenVestment],
        arena: [silver],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(game.as(arakni), gravenVestment).toBeIn("graveyard");
  });

  it("timing: seating from anywhere but the GY puts a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: arakni, chest: [gravenVestment], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.untilIdle();
    expectFabCard(game.as(arakni), gravenVestment).toBeIn("chest");
    expectFabCard(game.as(arakni), gravenVestment).toHaveDefenseCounters(-1);
  });
});
