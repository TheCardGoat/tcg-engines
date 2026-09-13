import { describe, expect, it } from "vite-plus/test";
import { splitDeckForSetup } from "./gundam-deck-setup.js";
import type { CardsMaps } from "@tcg/shared/game-adapter";

function catalogFor(definitionId: string): { type?: string } | undefined {
  if (definitionId === "GD01-001") return { type: "unit" };
  if (definitionId === "RP-003") return { type: "resource" };
  return undefined;
}

describe("splitDeckForSetup — section-driven path", () => {
  it("routes instances to main/resource from instanceSections without catalog lookup", () => {
    const cardsMaps: CardsMaps = {
      cardInstances: {
        p1_unit_0: "GD01-001",
        p1_unit_1: "GD01-002",
        p1_resource_0: "R-001",
        p1_resource_1: "R-001",
      },
      owners: { p1: ["p1_unit_0", "p1_unit_1", "p1_resource_0", "p1_resource_1"] },
      instanceSections: {
        p1_unit_0: "main",
        p1_unit_1: "main",
        p1_resource_0: "resource",
        p1_resource_1: "resource",
      },
    };
    // Catalog that would FAIL the legacy lookup for R-001 — proves the
    // section path does not consult the catalog.
    const failingCatalog = {
      get: () => undefined,
    };

    const result = splitDeckForSetup(cardsMaps.owners.p1!, cardsMaps, failingCatalog);

    expect(result.deck).toEqual(["GD01-001", "GD01-002"]);
    expect(result.resourceDeck).toEqual(["R-001", "R-001"]);
    expect(result.rejected).toEqual([]);
  });

  it("is fail-closed: untagged instances are rejected, never silently main-decked", () => {
    const cardsMaps: CardsMaps = {
      cardInstances: { p1_a_0: "GD01-001", p1_b_0: "R-001" },
      owners: { p1: ["p1_a_0", "p1_b_0"] },
      instanceSections: { p1_a_0: "main" },
    };

    const result = splitDeckForSetup(cardsMaps.owners.p1!, cardsMaps, { get: () => undefined });

    expect(result.deck).toEqual(["GD01-001"]);
    expect(result.resourceDeck).toEqual([]);
    expect(result.rejected).toEqual([{ definitionId: "R-001", reason: "no-section" }]);
  });

  it("rejects section ids the Gundam engine does not route", () => {
    const cardsMaps: CardsMaps = {
      cardInstances: { p1_a_0: "GD01-001", p1_b_0: "GD01-002" },
      owners: { p1: ["p1_a_0", "p1_b_0"] },
      instanceSections: { p1_a_0: "main", p1_b_0: "bench" },
    };

    const result = splitDeckForSetup(cardsMaps.owners.p1!, cardsMaps, { get: () => undefined });

    expect(result.deck).toEqual(["GD01-001"]);
    expect(result.rejected).toEqual([{ definitionId: "GD01-002", reason: "no-section" }]);
  });
});

describe("splitDeckForSetup — legacy fallback path", () => {
  it("classifies by catalog type when instanceSections is absent", () => {
    const cardsMaps: CardsMaps = {
      cardInstances: {
        p1_unit_1: "GD01-001",
        p1_resource_1: "RP-003",
        p1_unknown_1: "missing-card",
      },
      owners: { p1: ["p1_unit_1", "p1_resource_1", "p1_unknown_1"] },
    };
    const catalog = { get: catalogFor };

    const result = splitDeckForSetup(cardsMaps.owners.p1!, cardsMaps, catalog);

    expect(result.deck).toEqual(["GD01-001", "missing-card"]);
    expect(result.resourceDeck).toEqual(["RP-003"]);
    expect(result.rejected).toBeUndefined();
  });

  it("resolves R-001 by canonicalId/cardNumber through a canonicalized catalog", () => {
    // Mirrors the real R-001 shape: id "R-001_p6", cardNumber/canonicalId "R-001".
    // The lifecycle's getGundamCatalog indexes all three, so a cardsMaps that
    // carries only the canonical "R-001" (e.g. a flattened historic deck) still
    // resolves in the legacy path.
    const cardsMaps: CardsMaps = {
      cardInstances: { p1_main_0: "GD01-001", p1_res_0: "R-001" },
      owners: { p1: ["p1_main_0", "p1_res_0"] },
    };
    const catalog = {
      get(definitionId: string) {
        if (definitionId === "GD01-001") return { type: "unit" };
        if (definitionId === "R-001" || definitionId === "R-001_p6") return { type: "resource" };
        return undefined;
      },
    };

    const result = splitDeckForSetup(cardsMaps.owners.p1!, cardsMaps, catalog);

    expect(result.deck).toEqual(["GD01-001"]);
    expect(result.resourceDeck).toEqual(["R-001"]);
  });
});
