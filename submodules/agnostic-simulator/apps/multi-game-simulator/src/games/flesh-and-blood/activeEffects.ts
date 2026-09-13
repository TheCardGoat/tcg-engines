import type {
  FabViewerEffect,
  FabViewerEffectExpiry,
  FabViewerEffectFilter,
  FabViewerEffectImpact,
} from "@tcg/flesh-and-blood-engine/simulator";
import type { SimulatorActiveEffect } from "@tcg/simulator-contract";

import type { FabPresentationEffect, FabPresentationState } from "./state";

export interface FabBoardEffectGroups {
  readonly self: readonly FabPresentationEffect[];
  readonly opponent: readonly FabPresentationEffect[];
  readonly game: readonly FabPresentationEffect[];
  readonly all: readonly FabPresentationEffect[];
  /** Distinct player/game effects; an effect may legitimately affect both seats. */
  readonly count: number;
}

export function groupFabBoardEffects(
  state: Pick<FabPresentationState, "activeEffects">,
  selfId: string,
  opponentId: string,
): FabBoardEffectGroups {
  const all = state.activeEffects ?? [];
  const game = gameEffects(state);
  const gameIds = new Set(game.map((effect) => effect.id));
  const self = effectsForPlayer(state, selfId).filter((effect) => !gameIds.has(effect.id));
  const opponent = effectsForPlayer(state, opponentId).filter((effect) => !gameIds.has(effect.id));
  const distinctIds = new Set([...self, ...opponent, ...game].map((effect) => effect.id));

  return {
    self,
    opponent,
    game,
    all,
    count: distinctIds.size,
  };
}

export function projectFabPresentationEffect(effect: FabViewerEffect): FabPresentationEffect {
  const primary = effect.impacts[0] ?? {
    kind: "unclassified" as const,
    engineKind: effect.origin.kind,
  };
  const target = effect.appliesTo ? filterLabel(effect.appliesTo) : null;
  const sourceLabel = effect.source.name ?? "Hidden source";
  const label = impactLabel(primary, sourceLabel);
  const durationLabel = expiryLabel(effect.expiresAt);
  return {
    id: effect.id,
    controllerId: effect.controllerId,
    ...(effect.source.instanceId ? { sourceEntityId: effect.source.instanceId } : {}),
    ...(effect.source.canonicalId ? { sourceCanonicalId: effect.source.canonicalId } : {}),
    sourceLabel,
    label,
    detail: impactDetail(primary, target, effect.status, sourceLabel),
    tone: impactTone(primary),
    durationLabel,
    status: effect.status,
    remainingUses: effect.remainingUses,
    scopes: effect.scopes,
  };
}

export function effectsForPlayer(
  state: Pick<FabPresentationState, "activeEffects">,
  playerId: string,
): readonly FabPresentationEffect[] {
  return (state.activeEffects ?? []).filter((effect) =>
    effect.scopes.some(
      (scope) =>
        (scope.kind === "player" || scope.kind === "future-object") && scope.playerId === playerId,
    ),
  );
}

export function effectsForEntity(
  state: Pick<FabPresentationState, "activeEffects">,
  instanceId: string,
): readonly FabPresentationEffect[] {
  return (state.activeEffects ?? []).filter((effect) =>
    effect.scopes.some((scope) => scope.kind === "object" && scope.instanceId === instanceId),
  );
}

export function gameEffects(
  state: Pick<FabPresentationState, "activeEffects">,
): readonly FabPresentationEffect[] {
  return (state.activeEffects ?? []).filter((effect) =>
    effect.scopes.some((scope) => scope.kind === "game"),
  );
}

export function toSimulatorActiveEffect(
  effect: FabPresentationEffect,
  target: { readonly kind: "seat" | "entity"; readonly id: string },
): SimulatorActiveEffect {
  return {
    id: effect.id,
    targetKind: target.kind,
    targetId: target.id,
    sourceEntityId: effect.sourceEntityId,
    sourceLabel: effect.sourceLabel,
    label: effect.label,
    detail: effect.detail,
    tone: effect.tone,
    durationLabel: effect.durationLabel,
    kind: effect.status,
  };
}

function impactLabel(impact: FabViewerEffectImpact, sourceLabel: string): string {
  switch (impact.kind) {
    case "numeric": {
      const property = propertyLabel(impact.property);
      if (impact.amount === null) return `${property} modified`;
      const signed =
        impact.operation === "subtract"
          ? `−${impact.amount}`
          : impact.operation === "add"
            ? `+${impact.amount}`
            : `${impact.amount}`;
      return `${property} ${signed}`;
    }
    case "property":
      return `${impact.operation === "grant" ? "Gains" : "Loses"} ${impact.value ?? impact.property}`;
    case "rule":
      if (impact.action === "be-prevented" && impact.mode === "restrict") {
        return "Damage can't be prevented";
      }
      if (impact.action === "play" && impact.mode === "allow" && sourceLabel !== "Hidden source") {
        return `${sourceLabel} available`;
      }
      return `${capitalize(impact.mode)} ${humanize(impact.action)}`;
    case "controller":
      return "Control changed";
    case "delayed-trigger":
      return "Waiting trigger";
    case "replacement":
      return impact.subtype === "prevention" ? "Damage prevention" : "Replacement effect";
    case "unclassified":
      return "Active rules effect";
  }
}

function impactDetail(
  impact: FabViewerEffectImpact,
  target: string | null,
  status: FabPresentationEffect["status"],
  sourceLabel: string,
): string {
  if (impact.kind === "numeric" && target) {
    const amount = impact.amount;
    const change =
      amount === null
        ? `${propertyLabel(impact.property).toLocaleLowerCase()} is modified`
        : impact.operation === "subtract"
          ? impact.property === "cost"
            ? `costs ${amount} less`
            : `gets −${amount} ${propertyLabel(impact.property).toLocaleLowerCase()}`
          : impact.operation === "add"
            ? `gets +${amount} ${propertyLabel(impact.property).toLocaleLowerCase()}`
            : `has ${propertyLabel(impact.property).toLocaleLowerCase()} ${amount}`;
    return `${status === "armed" ? "Your next" : "This"} ${target} ${change}. Source: ${sourceLabel}.`;
  }
  if (impact.kind === "delayed-trigger") {
    const event = impact.event ? ` ${humanize(impact.event)}` : " its matching event";
    return `Triggers on${event}. Source: ${sourceLabel}.`;
  }
  if (impact.kind === "replacement") {
    return `${impact.subtype === "prevention" ? "Prevents or modifies matching damage" : "Replaces a matching event"}. Source: ${sourceLabel}.`;
  }
  if (impact.kind === "rule") {
    if (impact.action === "be-prevented" && impact.mode === "restrict") {
      return `Damage that would be dealt by ${sourceLabel} can't be prevented.`;
    }
    if (impact.action === "play" && impact.mode === "allow") {
      return `${sourceLabel} can be played or activated while its condition is met.`;
    }
  }
  return `${impactLabel(impact, sourceLabel)}. Source: ${sourceLabel}.`;
}

function impactTone(impact: FabViewerEffectImpact): FabPresentationEffect["tone"] {
  if (impact.kind === "rule") return impact.mode === "restrict" ? "debuff" : "buff";
  if (impact.kind === "numeric") {
    if (impact.property === "cost") return impact.operation === "subtract" ? "buff" : "debuff";
    return impact.operation === "subtract"
      ? "debuff"
      : impact.operation === "add"
        ? "buff"
        : "neutral";
  }
  if (impact.kind === "property") return impact.operation === "grant" ? "buff" : "debuff";
  if (impact.kind === "replacement" && impact.subtype === "prevention") return "buff";
  return "neutral";
}

function expiryLabel(expiry: FabViewerEffectExpiry): string {
  switch (expiry.kind) {
    case "turn":
      return "This turn";
    case "phase":
      return `Through ${humanize(expiry.phase)} phase`;
    case "combat-chain":
      return "This combat chain";
    case "source":
      return "While source remains";
    case "player-turn-start":
      return "Until that player's next turn";
    case "player-turn-end":
      return "Through that player's next turn";
    case "player-action-phase":
      return "During that player's action phase";
    case "player-end-phase":
      return "During that player's end phase";
    case "player-next-clash":
      return "Until that player's next clash";
    case "permanent":
      return "While active";
  }
}

function filterLabel(filter: FabViewerEffectFilter): string {
  if (filter.names.length === 1) return filter.names[0]!;
  const qualifiers = [...filter.supertypes, ...filter.traits];
  const attackAction = filter.subtypes.includes("Attack") && filter.types.includes("Action");
  if (attackAction) qualifiers.push("attack action");
  else qualifiers.push(...filter.subtypes.map((value) => value.toLocaleLowerCase()));
  qualifiers.push(
    ...filter.types
      .filter((value) => !(attackAction && value === "Action"))
      .map((value) => value.toLocaleLowerCase()),
  );
  return `${qualifiers.join(" ") || "matching"} card`;
}

function propertyLabel(property: string): string {
  return property === "defense" ? "Defense" : capitalize(humanize(property));
}

function humanize(value: string): string {
  return value.replaceAll("-", " ");
}

function capitalize(value: string): string {
  return value ? value[0]!.toLocaleUpperCase() + value.slice(1) : value;
}
