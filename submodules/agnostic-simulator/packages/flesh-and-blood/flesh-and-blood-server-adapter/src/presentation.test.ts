import { describe, expect, it } from "vitest";
import { fleshAndBloodServerAdapter } from "./adapter";
import { fleshAndBloodPresentationAdapter } from "./presentation";
import { fabPresentationCatalog } from "@tcg/flesh-and-blood-cards/presentation-catalog";
import type { CardsMaps } from "@tcg/shared/game-adapter";
const canonicalId = "GgDFFHhLh8Kc7tJK8nBLj";
const record = fabPresentationCatalog.records[canonicalId]!;
const [first, second] = Object.keys(record.printings);
describe("frozen FAB presentation", () => {
  it("prepares the authored dependency closure before seating and deterministically freezes selected printings", async () => {
    const inputs = [{ owner: "p1", deck: [{ cardId: canonicalId, qty: 2, printingId: first! }] }];
    const bundle = await fleshAndBloodPresentationAdapter.prepare(inputs);
    expect(bundle.records[canonicalId]?.printings[first!]).toBeDefined();
    expect(Object.keys(bundle.records).length).toBeGreaterThan(1);
    expect((await fleshAndBloodPresentationAdapter.prepare(inputs)).manifestId).toBe(
      bundle.manifestId,
    );
    expect(Object.keys(bundle.aliases).some((alias) => alias.startsWith("token:"))).toBe(true);
  });
  it("preserves distinct copies and inventory in saved-entry order across materialization", () => {
    const pregame = fleshAndBloodServerAdapter.pregame!;
    const pool = pregame.createPool({
      formatId: "cc",
      mainDeck: [
        { cardId: "rhinar-reckless-rampage", quantity: 1 },
        { cardId: canonicalId, quantity: 30, printingId: first! },
        { cardId: canonicalId, quantity: 30, printingId: second! },
      ],
      inventory: [{ cardId: canonicalId, quantity: 1, printingId: first! }],
    });
    const selection = pregame.parseSelection({
      equipment: {},
      deck: [{ canonicalId, quantity: 60 }],
    });
    const materialized = pregame.materializeDeck(pool, selection);
    expect(materialized.filter((entry) => entry.cardId === canonicalId)).toEqual([
      { cardId: canonicalId, qty: 30, printingId: first, sectionId: "main" },
      { cardId: canonicalId, qty: 30, printingId: second, sectionId: "main" },
      { cardId: canonicalId, qty: 1, printingId: first, sectionId: "inventory" },
    ]);
    expect(pregame.materializeDeck(JSON.parse(JSON.stringify(pool)), selection)).toEqual(
      materialized,
    );
    const maps = fleshAndBloodServerAdapter.buildCardInstances([
      { owner: "p1", deck: materialized },
      { owner: "p2", deck: materialized },
    ]);
    expect(
      new Set(Object.values(maps.presentation?.printingIdByInstanceId ?? {})).has(second!),
    ).toBe(true);
  });
  it("projects only currently visible instance bindings and extracts unexpected objects", () => {
    const maps: CardsMaps = {
      cardInstances: { visible: canonicalId, hidden: canonicalId },
      owners: { p1: ["visible"], p2: ["hidden"] },
      presentation: { printingIdByInstanceId: { visible: first!, hidden: second! } },
    };
    expect(
      fleshAndBloodPresentationAdapter.projectBindings(
        {},
        { cardInstances: { visible: canonicalId } },
        maps,
        { role: "player", actorId: "p1" },
      ).printingIdByInstanceId,
    ).toEqual({ visible: first });
    expect(
      fleshAndBloodPresentationAdapter.projectBindings({}, { cardInstances: {} }, maps, {
        role: "player",
        actorId: "p1",
      }).printingIdByInstanceId,
    ).toEqual({});
    expect(
      fleshAndBloodPresentationAdapter.collectReferences(
        { state: { objects: { new: { canonicalId: "unexpected-token" } } } },
        maps,
      ),
    ).toContain("unexpected-token");
  });
});
