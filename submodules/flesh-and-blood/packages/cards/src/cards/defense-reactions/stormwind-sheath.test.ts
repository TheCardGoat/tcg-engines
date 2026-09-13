import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { weaveLightningBlue } from "../actions/weave-lightning.ts";
import { briar, brutalAssaultBlue } from "../shared/test-recipients.ts";
import { stormwindSheathRed } from "./stormwind-sheath.ts";

/**
 * Stormwind Sheath (PEN209) — Elemental Defense Reaction, cost 1.
 * Printed: Lightning Bond — If a Lightning card was pitched to play this,
 * create an Embodiment of Lightning token.
 */

describe("Stormwind Sheath (PEN209) AAA", () => {
  it("happy: pitching Lightning creates an Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: briar,
        hand: [stormwindSheathRed, weaveLightningBlue],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    Briar.play(stormwindSheathRed, { pitch: [weaveLightningBlue] });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 1);
    expectFabCard(Briar, stormwindSheathRed).toBeIn("graveyard");
  });

  it("boundary: without a Lightning pitch, no Embodiment is created", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: briar,
        hand: [stormwindSheathRed],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    Briar.play(stormwindSheathRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
  });
});
