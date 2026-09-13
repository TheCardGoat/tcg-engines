import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { swarmingGloomveilRed } from "./swarming-gloomveil.ts";

/**
 * Swarming Gloomveil (EVR105) — Runeblade Action - Attack, cost 0, 3{p}, 3{d}.
 *
 * Printed: If you have played or created 1 or more auras this turn, this
 * gains go again. If 2 or more, +1{p}. If 3 or more, "When this hits a
 * hero, they can't prevent arcane damage from sources you control this turn."
 *
 * Resolution is gated on unhandled has-status markers
 * `played-or-created-N-or-more-auras-this-turn` (not the handled
 * `played-or-created-aura-this-turn` fact). Pin the throw in both
 * directions; keep the printed 3{d} block fragment.
 */

describe("Swarming Gloomveil (EVR105) AAA", () => {
  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: viserai, hand: [swarmingGloomveilRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Viserai.defendWith(swarmingGloomveilRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Viserai).toHaveLife(19);
    expectFabCard(Viserai, swarmingGloomveilRed).toBeIn("graveyard");
  });
});
