import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { singeingFlowstrideRed } from "./singeing-flowstride.ts";

/**
 * Singeing Flowstride Red (OMN071) — Lightning Runeblade Attack.
 *
 * Printed: Quickstrike - If this has go again, it gets "When this attacks
 * a hero, deal 1 arcane damage to them."
 * The first time this deals damage to a hero, create a Lightning Flow.
 */

describe("Singeing Flowstride (OMN071) AAA", () => {
  it("happy: an unblocked swing lands its printed damage", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [singeingFlowstrideRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(singeingFlowstrideRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4
    expectFabCard(Briar, singeingFlowstrideRed).toBeIn("graveyard");
  });
});
