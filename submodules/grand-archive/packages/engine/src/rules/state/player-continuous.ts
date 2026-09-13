import { continuousEffectSourceContext } from "./continuous-source.ts";
import type {
  GrandArchiveContinuousPlayerPropertyEffect,
  GrandArchiveContinuousPlayerStateEffect,
  GrandArchivePlayerState,
} from "@tcg/grand-archive-types";
import {
  grandArchiveAbilityExecutionObject,
  grandArchiveAbilityIsFunctional,
  grandArchiveObjectFace,
} from "../../game/card-runtime.ts";
import { grandArchiveContinuousEffectIsActive, grandArchiveObjectTimestamp } from "./continuous.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  resolveGrandArchivePlayers,
  withGrandArchiveDerivedVariables,
  type GrandArchiveEvaluationContext,
} from "../../procedures/effects/evaluation.ts";
import type { GrandArchivePlayerId } from "../../game/identity.ts";
import { grandArchiveObjectActiveAbilities } from "../abilities/intrinsic-keywords.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";

interface PlayerStateModifier {
  readonly value: boolean;
  readonly timestamp: number;
  readonly order: number;
}

interface PlayerPropertyModifier {
  readonly effect: GrandArchiveContinuousPlayerPropertyEffect;
  readonly evaluation: GrandArchiveEvaluationContext;
  readonly timestamp: number;
  readonly order: number;
}

function statesEqual(left: GrandArchivePlayerState, right: GrandArchivePlayerState): boolean {
  if (typeof left === "string" || typeof right === "string") return left === right;
  if ("kind" in left || "kind" in right) return "kind" in left && "kind" in right;
  return (
    playerStateName(left.named) === playerStateName(right.named) &&
    (left.value === undefined || right.value === undefined
      ? left.value === right.value
      : playerStateName(left.value) === playerStateName(right.value))
  );
}

function playerStateName(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}

export function grandArchivePlayerStateStorageKey(state: GrandArchivePlayerState): string {
  if (typeof state === "string") return state;
  if ("kind" in state) return state.kind;
  const name = playerStateName(state.named);
  return state.value === undefined ? name : `${name}:${playerStateName(state.value)}`;
}

function basePlayerHasState(
  states: Readonly<Record<string, string | number | boolean>>,
  state: GrandArchivePlayerState,
): boolean {
  if (typeof state === "string" || "kind" in state) {
    return states[grandArchivePlayerStateStorageKey(state)] === true;
  }
  const name = playerStateName(state.named);
  if (state.value === undefined) return states[name] === true;
  const value = playerStateName(state.value);
  const stored = states[name];
  return (
    (typeof stored === "string" && playerStateName(stored) === value) ||
    states[`${name}:${value}`] === true
  );
}

function playerEffects(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  derivationContext: Pick<GrandArchiveEvaluationContext, "derivingProperties"> = {},
): readonly {
  readonly effect:
    | GrandArchiveContinuousPlayerStateEffect
    | GrandArchiveContinuousPlayerPropertyEffect;
  readonly evaluation: GrandArchiveEvaluationContext;
  readonly timestamp: number;
  readonly order: number;
}[] {
  const effects: {
    effect: GrandArchiveContinuousPlayerStateEffect | GrandArchiveContinuousPlayerPropertyEffect;
    evaluation: GrandArchiveEvaluationContext;
    timestamp: number;
    order: number;
  }[] = [];
  let order = 0;
  for (const source of Object.values(state.objects)) {
    const face = grandArchiveObjectFace(program, source);
    for (const ability of grandArchiveObjectActiveAbilities(
      program,
      state,
      source,
      derivationContext,
    )) {
      if (ability.kind !== "static" || ability.staticKind !== "effects") continue;
      const executionObject = grandArchiveAbilityExecutionObject(state, source, ability);
      if (!executionObject) continue;
      const evaluation = withGrandArchiveDerivedVariables(ability.variables, {
        program,
        state,
        controllerId: executionObject.controllerId,
        sourceId: executionObject.id,
        abilityBearerId: executionObject.id,
        bindings: {},
        ...derivationContext,
      });
      if (
        !grandArchiveAbilityIsFunctional(face, ability, source) ||
        ability.restrictions?.some(
          (restriction) =>
            restriction.kind === "static" &&
            !evaluateGrandArchiveCondition(restriction.condition, evaluation),
        ) ||
        (ability.condition && !evaluateGrandArchiveCondition(ability.condition, evaluation))
      ) {
        continue;
      }
      for (const effect of ability.effects) {
        if (
          (effect.kind !== "continuous-player-state" &&
            effect.kind !== "continuous-player-property") ||
          effect.duration.kind !== "while-source-in-functional-zone"
        ) {
          continue;
        }
        effects.push({
          effect,
          evaluation,
          timestamp: grandArchiveObjectTimestamp(source, evaluation),
          order: order++,
        });
      }
    }
  }
  for (const instance of state.continuousEffects) {
    if (
      instance.effect.kind !== "continuous-player-state" &&
      instance.effect.kind !== "continuous-player-property"
    ) {
      continue;
    }
    const evaluation: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: instance.controllerId,
      ...continuousEffectSourceContext(instance),
      bindings: instance.bindings,
      variables: instance.variables,
      ...derivationContext,
    };
    if (!grandArchiveContinuousEffectIsActive(instance, evaluation)) continue;
    effects.push({
      effect: instance.effect,
      evaluation,
      timestamp: instance.createdAtVersion,
      order: order++,
    });
  }
  return effects.sort(
    (left, right) => left.timestamp - right.timestamp || left.order - right.order,
  );
}

/** Derives a player state after all active continuous effects in timestamp order. */
export function grandArchivePlayerHasState(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  playerState: GrandArchivePlayerState,
  derivationContext: Pick<GrandArchiveEvaluationContext, "derivingProperties"> = {},
): boolean {
  const player = state.players[playerId];
  if (!player) return false;
  let value = basePlayerHasState(player.states, playerState);
  const derivationKey = `${playerId}:player-state:${grandArchivePlayerStateStorageKey(playerState)}`;
  if (derivationContext.derivingProperties?.has(derivationKey)) return value;
  const derivingProperties = new Set(derivationContext.derivingProperties ?? []).add(derivationKey);
  const modifiers: PlayerStateModifier[] = [];
  for (const entry of playerEffects(program, state, { derivingProperties })) {
    if (
      entry.effect.kind === "continuous-player-state" &&
      statesEqual(entry.effect.state, playerState) &&
      resolveGrandArchivePlayers(entry.effect.players, entry.evaluation).includes(playerId)
    ) {
      modifiers.push({ value: entry.effect.value, timestamp: entry.timestamp, order: entry.order });
    }
  }
  for (const modifier of modifiers) value = modifier.value;
  return value;
}

/** Derives a continuously modified player property; undefined means no limit is active. */
export function deriveGrandArchiveContinuousPlayerProperty(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  property: "maximum-influence",
): number | undefined {
  const modifiers: PlayerPropertyModifier[] = playerEffects(program, state).flatMap((entry) =>
    entry.effect.kind === "continuous-player-property" &&
    entry.effect.property === property &&
    resolveGrandArchivePlayers(entry.effect.players, entry.evaluation).includes(playerId)
      ? [
          {
            effect: entry.effect,
            evaluation: entry.evaluation,
            timestamp: entry.timestamp,
            order: entry.order,
          },
        ]
      : [],
  );
  let value: number | undefined;
  // Continuous Effects — Layers 2.2.1 and 2.2.5: setters establish the Layer A
  // base before Layer E increases and decreases, regardless of timestamp. The
  // timestamp order already established by playerEffects remains authoritative
  // within each layer, so the newest mutually-exclusive setter wins.
  const layeredModifiers = [
    ...modifiers.filter((modifier) => modifier.effect.operation === "set"),
    ...modifiers.filter((modifier) => modifier.effect.operation !== "set"),
  ];
  for (const modifier of layeredModifiers) {
    const amount = evaluateGrandArchiveAmount(modifier.effect.amount, modifier.evaluation);
    if (modifier.effect.operation === "set") value = amount;
    else if (modifier.effect.operation === "add") value = (value ?? 0) + amount;
    else value = (value ?? 0) - amount;
  }
  return value === undefined ? undefined : Math.max(0, value);
}
