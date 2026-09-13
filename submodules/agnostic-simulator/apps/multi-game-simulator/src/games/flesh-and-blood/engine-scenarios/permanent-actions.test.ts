import { listLegalCommands } from "@tcg/flesh-and-blood-engine/simulator";
import { describe, expect, it } from "vitest";

import { PERMANENT_ACTION_SCENARIOS } from "./permanent-actions";

const AUTOMATIC_OR_STATIC_LABELS = new Set([
  "Blood Debt",
  "Crank",
  "Decay",
  "Legendary",
  "Watery Grave",
]);

describe("FAB permanent-action visual fixtures", () => {
  it.each([
    ["permanent-actions-allies", [1, 2, 2, 2]],
    ["permanent-actions-items-and-tokens", [1, 1, 2, 3]],
  ] as const)(
    "boots %s with the intended card-action distribution",
    (scenarioId, expectedCounts) => {
      const match = PERMANENT_ACTION_SCENARIOS[scenarioId].boot();
      const state = match.runtime.getState();
      const arenaIds = new Set(state.containers.zonesByPlayerId[match.player1Id]?.arena ?? []);
      const activateCommands = listLegalCommands(match.runtime, match.player1Id).filter(
        (command) => command.move === "activate" && command.sourceInstanceId,
      );
      const countBySource = new Map<string, number>();

      for (const command of activateCommands) {
        const sourceId = command.sourceInstanceId;
        if (!sourceId) throw new Error(`Activate command has no source: ${command.label}`);
        expect(arenaIds.has(sourceId)).toBe(true);
        expect(AUTOMATIC_OR_STATIC_LABELS.has(command.label)).toBe(false);
        countBySource.set(sourceId, (countBySource.get(sourceId) ?? 0) + 1);
      }

      expect([...countBySource.values()].sort()).toEqual([...expectedCounts]);

      const commandsBySource = Map.groupBy(
        activateCommands,
        (command) => command.sourceInstanceId!,
      );
      for (const commands of commandsBySource.values()) {
        expect(new Set(commands.map((command) => command.label)).size).toBe(commands.length);
      }
    },
  );

  it("shows concise, distinct choices for representative multi-ability permanents", () => {
    const match = PERMANENT_ACTION_SCENARIOS["permanent-actions-items-and-tokens"].boot();
    const state = match.runtime.getState();
    const labelsBySlug = Map.groupBy(
      listLegalCommands(match.runtime, match.player1Id).filter(
        (command) => command.move === "activate" && command.sourceInstanceId,
      ),
      (command) => state.objects[command.sourceInstanceId!]?.canonicalId,
    );
    const labels = (name: string) =>
      [...labelsBySlug.entries()]
        .filter(([canonicalId]) => state.cardDefinitions[canonicalId!]?.base.names.includes(name))
        .flatMap(([, commands]) => commands.map((command) => command.label));

    expect(labels("Micro-processor")).toEqual([
      "Activate Micro-processor — Opt 1",
      "Activate Micro-processor — Draw, then put a card on top of your deck",
      "Activate Micro-processor — Banish the top card of your deck",
    ]);
    expect(labels("Aether Sink")).toEqual([
      "Activate Aether Sink — Add a steam counter",
      "Activate Aether Sink — Gain Arcane Barrier 2",
    ]);
  });
});
