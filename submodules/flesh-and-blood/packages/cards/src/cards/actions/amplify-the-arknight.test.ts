import { amplifyTheArknightBlue } from "./amplify-the-arknight.ts";
import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { amplifyTheArknightRed } from "./amplify-the-arknight.ts";

/**
 * Amplify the Arknight (ARC094) — Runeblade Action - Attack.
 *
 * Printed: This costs {r} less to play for each Runechant you control.
 *
 * CR 5.4.2/6.2: the self-cost static generates a continuous effect while
 * functional (applies from hand at play time). CR 8.6.3: Runechants are
 * named "Runechant" and only the controller's tokens count.
 */

const runechant = fabToken("runechant");

describe("Amplify the Arknight (ARC094) AAA", () => {
  it("happy: 2 Runechants reduce the 3{r} cost to 1", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [amplifyTheArknightRed],
        arena: [runechant, runechant],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(amplifyTheArknightRed);

    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Briar).toHaveResourceCount(0);
  });

  it("boundary: with no Runechants the full 3{r} cost is unpayable at 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [amplifyTheArknightRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expect(() => Briar.attackWith(amplifyTheArknightRed)).toThrow();
    expectFabPlayer(Briar).toHaveResourceCount(2);
  });

  it("timing: Runechants the opponent controls do not reduce the cost", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [amplifyTheArknightRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, arena: [runechant, runechant], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    // "you control" scopes the count to the playing hero's arena.
    expect(() => Briar.attackWith(amplifyTheArknightRed)).toThrow();
    expectFabPlayer(Briar).toHaveResourceCount(2);
  });

  it("happy: 2 Runechants reduce the 3{r} cost to 1", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [amplifyTheArknightBlue],
        arena: [runechant, runechant],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(amplifyTheArknightBlue);

    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Briar).toHaveResourceCount(0);
  });
});
