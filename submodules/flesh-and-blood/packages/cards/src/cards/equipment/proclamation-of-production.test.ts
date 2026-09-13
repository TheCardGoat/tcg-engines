import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { proclamationOfProduction } from "./proclamation-of-production.ts";

describe("Proclamation of Production (JDG019) AAA", () => {
  it("happy: Action destroys this from off-hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [proclamationOfProduction],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.activate(proclamationOfProduction);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabCard(Bravo, proclamationOfProduction).toBeIn("graveyard");
  });

  it("boundary: with 0 action points the Action is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [proclamationOfProduction],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).expectActivationRejected(proclamationOfProduction);
    expectFabCard(game.as(bravo), proclamationOfProduction).toBeIn("weapon2");
    expectFabPlayer(game.as(bravo)).toHaveAP(0);
  });
});
