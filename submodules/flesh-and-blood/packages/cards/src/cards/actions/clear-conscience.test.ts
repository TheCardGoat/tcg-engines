import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { clearConscienceRed } from "./clear-conscience.ts";

describe("Clear Conscience (OMN041) AAA", () => {
  it("happy: an undefended hit puts a card from each hand on the bottom and creates a Ponder for each hero", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [clearConscienceRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(clearConscienceRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("fragment").toHaveAttackPower(8);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(12);
    expect(Prism.cardsIn("deck", brutalAssaultBlue)).toHaveLength(1);
    expect(Dash.cardsIn("deck", snatchRed)).toHaveLength(1);
    // Printed: 1 Ponder per hero. Nested for-each + controller:"each" mints 2.
    expectFabPlayer(Prism).toHaveTokenCount("ponder", 2);
    expectFabPlayer(Dash).toHaveTokenCount("ponder", 2);
    expectFabToken(game, "ponder").toHaveCount(4);
    expectFabCard(Prism, clearConscienceRed).toBeIn("graveyard");
  });

  it("boundary: a full block misses, so no Ponder and both extras stay in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [clearConscienceRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(clearConscienceRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Prism, snatchRed).toBeIn("hand");
    expectFabToken(game, "ponder").toHaveCount(0);
  });

  it("timing: Fragment −2{p} still hits and the hit clause still fires", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [clearConscienceRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(clearConscienceRed);
    Dash.defendWith(nimblismBlue);
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Prism.cardsIn("deck", brutalAssaultBlue)).toHaveLength(1);
    expect(Dash.cardsIn("deck", snatchRed)).toHaveLength(1);
    // Printed: 1 Ponder per hero. Nested for-each + controller:"each" mints 2.
    expectFabPlayer(Prism).toHaveTokenCount("ponder", 2);
    expectFabPlayer(Dash).toHaveTokenCount("ponder", 2);
  });
});
