import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { flashBoltRed } from "../instants/flash-bolt.ts";
import { dampenRed } from "./dampen.ts";

/**
 * Dampen Red (UPR170) — deal 4 arcane to any target, then prevent the next X
 * arcane to your hero this turn, where X is the damage Dampen dealt.
 */

describe("Dampen (UPR170) AAA", () => {
  it("happy: deals 4 arcane to the targeted opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [dampenRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(dampenRed, { target: Dash });
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, dampenRed).toBeIn("graveyard");
  });

  it("happy: prevents the next X arcane to your hero where X is damage dealt", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [dampenRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [flashBoltRed],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);
    // Self-target: X = 4 prevention budget on Blaze (young hero starts at 17).

    Blaze.play(dampenRed, { target: Blaze });
    game.passBoth();
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Blaze).toHaveLife(13);

    // Non-turn Instant Flash Bolt 3 arcane — fully prevented.
    Blaze.pass();
    Dash.play(flashBoltRed, { target: Blaze.id });
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Blaze).toHaveLife(13);
  });

  it("boundary: without Dampen, Voltic Bolt deals its full 5 arcane", () => {
    // Blaze Firemind is a young hero (printed 17 life).
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Blaze.id });
    game.helpers.resolveUntilIdle();

    // 17 − 5 = 12.
    expectFabPlayer(Blaze).toHaveLife(12);
  });
});
