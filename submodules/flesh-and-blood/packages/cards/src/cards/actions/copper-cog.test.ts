import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { copperCogBlue } from "./copper-cog.ts";

describe("Copper Cog (SEA021) AAA", () => {
  it("happy: this stays in the arena at the start of your turn if you remove a steam counter", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: copperCogBlue, state: { steamCounters: 2 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Teklo, copperCogBlue).toBeIn("arena");
  });

  it("boundary: declining the steam removal destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: copperCogBlue, state: { steamCounters: 2 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Teklo, copperCogBlue).toBeIn("graveyard");
  });

  it("timing: the start-of-turn unless does not fire on the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: copperCogBlue, state: { steamCounters: 2 } }],
        hand: [],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();

    expectFabCard(Teklo, copperCogBlue).toBeIn("arena");
  });
});
