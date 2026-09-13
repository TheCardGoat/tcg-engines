import { USURP_PREVIEW_SCENARIOS } from "./usurp-preview";
import { describe, expect, it } from "vitest";
import {
  FAB_ENGINE_SCENARIOS,
  FAB_ENGINE_SCENARIO_IDS,
  FAB_SCENARIO_GROUPS,
  orderCataloguedScenarios,
} from "./index";
import { FAB_HERO_SPECIAL_SCENARIOS } from "../hero-special-ui/visualScenarios";
import { COMBAT_SCENARIOS } from "./combat";

describe("FAB engine scenarios · registry", () => {
  it("preserves catalog order and registers every scenario exactly once", () => {
    expect(new Set(FAB_ENGINE_SCENARIO_IDS).size).toBe(FAB_ENGINE_SCENARIO_IDS.length);

    const scenarioIds = FAB_ENGINE_SCENARIOS.map((scenario) => scenario.id);
    expect(scenarioIds).toEqual([
      ...FAB_ENGINE_SCENARIO_IDS,
      ...FAB_HERO_SPECIAL_SCENARIOS.map((scenario) => scenario.id),
      ...USURP_PREVIEW_SCENARIOS.map((scenario) => scenario.id),
    ]);
    expect(new Set(scenarioIds).size).toBe(scenarioIds.length);

    const validGroups = new Set(FAB_SCENARIO_GROUPS.map((group) => group.id));
    expect(FAB_ENGINE_SCENARIOS.every((scenario) => validGroups.has(scenario.group))).toBe(true);
    expect(scenarioIds).toContain("defender-zone-exit");
  });

  it("keeps uncatalogued collection scenarios instead of throwing", () => {
    const collected = new Map(Object.entries(COMBAT_SCENARIOS));
    const catalogIds = FAB_ENGINE_SCENARIO_IDS.filter((id) => id !== "defender-zone-exit");
    const ordered = orderCataloguedScenarios(catalogIds, collected);

    expect(ordered.map((scenario) => scenario.id)).toContain("defender-zone-exit");
    expect(ordered.at(-1)?.id).toBe("defender-zone-exit");
  });

  it(
    "keeps every engine scenario's automation and fixture namespaces valid",
    { timeout: 60_000 },
    () => {
      for (const scenario of FAB_ENGINE_SCENARIOS) {
        const match = scenario.boot();
        const preferences = match.runtime.snapshot().automationPreferences;
        for (const playerId of [match.player1Id, match.player2Id]) {
          expect(preferences[playerId]).toMatchObject({
            priorityMode: "auto-pass",
            autoOrderTriggers: true,
          });
        }
        const definitions = Object.values(match.runtime.getState().cardDefinitions);
        for (const definition of definitions) {
          if (!definition.canonicalId.startsWith("fixture-")) continue;
          expect({
            scenarioId: scenario.id,
            canonicalId: definition.canonicalId,
            slug: definition.slug,
          }).toEqual({
            scenarioId: scenario.id,
            canonicalId: definition.canonicalId,
            slug: definition.canonicalId,
          });
        }
      }
    },
  );
});
