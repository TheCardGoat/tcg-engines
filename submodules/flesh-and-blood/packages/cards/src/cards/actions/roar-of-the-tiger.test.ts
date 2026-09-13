import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { iraScarletRevenger } from "../heroes/ira-scarlet-revenger.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { roarOfTheTigerYellow } from "./roar-of-the-tiger.ts";

/**
 * Roar of the Tiger (DYN049) — Yellow Ninja action.
 *
 * Printed:
 *   Create a Crouching Tiger in your hand.
 *   Crouching Tigers you control gain +1{p} this turn.
 *   Go again
 */

describe("Roar of the Tiger (DYN049) AAA", () => {
  it("happy: playing Roar creates a Crouching Tiger token in hand", () => {
    const game = FabTestEngine.start(
      { hero: iraScarletRevenger, hand: [roarOfTheTigerYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);
    const Dash = game.as(dash);

    Ira.play(roarOfTheTigerYellow);
    game.helpers.resolveUntilIdle();

    expect(Ira.zone("hand")).toContain("token:crouching-tiger");
    expect(Dash.zone("hand")).not.toContain("token:crouching-tiger");
    expectFabCard(Ira, roarOfTheTigerYellow).toBeIn("graveyard");
  });

  it("boundary: a non-Crouching-Tiger attack after Roar does not gain +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [roarOfTheTigerYellow, brutalAssaultBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);
    const Dash = game.as(dash);

    Ira.play(roarOfTheTigerYellow);
    game.helpers.resolveUntilIdle();
    Ira.attackWith(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4);
    expect(Ira.zone("hand")).toContain("token:crouching-tiger");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: a Crouching Tiger attacked after Roar resolves gains +1{p} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [roarOfTheTigerYellow, crouchingTiger],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);
    const Dash = game.as(dash);

    Ira.play(roarOfTheTigerYellow);
    game.helpers.resolveUntilIdle();
    Ira.attackWith(crouchingTiger);

    expectCombat(game).toHaveAttackPower(1);
    expect(Ira.zone("hand")).toContain("token:crouching-tiger");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
