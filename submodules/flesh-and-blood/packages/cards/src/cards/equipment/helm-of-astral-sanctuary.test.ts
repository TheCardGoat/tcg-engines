import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { helmOfAstralSanctuary } from "./helm-of-astral-sanctuary.ts";

describe("Helm of Astral Sanctuary (OMN209) AAA", () => {
  it("happy: tap the hero and destroy this to prevent the next 1 damage this turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [helmOfAstralSanctuary], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();
    Dash.activate(helmOfAstralSanctuary);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, helmOfAstralSanctuary).toBeIn("graveyard");
    expectFabCard(Dash, dash).toBeTapped();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: without activating, Snatch deals the full 4", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [helmOfAstralSanctuary], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, helmOfAstralSanctuary).toBeIn("head");
  });

  it("timing: prevention expires at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, head: [helmOfAstralSanctuary], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(helmOfAstralSanctuary);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.as(bravo).endTurn();
    Dash.endTurn();
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
  });
});
