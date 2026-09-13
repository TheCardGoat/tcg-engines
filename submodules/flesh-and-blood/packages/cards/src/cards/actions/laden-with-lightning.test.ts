import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { snatchRed } from "./snatch.ts";
import { brutalAssaultBlue, briar } from "../shared/test-recipients.ts";
import { ladenWithLightningRed } from "./laden-with-lightning.ts";

/**
 * Laden with Lightning, Red (PEN212) — Elemental Action, cost 1, 2{d}, go again.
 *
 * Printed: "Your next attack this turn gets +3{p}. Lightning Bond - If a
 * Lightning card was pitched to play this, create an Embodiment of Lightning
 * token. Go again"
 *
 */

describe("Laden with Lightning (PEN212) AAA", () => {
  it("boundary: without a Lightning pitch, no Embodiment of Lightning is created", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ladenWithLightningRed, brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(ladenWithLightningRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Briar, ladenWithLightningRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
  });

  it("happy: pitching a Lightning card creates an Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ladenWithLightningRed, lightningPressRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(ladenWithLightningRed, { pitch: [lightningPressRed] });
    game.helpers.resolveUntilIdle();
    expectFabCard(Briar, ladenWithLightningRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 1);
  });

  it("timing: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: briar, hand: [ladenWithLightningRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith([ladenWithLightningRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveLife(18);
    expectFabCard(Briar, ladenWithLightningRed).toBeIn("graveyard");
  });
});
