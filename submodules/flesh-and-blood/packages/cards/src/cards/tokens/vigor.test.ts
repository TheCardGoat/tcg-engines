import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimbleStrikeRed } from "../actions/nimble-strike.ts";
import { vigor } from "./vigor.ts";

describe("Vigor (TCC107) AAA", () => {
  it("happy: at the start of your turn this is destroyed and you gain 1{r}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [vigor],
        hand: [nimbleStrikeRed],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, vigor).toBeIn("arena");
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).not.toContain(vigor.canonicalId);
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });

  it("boundary: the gained {r} can pay a 1-cost attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [vigor],
        hand: [nimbleStrikeRed],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(nimbleStrikeRed);

    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expect(game.combat()?.open).toBe(true);
  });

  it("timing: Vigor does not grant {r} on the opponent's start of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [vigor],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, vigor).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });
});
