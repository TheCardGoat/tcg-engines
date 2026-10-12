import type { GrandArchiveViewerState } from "@tcg/grand-archive-engine/simulator";
import type { SimulatorActiveEffect } from "@tcg/simulator-contract";

const LABELS: Readonly<Record<string, string>> = {
  agility: "Agility",
  "crowds-favor": "Crowd’s Favor",
  "elysian-aura": "Elysian Aura",
  "shifting-currents": "Shifting Currents",
  empower: "Empower",
  aeneanProgressionResolved: "Aenean Progression resolved",
  "top-main-deck-revealed": "Top deck card revealed",
};
function stateLabel(key: string): string {
  return (
    LABELS[key] ??
    key
      .replaceAll("-", " ")
      .replaceAll(":", ": ")
      .replace(/^./, (letter) => letter.toUpperCase())
  );
}

export function grandArchivePlayerStatusEffects(
  player: GrandArchiveViewerState["players"][number],
): SimulatorActiveEffect[] {
  const states: SimulatorActiveEffect[] = Object.entries(player.states ?? {}).flatMap(
    ([key, value]) => {
      if (value === false || value === 0 || value === "") return [];
      const label = `${stateLabel(key)}${value === true ? "" : `: ${value}`}`;
      return [
        {
          id: `ga:player-state:${key}`,
          targetKind: "seat",
          targetId: player.id,
          sourceLabel: "Player state",
          label,
          detail: label,
          tone: "neutral",
          kind: "player-state",
        },
      ];
    },
  );
  if (player.mastery) {
    const counters = Object.entries(player.mastery.counters).map(
      ([name, value]) => `${stateLabel(name.replace(/^named:/, ""))}: ${value}`,
    );
    states.push({
      id: "ga:mastery",
      targetKind: "seat",
      targetId: player.id,
      sourceLabel: "Mastery",
      label: player.mastery.name,
      detail: [player.mastery.name, ...counters].join(" · "),
      tone: "neutral",
      kind: "mastery",
    });
  }
  return states;
}
