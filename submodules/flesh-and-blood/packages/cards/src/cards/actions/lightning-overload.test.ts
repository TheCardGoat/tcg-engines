import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { lightningOverloadRed } from "./lightning-overload.ts";

/**
 * Lightning Overload (OMN115) — Lightning Wizard Action, cost 1, 4 arcane.
 * Starfall: if an instant entered GY this turn, create a Lightning Flow.
 */

describe("Lightning Overload (OMN115) AAA", () => {
  it("happy: deals 4 arcane without a Lightning Flow when no instant hit GY this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [lightningOverloadRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(lightningOverloadRed, { targetInstanceId: Dash.ref(dash).instanceId });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Blaze).toHaveTokenCount("lightning-flow", 0);
    expectFabCard(Blaze, lightningOverloadRed).toBeIn("graveyard");
  });

  it("boundary: unpayable cost keeps the card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [lightningOverloadRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    expectFabUnplayable(() =>
      Blaze.play(lightningOverloadRed, { targetInstanceId: Dash.ref(dash).instanceId }),
    );
    expectFabCard(Blaze, lightningOverloadRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: after resolution the card is in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [lightningOverloadRed],
        graveyard: [lightningPressRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(lightningOverloadRed, { targetInstanceId: Dash.ref(dash).instanceId });
    game.passBoth();

    expectFabCard(Blaze, lightningOverloadRed).toBeIn("graveyard");
  });
});
