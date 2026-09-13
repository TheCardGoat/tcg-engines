import type { FabPresentationState } from "../state";

export function withActiveEffectsLab(state: FabPresentationState): FabPresentationState {
  return {
    ...state,
    activeEffects: [
      {
        id: "lab-seismic-surge",
        controllerId: "player-1",
        sourceLabel: "Seismic Surge",
        label: "Cost −1",
        detail: "Your next Guardian attack action card costs 1 less. Source: Seismic Surge.",
        tone: "buff",
        durationLabel: "This turn",
        status: "armed",
        remainingUses: 1,
        scopes: [{ kind: "future-object", playerId: "player-1" }],
      },
      {
        id: "lab-delayed-trigger",
        controllerId: "player-1",
        sourceLabel: "Bloodrush Bellow",
        label: "Waiting trigger",
        detail: "Triggers on the next Brute attack action card you play. Source: Bloodrush Bellow.",
        tone: "neutral",
        durationLabel: "Until triggered",
        status: "armed",
        remainingUses: 1,
        scopes: [{ kind: "player", playerId: "player-1" }],
      },
      {
        id: "lab-damage-prevention",
        controllerId: "player-2",
        sourceLabel: "Staunch Response",
        label: "Damage prevention",
        detail: "Prevents or modifies matching damage. Source: Staunch Response.",
        tone: "buff",
        durationLabel: "This combat chain",
        status: "armed",
        remainingUses: null,
        scopes: [{ kind: "player", playerId: "player-2" }],
      },
      {
        id: "lab-game-rule",
        controllerId: "player-1",
        sourceLabel: "Hypothermia",
        label: "Restricts go again",
        detail: "Attacks you control can't gain go again. Source: Hypothermia.",
        tone: "debuff",
        durationLabel: "While source remains",
        status: "applying",
        remainingUses: null,
        scopes: [{ kind: "game" }],
      },
    ],
  };
}
