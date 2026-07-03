import { getDefinition } from "./state.ts";
import type { MatchState, PlayerId } from "./types.ts";

export interface ProjectedCard {
  readonly instanceId: string;
  readonly definitionId: string | null;
  readonly title: string | null;
  readonly controller: PlayerId;
  readonly zone: string;
  readonly exhausted: boolean;
  readonly damage: number;
  readonly shield: number;
  readonly experience: number;
  readonly keywords: readonly string[];
}

export interface ProjectedState {
  readonly id: string;
  readonly viewer: PlayerId;
  readonly activePlayer: PlayerId;
  readonly phase: MatchState["phase"];
  readonly cards: readonly ProjectedCard[];
  readonly pendingChoiceCount: number;
  readonly publicLog: MatchState["moveLog"];
}

function canSeeCard(viewer: PlayerId, zone: string, controller: PlayerId): boolean {
  if (zone === "deck") return false;
  if (zone === "hand") return viewer === controller;
  return true;
}

export function projectState(state: MatchState, viewer: PlayerId): ProjectedState {
  return {
    id: state.id,
    viewer,
    activePlayer: state.activePlayer,
    phase: state.phase,
    cards: Object.values(state.cards).map((card) => {
      const visible = canSeeCard(viewer, card.zone, card.controller);
      const definition = visible ? getDefinition(state, card.instanceId) : null;
      return {
        instanceId: card.instanceId,
        definitionId: visible ? card.definitionId : null,
        title: definition?.title ?? null,
        controller: card.controller,
        zone: card.zone,
        exhausted: card.exhausted,
        damage: card.damage,
        shield: card.shield,
        experience: card.experience,
        keywords: visible ? card.keywords : [],
      };
    }),
    pendingChoiceCount: state.pendingChoices.filter((choice) => choice.playerId === viewer).length,
    publicLog: state.moveLog.filter((entry) => entry.public),
  };
}
