import { describe, expect, it } from "vitest";

import { groupInstancesBySection } from "./deck-sections.js";
import type { CardsMaps } from "./types.js";

function cardsMaps(
  cardInstances: Record<string, string>,
  owners: Record<string, string[]>,
  instanceSections?: Record<string, string>,
): CardsMaps {
  return { cardInstances, owners, ...(instanceSections ? { instanceSections } : {}) };
}

describe("groupInstancesBySection", () => {
  it("buckets instances by the section tag carried in instanceSections", () => {
    const maps = cardsMaps(
      {
        p1_unit_0: "GD01-001",
        p1_unit_1: "GD01-002",
        p1_resource_0: "R-001",
        p1_resource_1: "R-001",
      },
      { p1: ["p1_unit_0", "p1_unit_1", "p1_resource_0", "p1_resource_1"] },
      {
        p1_unit_0: "main",
        p1_unit_1: "main",
        p1_resource_0: "resource",
        p1_resource_1: "resource",
      },
    );

    const result = groupInstancesBySection(maps.owners.p1, maps);

    expect([...result.bySection.keys()].sort()).toEqual(["main", "resource"]);
    expect(result.bySection.get("main")?.map((e) => e.definitionId)).toEqual([
      "GD01-001",
      "GD01-002",
    ]);
    expect(result.bySection.get("resource")?.map((e) => e.definitionId)).toEqual([
      "R-001",
      "R-001",
    ]);
    expect(result.unresolved).toEqual([]);
  });

  it("is fail-closed: untagged instances land in unresolved when there is no fallback", () => {
    const maps = cardsMaps(
      { p1_a_0: "GD01-001", p1_b_0: "R-001" },
      { p1: ["p1_a_0", "p1_b_0"] },
      // Only one instance tagged; the other has no section.
      { p1_a_0: "main" },
    );

    const result = groupInstancesBySection(maps.owners.p1, maps);

    expect(result.bySection.get("main")?.map((e) => e.definitionId)).toEqual(["GD01-001"]);
    expect(result.unresolved).toEqual([{ instanceId: "p1_b_0", definitionId: "R-001" }]);
  });

  it("applies fallbackSection to legacy untagged instances", () => {
    const maps = cardsMaps(
      { p1_a_0: "GD01-001", p1_b_0: "GD01-002" },
      { p1: ["p1_a_0", "p1_b_0"] },
      // No instanceSections at all — legacy cardsMaps shape.
    );

    const result = groupInstancesBySection(maps.owners.p1, maps, {
      fallbackSection: "main",
    });

    expect(result.bySection.get("main")?.map((e) => e.definitionId)).toEqual([
      "GD01-001",
      "GD01-002",
    ]);
    expect(result.unresolved).toEqual([]);
  });

  it("rejects section ids outside knownSections as unresolved", () => {
    const maps = cardsMaps(
      { p1_a_0: "GD01-001", p1_b_0: "GD01-002" },
      { p1: ["p1_a_0", "p1_b_0"] },
      { p1_a_0: "main", p1_b_0: "bench" },
    );

    const result = groupInstancesBySection(maps.owners.p1, maps, {
      knownSections: new Set(["main", "resource"]),
    });

    expect(result.bySection.get("main")?.map((e) => e.definitionId)).toEqual(["GD01-001"]);
    expect(result.unresolved).toEqual([{ instanceId: "p1_b_0", definitionId: "GD01-002" }]);
  });

  it("surfaces owner instances missing from cardInstances as unresolved (not silently dropped)", () => {
    const maps = cardsMaps(
      { p1_a_0: "GD01-001" },
      { p1: ["p1_a_0", "p1_orphan_0"] },
      { p1_a_0: "main", p1_orphan_0: "main" },
    );

    const result = groupInstancesBySection(maps.owners.p1, maps);

    expect(result.bySection.get("main")?.map((e) => e.instanceId)).toEqual(["p1_a_0"]);
    // The orphan has no cardInstances entry; it must surface as unresolved
    // (with only its instanceId) rather than being silently dropped.
    expect(result.unresolved).toEqual([{ instanceId: "p1_orphan_0" }]);
  });

  it("preserves order within a bucket", () => {
    const maps = cardsMaps(
      { p1_0: "A", p1_1: "B", p1_2: "C", p1_3: "D" },
      { p1: ["p1_0", "p1_1", "p1_2", "p1_3"] },
      { p1_0: "main", p1_1: "resource", p1_2: "main", p1_3: "resource" },
    );

    const result = groupInstancesBySection(maps.owners.p1, maps);

    expect(result.bySection.get("main")?.map((e) => e.definitionId)).toEqual(["A", "C"]);
    expect(result.bySection.get("resource")?.map((e) => e.definitionId)).toEqual(["B", "D"]);
  });
});
