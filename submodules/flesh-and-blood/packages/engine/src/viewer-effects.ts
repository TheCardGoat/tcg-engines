import type { FabCardFilter, FabNumericProperty } from "@tcg/flesh-and-blood-types";

import type { FabRulesSnapshot } from "./kernel/transaction-kernel.ts";
import type { FabObjectSnapshot } from "./rules/events.ts";
import type { FabContinuousAtom, FabRulesSubjectRef } from "./rules/continuous/ir.ts";
import type { FabDelayedTriggerExpiry, FabPersistedReplacement } from "./rules/process.ts";
import type { FabViewer } from "./view.ts";
import { delayedTriggerIsActive } from "./rules/delayed-trigger-lifecycle.ts";
import { buildFabRulesView } from "./rules/state-rules-view.ts";
import type { FabRulesView } from "./rules/rules-view.ts";

export interface FabViewerEffectSource {
  /** Current, viewer-visible physical card only; null for a historical source. */
  readonly instanceId: string | null;
  /** Publicly disclosed historical identity, independent of the live card. */
  readonly canonicalId: string | null;
  readonly name: string | null;
}

export type FabViewerEffectOrigin =
  | { readonly kind: "continuous"; readonly source: "layer" | "static" | "resolution-window" }
  | { readonly kind: "delayed-trigger" }
  | {
      readonly kind: "replacement";
      readonly subtype: "standard" | "prevention";
    };

export type FabViewerEffectScope =
  | { readonly kind: "player"; readonly playerId: string }
  | { readonly kind: "object"; readonly instanceId: string }
  | { readonly kind: "future-object"; readonly playerId: string }
  | { readonly kind: "game" };

export type FabViewerEffectExpiry =
  | { readonly kind: "turn"; readonly turnNumber: number }
  | { readonly kind: "phase"; readonly turnNumber: number; readonly phase: string }
  | { readonly kind: "combat-chain"; readonly combatNumber: number }
  | { readonly kind: "source"; readonly instanceId: string }
  | { readonly kind: "player-turn-start"; readonly playerId: string }
  | { readonly kind: "player-turn-end"; readonly playerId: string }
  | { readonly kind: "player-action-phase"; readonly playerId: string }
  | { readonly kind: "player-end-phase"; readonly playerId: string }
  | {
      readonly kind: "player-next-clash";
      readonly playerId: string;
      readonly turnNumber: number;
    }
  | { readonly kind: "permanent" };

export interface FabViewerEffectFilter {
  readonly names: readonly string[];
  readonly supertypes: readonly string[];
  readonly types: readonly string[];
  readonly subtypes: readonly string[];
  readonly traits: readonly string[];
  readonly hasAdditionalConstraints: boolean;
}

export type FabViewerEffectImpact =
  | {
      readonly kind: "numeric";
      readonly property: FabNumericProperty;
      readonly operation: "add" | "subtract" | "set" | "multiply" | "divide" | "other";
      readonly amount: number | null;
    }
  | {
      readonly kind: "rule";
      readonly mode: "restrict" | "require" | "allow" | "amplify";
      readonly action: string;
    }
  | {
      readonly kind: "property";
      readonly property: "keyword" | "type" | "subtype" | "supertype" | "name" | "color";
      readonly operation: "grant" | "remove";
      readonly value: string | null;
    }
  | { readonly kind: "controller" }
  | { readonly kind: "delayed-trigger"; readonly event: string | null }
  | { readonly kind: "replacement"; readonly subtype: "standard" | "prevention" }
  | { readonly kind: "unclassified"; readonly engineKind: string };

export interface FabViewerEffect {
  readonly id: string;
  readonly controllerId: string;
  readonly source: FabViewerEffectSource;
  readonly origin: FabViewerEffectOrigin;
  readonly scopes: readonly FabViewerEffectScope[];
  readonly status: "armed" | "applying";
  readonly expiresAt: FabViewerEffectExpiry;
  readonly remainingUses: number | null;
  readonly appliesTo: FabViewerEffectFilter | null;
  readonly impacts: readonly FabViewerEffectImpact[];
}

/**
 * Public, semantic effect projection. Raw rules atoms, bindings, filters, and
 * private source identities never cross the viewer boundary.
 */
export function projectFabViewerEffects(
  state: FabRulesSnapshot,
  viewer: FabViewer,
): readonly FabViewerEffect[] {
  const rulesView = buildFabRulesView(state);
  return [
    ...state.continuousEffectInstances.flatMap((effect) => {
      const source = projectSource(state, rulesView, effect.source, viewer);
      // Hiding only the name still leaks a private static ability through its
      // effect count, filters, and modifiers. Undisclosed effects stay private.
      if (!source) return [];
      const future = effect.futureApplicability;
      const scopes = continuousScopes(
        effect.controllerId,
        effect.initialSubjects,
        effect.applications,
        future,
      );
      const relevant =
        effect.origin === "layer" ||
        future !== null ||
        scopes.length > 0 ||
        effect.atoms.some((atom) => atom.kind === "rule");
      if (!relevant) return [];
      return [
        {
          id: effect.effectId,
          controllerId: effect.controllerId,
          source,
          origin: { kind: "continuous" as const, source: effect.origin },
          scopes:
            scopes.length > 0
              ? scopes
              : [{ kind: "player" as const, playerId: effect.controllerId }],
          status:
            future && future.remaining > 0 && future.latchedSubjects.length === 0
              ? ("armed" as const)
              : ("applying" as const),
          expiresAt: continuousExpiry(effect.expiresAt),
          remainingUses: future?.remaining ?? null,
          appliesTo: future ? projectFilter(future.filter) : null,
          impacts: effect.atoms.map(projectContinuousImpact),
        },
      ];
    }),
    ...state.delayedTriggers.flatMap((effect): readonly FabViewerEffect[] => {
      if (!delayedTriggerIsActive(state, effect.policy)) return [];
      const source = projectSource(state, rulesView, effect.source, viewer);
      if (!source) return [];
      return [
        {
          id: effect.delayedTriggerId,
          controllerId: effect.controllerId,
          source,
          origin: { kind: "delayed-trigger" },
          scopes: [{ kind: "player", playerId: effect.controllerId }],
          status: "armed",
          expiresAt: delayedExpiry(effect.policy.expiresAt),
          remainingUses: effect.policy.matching === "first" ? 1 : null,
          appliesTo: null,
          impacts: [
            {
              kind: "delayed-trigger",
              event: delayedTriggerEventLabel(
                effect.trigger.kind === "state"
                  ? undefined
                  : "patterns" in effect.trigger.event
                    ? effect.trigger.event.patterns.map((pattern) => pattern.name)
                    : effect.trigger.event.name,
              ),
            },
          ],
        },
      ];
    }),
    ...state.replacementEffects.flatMap((effect) => {
      const source = projectSource(state, rulesView, effect.source, viewer);
      return source ? [projectReplacement(effect, source)] : [];
    }),
  ];
}

function continuousScopes(
  controllerId: string,
  initialSubjects: readonly { readonly instanceId: string }[],
  applications: readonly { readonly subject: FabRulesSubjectRef }[],
  future: {
    readonly remaining: number;
    readonly latchedSubjects: readonly { readonly instanceId: string }[];
  } | null,
): FabViewerEffectScope[] {
  const scopes: FabViewerEffectScope[] = [];
  for (const application of applications) scopes.push(scopeForSubject(application.subject));
  for (const subject of initialSubjects)
    scopes.push({ kind: "object", instanceId: subject.instanceId });
  for (const subject of future?.latchedSubjects ?? []) {
    scopes.push({ kind: "object", instanceId: subject.instanceId });
  }
  if (future && future.remaining > 0)
    scopes.push({ kind: "future-object", playerId: controllerId });
  return deduplicateScopes(scopes);
}

function scopeForSubject(subject: FabRulesSubjectRef): FabViewerEffectScope {
  switch (subject.kind) {
    case "object":
      return { kind: "object", instanceId: subject.ref.instanceId };
    case "player":
      return { kind: "player", playerId: subject.playerId };
    case "game":
      return { kind: "game" };
  }
}

function deduplicateScopes(scopes: readonly FabViewerEffectScope[]): FabViewerEffectScope[] {
  const seen = new Set<string>();
  return scopes.filter((scope) => {
    const key =
      scope.kind === "game"
        ? "game"
        : `${scope.kind}:${scope.kind === "object" ? scope.instanceId : scope.playerId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function projectSource(
  state: FabRulesSnapshot,
  rulesView: FabRulesView,
  source: FabObjectSnapshot,
  viewer: FabViewer,
): FabViewerEffectSource | null {
  const record = state.objects[source.instanceId];
  const current = record
    ? rulesView.object({ instanceId: record.instanceId, incarnation: record.incarnation })
    : null;
  const canIdentifyCurrent =
    current?.visibility === "public" && current.canonicalId === source.canonicalId;
  const visible =
    source.visibility === "public" ||
    canIdentifyCurrent ||
    (source.zone !== "deck" &&
      viewer.role === "player" &&
      (viewer.actorId === source.ownerId || viewer.actorId === source.controllerId));
  if (!visible) return null;

  return {
    instanceId: canIdentifyCurrent ? source.instanceId : null,
    canonicalId: source.canonicalId,
    name: source.current.names.join(" // ") || null,
  };
}

function continuousExpiry(
  expiry: FabRulesSnapshot["continuousEffectInstances"][number]["expiresAt"],
): FabViewerEffectExpiry {
  switch (expiry.kind) {
    case "turn":
      return { kind: "turn", turnNumber: expiry.turnNumber };
    case "player-turn-start":
      return { kind: "player-turn-start", playerId: expiry.playerId };
    case "player-turn-end":
      return { kind: "player-turn-end", playerId: expiry.playerId };
    case "player-action-phase-window":
      return { kind: "player-action-phase", playerId: expiry.playerId };
    case "player-end-phase-window":
      return { kind: "player-end-phase", playerId: expiry.playerId };
    case "combat-chain":
      return { kind: "combat-chain", combatNumber: expiry.combatNumber };
    case "source":
      return { kind: "source", instanceId: expiry.ref.instanceId };
    case "permanent":
      return { kind: "permanent" };
  }
}

function delayedExpiry(expiry: FabDelayedTriggerExpiry): FabViewerEffectExpiry {
  switch (expiry.kind) {
    case "turn":
      return { kind: "turn", turnNumber: expiry.turnNumber };
    case "phase":
      return { kind: "phase", turnNumber: expiry.turnNumber, phase: expiry.phase };
    case "combat-chain":
      return { kind: "combat-chain", combatNumber: expiry.combatNumber };
    case "player-turn-start":
      return { kind: "player-turn-start", playerId: expiry.playerId };
    case "player-turn-end":
      return { kind: "player-turn-end", playerId: expiry.playerId };
    case "player-action-phase-window":
      return { kind: "player-action-phase", playerId: expiry.playerId };
    case "player-end-phase-window":
      return { kind: "player-end-phase", playerId: expiry.playerId };
    case "player-next-clash":
      return {
        kind: "player-next-clash",
        playerId: expiry.playerId,
        turnNumber: expiry.turnNumber,
      };
    case "source":
      return { kind: "source", instanceId: expiry.ref.instanceId };
  }
}

function replacementExpiry(expiry: FabPersistedReplacement["expiresAt"]): FabViewerEffectExpiry {
  switch (expiry.kind) {
    case "turn":
      return { kind: "turn", turnNumber: expiry.turnNumber };
    case "phase":
      return { kind: "phase", turnNumber: expiry.turnNumber, phase: expiry.phase };
    case "combat-chain":
      return { kind: "combat-chain", combatNumber: expiry.combatNumber };
    case "source":
      return { kind: "source", instanceId: expiry.instanceId };
    case "permanent":
      return { kind: "permanent" };
  }
}

function projectReplacement(
  effect: FabPersistedReplacement,
  source: FabViewerEffectSource,
): FabViewerEffect {
  const subtype = effect.effect.type === "prevention" ? "prevention" : "standard";
  return {
    id: effect.replacementId,
    controllerId: effect.controllerId,
    source,
    origin: { kind: "replacement", subtype },
    scopes: [
      {
        kind: "player",
        playerId: effect.shieldedPlayerId ?? effect.redirectPlayerId ?? effect.controllerId,
      },
    ],
    status: "armed",
    expiresAt: replacementExpiry(effect.expiresAt),
    // Replacement consumption does not imply a single remaining use. Damage
    // prevention can consume a numeric shield over several events, and the
    // persisted replacement currently exposes no universal remaining-use
    // count. Keep the viewer contract honest until each subtype can project
    // its own budget.
    remainingUses: null,
    appliesTo: null,
    impacts: [{ kind: "replacement", subtype }],
  };
}

function projectContinuousImpact(atom: FabContinuousAtom): FabViewerEffectImpact {
  switch (atom.kind) {
    case "numeric":
    case "base-numeric":
      return {
        kind: "numeric",
        property: atom.property,
        operation:
          atom.operation === "add" ||
          atom.operation === "subtract" ||
          atom.operation === "set" ||
          atom.operation === "multiply" ||
          atom.operation === "divide"
            ? atom.operation
            : "other",
        amount: typeof atom.amount === "number" ? atom.amount : null,
      };
    case "activation-cost":
      return {
        kind: "numeric",
        property: "cost",
        operation: atom.operation,
        amount: typeof atom.amount === "number" ? atom.amount : null,
      };
    case "rule":
      return { kind: "rule", mode: atom.mode, action: atom.action };
    case "controller":
      return { kind: "controller" };
    case "identity":
    case "type":
    case "supertype":
      return {
        kind: "property",
        property: atom.property.kind,
        operation: atom.operation,
        value: "value" in atom.property ? atom.property.value : null,
      };
    case "ability":
      return atom.property.kind === "keyword"
        ? {
            kind: "property",
            property: "keyword",
            operation: atom.operation,
            value: atom.property.keyword.name,
          }
        : { kind: "unclassified", engineKind: atom.kind };
    case "copy":
    case "become":
    case "copy-abilities":
      return { kind: "unclassified", engineKind: atom.kind };
  }
}

function delayedTriggerEventLabel(
  event: string | readonly string[] | null | undefined,
): string | null {
  if (typeof event === "string") return event;
  return event?.join(" or ") ?? null;
}

function projectFilter(filter: FabCardFilter): FabViewerEffectFilter {
  const names = new Set<string>();
  const supertypes = new Set<string>();
  const types = new Set<string>();
  const subtypes = new Set<string>();
  const traits = new Set<string>();
  let hasAdditionalConstraints = false;

  const visit = (candidate: FabCardFilter) => {
    if (candidate.name) names.add(candidate.name);
    for (const value of candidate.typeBox?.supertypes ?? []) supertypes.add(value);
    for (const value of candidate.typeBox?.types ?? []) types.add(value);
    for (const value of candidate.typeBox?.subtypes ?? []) subtypes.add(value);
    for (const value of candidate.typeBox?.traits ?? []) traits.add(value);
    for (const child of candidate.and ?? []) visit(child);
    if ((candidate.or?.length ?? 0) > 0) hasAdditionalConstraints = true;
    for (const child of candidate.or ?? []) visit(child);
    const summarizedKeys = new Set(["name", "typeBox", "and", "or"]);
    if (Object.keys(candidate).some((key) => !summarizedKeys.has(key)))
      hasAdditionalConstraints = true;
    if (candidate.typeBox) {
      const summarizedTypeBoxKeys = new Set(["supertypes", "types", "subtypes", "traits"]);
      if (Object.keys(candidate.typeBox).some((key) => !summarizedTypeBoxKeys.has(key))) {
        hasAdditionalConstraints = true;
      }
    }
  };
  visit(filter);

  return {
    names: [...names],
    supertypes: [...supertypes],
    types: [...types],
    subtypes: [...subtypes],
    traits: [...traits],
    hasAdditionalConstraints,
  };
}
