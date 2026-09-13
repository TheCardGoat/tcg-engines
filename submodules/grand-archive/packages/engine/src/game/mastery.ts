import type {
  GrandArchiveCounterKind,
  GrandArchiveExecutableAbility,
} from "@tcg/grand-archive-types";
import type { GrandArchivePlayerId } from "./identity.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState, GrandArchiveMasteryState } from "./model.ts";

function defaultFace(card: GrandArchiveMatchProgram["cardsById"][string]) {
  return card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
}

export function grandArchiveMasteryDefinition(program: GrandArchiveMatchProgram, name: string) {
  return Object.values(program.cardsById).find(
    (card) => card.definitionKind === "mastery-representation" && defaultFace(card).name === name,
  );
}

export function grandArchivePlayerMastery(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  name?: string,
): GrandArchiveMasteryState | undefined {
  const mastery = state.players[playerId]?.mastery;
  return mastery && (!name || mastery.name === name) ? mastery : undefined;
}

export function grandArchiveMasteryCounterCount(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  name: string,
  counter: GrandArchiveCounterKind,
): number {
  const key = typeof counter === "string" ? counter : `named:${counter.named}`;
  return grandArchivePlayerMastery(state, playerId, name)?.counters[key] ?? 0;
}

export function grandArchiveActiveMasteryAbilities(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): readonly GrandArchiveExecutableAbility[] {
  const mastery = grandArchivePlayerMastery(state, playerId);
  if (!mastery) return [];
  const definition = grandArchiveMasteryDefinition(program, mastery.name);
  if (!definition) return [];
  const face = defaultFace(definition);
  return face.abilities.flatMap((ability) =>
    ability.kind === "composite" ? ability.abilities : [ability],
  );
}

export function grandArchiveMasteryTimestamp(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): number {
  return state.players[playerId]?.mastery?.timestamp ?? 0;
}
