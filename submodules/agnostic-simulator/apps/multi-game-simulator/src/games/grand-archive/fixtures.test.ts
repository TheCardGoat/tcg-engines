import { describe, expect, it, vi } from "vitest";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";

describe("Grand Archive visual fixtures", () => {
  it("defers the starter runtime until fixture state is requested and caches it", async () => {
    vi.resetModules();
    const setup = await import("./practice-setup");
    const create = vi.spyOn(setup, "createGrandArchivePracticeEngineFromSetup");
    try {
      const { GRAND_ARCHIVE_VISUAL_FIXTURES: fixtures } = await import("./fixtures");
      const entry = fixtures.find((fixture) => fixture.id === "materialization-hand")!;
      expect(entry.summary).toContain("Reset materialization");
      expect(create).not.toHaveBeenCalled();
      expect(entry.table.zones.length).toBeGreaterThan(0);
      expect(entry.waitState.kind).toBe("materialization-choice");
      expect(create).toHaveBeenCalledTimes(1);
    } finally {
      create.mockRestore();
    }
  });

  it("projects each named engine wait state without fabricated controls", () => {
    expect(GRAND_ARCHIVE_VISUAL_FIXTURES.map((fixture) => fixture.id)).toEqual([
      "champion-lineage",
      "counter-identity",
      "combat-retaliation",
      "combat-damage",
      "combat-result",
      "effects-stack",
      "combat-declaration",
      "pregame-action",
      "materialization-choice",
      "materialization-hand",
      "attack-targeting",
      "opportunity",
      "art-only",
      "decision",
      "decision-observer",
      "resolving",
      "zone-inspection",
      "game-over",
    ]);
    const inspection = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (fixture) => fixture.id === "zone-inspection",
    )!;
    for (const name of ["inner-lineage", "loaded", "intent"]) {
      const zone = inspection.table.zones.find((entry) => entry.id === `p1:${name}`)!;
      expect(zone.entityIds).toHaveLength(1);
      expect(
        inspection.entities.find((entity) => entity.id === zone.entityIds[0])?.dataAttributes?.[
          "data-host-id"
        ],
      ).toBeTruthy();
    }
    expect(
      inspection.table.zones.find((zone) => zone.id === "p1:main-deck")?.entityIds,
    ).toHaveLength(1);
    const combat = GRAND_ARCHIVE_VISUAL_FIXTURES.find(
      (fixture) => fixture.id === "combat-declaration",
    )!;
    expect(
      combat.entities.filter((entity) => entity.dataAttributes?.["data-combat-role"]),
    ).toHaveLength(2);
    expect(combat.waitState.kind).toBe("resolving");
    const decision = GRAND_ARCHIVE_VISUAL_FIXTURES.find((fixture) => fixture.id === "decision")!;
    expect(decision.table.status.phase).toContain("Decision");
    expect(decision.waitState.kind).toBe("decision");
    expect(decision.interactions.length).toBeGreaterThan(0);
    const resolving = GRAND_ARCHIVE_VISUAL_FIXTURES.find((fixture) => fixture.id === "resolving")!;
    expect(resolving.table.status.phase).toContain("Resolving");
    expect(resolving.waitState.kind).toBe("resolving");
    expect(resolving.interactions.map((interaction) => interaction.label)).toEqual(["Concede"]);
    const gameOver = GRAND_ARCHIVE_VISUAL_FIXTURES.find((fixture) => fixture.id === "game-over")!;
    expect(gameOver.table.status.phase).toBe("Game over");
    expect(gameOver.waitState.kind).toBe("game-over");
    expect(gameOver.interactions).toEqual([]);
  });
});
