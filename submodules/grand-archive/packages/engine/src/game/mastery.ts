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

/** The source survives on the stack even after its controller replaces their mastery. */
export function grandArchiveMasterySourceSubtypes(
  program: GrandArchiveMatchProgram,
  source: { readonly name: string } | undefined,
): readonly string[] {
  const definition = source && grandArchiveMasteryDefinition(program, source.name);
  return definition ? defaultFace(definition).typeLine.subtypes : [];
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

/** Original activations of this exact non-object mastery instance; copies never advance Cascade. */
export function grandArchiveMasteryAbilityActivationCount(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  mastery: GrandArchiveMasteryState,
  abilityId: string,
): number {
  const ids = new Set<string>();
  for (const event of state.eventHistory) {
    if (
      (event.type === "stack-item-added" || event.type === "stack-item-deferred") &&
      event.item.kind === "activated-ability" &&
      !event.item.isCopy &&
      event.item.masterySource?.playerId === playerId &&
      event.item.masterySource.name === mastery.name &&
      event.item.bindings.masterySourceTimestamp === mastery.timestamp &&
      event.item.ability.id === abilityId
    )
      ids.add(event.item.id);
  }
  return ids.size;
}
