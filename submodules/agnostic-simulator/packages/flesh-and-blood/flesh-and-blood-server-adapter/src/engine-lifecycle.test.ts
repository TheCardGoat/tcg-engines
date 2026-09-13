import { getFleshAndBloodCard } from "@tcg/flesh-and-blood-cards/catalog";
import { describe, expect, it } from "vitest";
import { FleshAndBloodServerEngine } from "./server-engine.ts";
import {
  fleshAndBloodCreateServerEngine,
  resolveFabEngineCardDefinition,
} from "./engine-lifecycle.ts";

const HIGH_OCTANE_RED_CANONICAL_ID = "BF7rFRwnNckBK8cMGpKHH";

describe("FAB engine lifecycle structured aliases", () => {
  it("resolves a paired back-face printing to its physical front definition", () => {
    const definition = resolveFabEngineCardDefinition("D8FdbJrGjnMgqCGCpFfCN");

    expect(definition?.canonicalId).toBe("RNCWjkhhdhrHCNRncqznq");
  });

  it("preserves authored abilities when a deck identifies a card by printing ID", async () => {
    const highOctane = getFleshAndBloodCard(HIGH_OCTANE_RED_CANONICAL_ID);
    const printingId = highOctane?.printings[0]?.id;
    if (!printingId) throw new Error("High Octane must have a printing for this regression test.");

    const engine = await fleshAndBloodCreateServerEngine({
      gameSlug: "flesh-and-blood",
      seed: "structured-printing-alias",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        cardInstances: {
          "high-octane-instance": printingId,
          "opponent-instance": HIGH_OCTANE_RED_CANONICAL_ID,
        },
        owners: {
          p1: ["high-octane-instance"],
          p2: ["opponent-instance"],
        },
      },
    });
    expect(engine).toBeInstanceOf(FleshAndBloodServerEngine);
    if (!(engine instanceof FleshAndBloodServerEngine)) return;

    const snap = engine.runtime.snapshot();
    expect(snap.objects["high-octane-instance"]?.canonicalId).toBe(printingId);
    const resources = engine.getViewerResources?.({ role: "player", actorId: "p1" }) as {
      cardDefinitions: Record<string, { base: { abilities: readonly { id: string }[] } }>;
    };
    const abilityIds = resources.cardDefinitions[printingId]?.base.abilities.map(
      (ability) => ability.id,
    );
    expect(abilityIds?.length).toBeGreaterThan(0);
    expect(abilityIds?.every((id) => id.startsWith(`${HIGH_OCTANE_RED_CANONICAL_ID}:`))).toBe(true);
  });
});

// Adapter contract: every registered card survives setup, but only selected
// deck cards can enter the opening hand. Inventory remains usable and private.
describe("prepared game placement", () => {
  it("starts the chosen second seat and keeps unselected cards in inventory", async () => {
    const { fleshAndBloodServerAdapter } = await import("./adapter.ts");
    const cardsMaps = fleshAndBloodServerAdapter.buildCardInstances([
      {
        owner: "p1",
        deck: [
          { cardId: "rhinar-reckless-rampage", qty: 1, sectionId: "hero" },
          { cardId: HIGH_OCTANE_RED_CANONICAL_ID, qty: 5, sectionId: "main" },
          { cardId: HIGH_OCTANE_RED_CANONICAL_ID, qty: 2, sectionId: "inventory" },
        ],
      },
      {
        owner: "p2",
        deck: [
          { cardId: "rhinar-reckless-rampage", qty: 1, sectionId: "hero" },
          { cardId: HIGH_OCTANE_RED_CANONICAL_ID, qty: 5, sectionId: "main" },
        ],
      },
    ]);
    const engine = await fleshAndBloodCreateServerEngine({
      gameSlug: "flesh-and-blood",
      seed: "prepared-game",
      player1Id: "p1",
      player2Id: "p2",
      firstPlayerChooserId: "p1",
      firstTurnPlayerId: "p2",
      cardsMaps,
    });
    if (!(engine instanceof FleshAndBloodServerEngine)) throw new Error("Expected FAB engine");
    const viewer = engine.getViewerState({ role: "player", actorId: "p1" });
    const snapshot = engine.runtime.snapshot();
    expect(snapshot.firstTurnPlayerId).toBe("p2");
    expect(viewer.players.p1?.zones.inventory).toHaveLength(2);
    expect(viewer.players.p1?.zones.hand).toHaveLength(4);
    expect(viewer.players.p1?.zones.deck).toHaveLength(1);
    for (const id of viewer.players.p1!.zones.inventory) {
      expect(cardsMaps.instanceSections?.[id]).toBe("inventory");
      expect(snapshot.objects[id]).toBeDefined();
      expect(viewer.players.p1!.zones.hand).not.toContain(id);
    }
  });
});
