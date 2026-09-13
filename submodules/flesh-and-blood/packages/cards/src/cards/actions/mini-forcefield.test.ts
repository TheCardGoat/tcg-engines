import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { miniForcefieldRed } from "./mini-forcefield.ts";

describe("Mini Forcefield (EVO093) AAA", () => {
  it("happy: this has Ward while it has steam counters", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: miniForcefieldRed, state: { steamCounters: 4 } }],
        hand: [],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expectFabCard(Teklo, miniForcefieldRed).toBeIn("arena").toHaveKeyword("ward");
  });

  it("boundary: Ward is not present after this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: miniForcefieldRed, state: { steamCounters: 4 } }],
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

    expectFabCard(Teklo, miniForcefieldRed).toBeIn("graveyard");
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: miniForcefieldRed, state: { steamCounters: 4 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, miniForcefieldRed).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, miniForcefieldRed).toBeIn("arena").toHaveKeyword("ward");
  });
});
