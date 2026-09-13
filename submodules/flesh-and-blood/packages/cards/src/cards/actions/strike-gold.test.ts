import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { strikeGoldRed } from "./strike-gold.ts";

describe("Strike Gold (SEA229) AAA", () => {
  it("happy: hitting creates a Gold token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [strikeGoldRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(strikeGoldRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabToken(game, "gold").toHaveCount(1);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Bravo, strikeGoldRed).toBeIn("graveyard");
  });

  it("boundary: missing creates no Gold", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [strikeGoldRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(strikeGoldRed);
    Dash.defendWith(nimblismBlue, snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabToken(game, "gold").toHaveCount(0);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: Gold is created on hit, not on declaration", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [strikeGoldRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(strikeGoldRed);
    expectFabToken(game, "gold").toHaveCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabToken(game, "gold").toHaveCount(1);
  });
});
