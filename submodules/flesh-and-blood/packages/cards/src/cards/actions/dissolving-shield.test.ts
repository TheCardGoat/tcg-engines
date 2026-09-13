import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { snatchRed } from "./snatch.ts";
import { dissolvingShieldRed } from "./dissolving-shield.ts";

describe("Dissolving Shield: RED (EVO087) AAA", () => {
  it("happy: Instant prevent 1 of the next damage this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: teklovossen,
        arena: [{ card: dissolvingShieldRed, state: { steamCounters: 3 } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Teklo = game.as(teklovossen);

    Bravo.playAttack(snatchRed, { stopAt: "defend" });
    Teklo.defendWith();
    Bravo.pass();
    Teklo.activate(dissolvingShieldRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Teklo).toHaveLife(17);
    expectFabCard(Teklo, dissolvingShieldRed).toBeIn("arena");
  });

  it("boundary: last steam counter destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: dissolvingShieldRed, state: { steamCounters: 1 } }],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(dissolvingShieldRed);
    game.untilIdle();

    expectFabCard(Teklo, dissolvingShieldRed).toBeIn("graveyard");
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: dissolvingShieldRed, state: { steamCounters: 3 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, dissolvingShieldRed).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, dissolvingShieldRed).toBeIn("arena");
  });
});
