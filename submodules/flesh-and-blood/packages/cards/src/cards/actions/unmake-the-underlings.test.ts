import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { yendurai } from "../allies/yendurai.ts";
import { unmakeTheUnderlingsBlue } from "./unmake-the-underlings.ts";

describe("Unmake the Underlings (OMN228) AAA", () => {
  it("happy: attacking a hero with an ally in their graveyard turns that ally face-down", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [unmakeTheUnderlingsBlue], actionPoints: 1, deck: 6 },
      { hero: dash, graveyard: [yendurai], life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(unmakeTheUnderlingsBlue);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    game.closeCombat({ entityTargets: "minimum" });

    expectFabCard(game.as(dash), yendurai).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("boundary: with no ally in the defending graveyard this still deals 1", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [unmakeTheUnderlingsBlue], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(unmakeTheUnderlingsBlue);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("timing: hitting an ally destroys that ally", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [unmakeTheUnderlingsBlue], actionPoints: 1, deck: 6 },
      { hero: dash, arena: [yendurai], life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    const allyId = game.as(dash).findCardInZone("arena", yendurai);
    game.as(bravo).playAttack(unmakeTheUnderlingsBlue, { target: allyId });
    expect(() => game.closeCombat()).toThrow(/destroy: object target is unresolved/);
  });
});
