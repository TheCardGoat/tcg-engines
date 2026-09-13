import { describe, expect, it } from "vite-plus/test";
import { snatchRed } from "../../cards/src/cards/actions/snatch.ts";
import { bravo } from "../../cards/src/cards/heroes/bravo.ts";
import { dash } from "../../cards/src/cards/heroes/dash.ts";
import { cintariSellsword } from "../../cards/src/cards/tokens/cintari-sellsword.ts";
import { FabTestEngine } from "./testing/test-engine.ts";
import { projectFabViewerResources, projectFabViewerState } from "./view.ts";

describe("viewer combat targets", () => {
  it("retains a departed token target's public identity without restoring a live instance", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, arena: [cintariSellsword], deck: 6 },
      { autoPassPriority: false },
    );
    const ally = game.as(dash).findCardInZone("arena", cintariSellsword);
    game.as(bravo).playAttack(snatchRed, { target: ally });
    game.toReaction();
    game.passBoth();

    for (const player of [bravo, dash]) {
      expect(game.renderedPlayerNarrative(game.as(player).id)).toContainEqual(
        expect.stringContaining("Snatch hit Cintari Sellsword for 4"),
      );
    }

    // The projection contract must work from a fresh snapshot, without a UI cache.
    const state = structuredClone(game.getState());
    expect(state.objects[ally]).toBeUndefined();
    const target = state.combat?.activeLink?.attackTargetRef;
    if (target?.kind !== "object") throw new Error("Expected the resolved ally attack");
    for (const viewer of [
      { role: "player", actorId: game.as(bravo).id },
      { role: "player", actorId: game.as(dash).id },
      { role: "spectator" },
    ] as const) {
      const view = projectFabViewerState(state, viewer);
      const resources = projectFabViewerResources(state, viewer);
      expect(view.combat?.departedTargetCardIds).toEqual({
        [`${target.ref.instanceId}:${target.ref.incarnation}`]: cintariSellsword.canonicalId,
      });
      expect(resources.cardDefinitions).toHaveProperty(cintariSellsword.canonicalId);
      expect(resources.cardInstances).not.toHaveProperty(ally);
    }
  });
});
