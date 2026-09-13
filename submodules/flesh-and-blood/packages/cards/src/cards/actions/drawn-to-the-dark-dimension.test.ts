import { drawnToTheDarkDimensionBlue } from "./drawn-to-the-dark-dimension.ts";
import { briar } from "../shared/test-recipients.ts";
import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { snatchRed } from "./snatch.ts";
import { drawnToTheDarkDimensionRed } from "./drawn-to-the-dark-dimension.ts";

const runechant = fabToken("runechant");

describe("Drawn to the Dark Dimension (ARC097) AAA", () => {
  it("happy: two Runechants make this cost 0 and the attack draws 1", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [drawnToTheDarkDimensionRed],
        arena: [runechant, runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Viserai = game.as(viserai);

    expectFabCard(Viserai, drawnToTheDarkDimensionRed).toHaveCost(0);
    Viserai.playAttack(drawnToTheDarkDimensionRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Viserai, snatchRed).toBeIn("hand");
    expectFabPlayer(Viserai).toHaveHandCount(1);
  });

  it("boundary: no Runechants leaves the printed cost 2 unpaid", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [drawnToTheDarkDimensionRed],
        arena: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Viserai = game.as(viserai);

    expectFabCard(Viserai, drawnToTheDarkDimensionRed).toHaveCost(2);
    expect(() => Viserai.playAttack(drawnToTheDarkDimensionRed)).toThrow();
    expectFabCard(Viserai, drawnToTheDarkDimensionRed).toBeIn("hand");
  });

  it("timing: the draw is on attack, not while the card is still in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [drawnToTheDarkDimensionRed],
        arena: [runechant, runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Viserai = game.as(viserai);

    expectFabPlayer(Viserai).toHaveHandCount(1);
    Viserai.playAttack(drawnToTheDarkDimensionRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectFabCard(Viserai, drawnToTheDarkDimensionRed).toBeIn("combatChain");
    expectFabCard(Viserai, snatchRed).toBeIn("hand");
  });

  it("happy: 2 Runechants reduce the 2{r} cost to 0 and the link draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [drawnToTheDarkDimensionBlue],
        arena: [runechant, runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(drawnToTheDarkDimensionBlue);

    expectCombat(game).toHaveAttackPower(1);
    expectFabPlayer(Briar).toHaveResourceCount(0);

    game.helpers.resolveRestOfCombat();
    // The resolution draw arrives (hand was empty after playing it) and the
    // two burned Runechants ping for 2 arcane: 1 combat + 2 arcane.
    expectFabPlayer(Briar).toHaveHandCount(1);
    expectFabPlayer(Dash).toHaveLife(17);
  });
});
