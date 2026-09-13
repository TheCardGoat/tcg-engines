import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { rousingAetherRed } from "../actions/rousing-aether.ts";
import { arcaneComplianceBlue } from "./arcane-compliance.ts";

/**
 * Arcane Compliance (SEA261) — Generic Instant, cost 0.
 *
 * Printed: Until end of turn, effects can't increase arcane damage that
 * target action card on the stack would deal.
 */

describe("Arcane Compliance (SEA261) AAA", () => {
  it("happy: blocks plus-1 arcane on the targeted stacked action", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [rousingAetherRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [arcaneComplianceBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(rousingAetherRed, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(16);

    Blaze.play(volticBoltRed, { target: Dash.id });
    Blaze.pass();
    Dash.play(arcaneComplianceBlue);
    game.untilIdle();

    expectFabCard(Dash, arcaneComplianceBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(11);
  });

  it("boundary: without Compliance the next arcane action still gets plus 1", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [rousingAetherRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(rousingAetherRed, { target: Dash.id });
    game.passBoth();
    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(10);
  });

  it("timing: playable as an instant after the opponent announces an action", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [arcaneComplianceBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    Blaze.pass();
    Dash.play(arcaneComplianceBlue);
    game.untilIdle();

    expectFabCard(Dash, arcaneComplianceBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(15);
  });
});
