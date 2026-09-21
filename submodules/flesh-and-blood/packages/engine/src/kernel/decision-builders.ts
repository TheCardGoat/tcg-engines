import type { FabMatchState } from "../state.ts";
import type { FabDecision } from "../rules/process.ts";
import type { FabTargetCandidate } from "./trigger-declaration.ts";

type EntityTargetContinuation = Extract<
  FabDecision,
  { readonly kind: "entity-target" }
>["continuation"];
type BooleanContinuation = Extract<FabDecision, { readonly kind: "boolean" }>["continuation"];

/**
 * The only constructor for an entity-target prompt. Callers supply candidates
 * from their rules-view lookup; this builder owns counter/version metadata and
 * clamps the selected range to exactly those legal candidates.
 */
export function createFabEntityTargetDecision(
  state: FabMatchState,
  input: {
    readonly actorId: string;
    readonly label: string;
    readonly requestedCount: number;
    readonly upTo: boolean;
    readonly candidates: readonly FabTargetCandidate[];
    readonly continuation: EntityTargetContinuation;
    readonly differentNames?: boolean;
    readonly source?: {
      readonly instanceId: string;
      readonly canonicalId?: string;
      readonly ownerId: string;
    };
  },
): Extract<FabDecision, { readonly kind: "entity-target" }> {
  state.counters.decision += 1;
  const maximum = Math.min(input.requestedCount, input.candidates.length);
  return {
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    actorId: input.actorId,
    kind: "entity-target",
    label: input.label,
    min: input.upTo ? 0 : maximum,
    max: maximum,
    candidates: input.candidates,
    continuation: input.continuation,
    ...(input.differentNames ? { differentNames: true } : {}),
    ...(input.source ? { source: input.source } : {}),
  };
}

/** Preserve a rules procedure's exact required/up-to target bounds. */
export function createFabExactEntityTargetDecision(
  state: FabMatchState,
  input: Omit<
    Extract<FabDecision, { readonly kind: "entity-target" }>,
    "decisionId" | "stateVersion" | "kind"
  >,
): Extract<FabDecision, { readonly kind: "entity-target" }> {
  state.counters.decision += 1;
  return {
    ...input,
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    kind: "entity-target",
  };
}

/** The only constructor for yes/no effect prompts and their fail-closed metadata. */
export function createFabOptionalDecision(
  state: FabMatchState,
  input: {
    readonly actorId: string;
    readonly label: string;
    /** Native labels describe the permission when its consequence is unambiguous. */
    readonly acceptLabel?: string;
    readonly declineLabel?: string;
    readonly source?: {
      readonly instanceId: string;
      readonly canonicalId?: string;
      readonly ownerId: string;
    };
    readonly continuation: BooleanContinuation;
  },
): Extract<FabDecision, { readonly kind: "boolean" }> {
  state.counters.decision += 1;
  return {
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    actorId: input.actorId,
    kind: "boolean",
    label: input.label,
    acceptLabel: input.acceptLabel ?? "Use effect",
    declineLabel: input.declineLabel ?? "Decline",
    ...(input.source ? { source: input.source } : {}),
    continuation: input.continuation,
  };
}

export function createFabEffectResolutionDecision(
  state: FabMatchState,
  input: Omit<
    Extract<FabDecision, { readonly kind: "effect-resolution" }>,
    "decisionId" | "stateVersion" | "kind"
  >,
): Extract<FabDecision, { readonly kind: "effect-resolution" }> {
  state.counters.decision += 1;
  return {
    ...input,
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    kind: "effect-resolution",
  };
}

export function createFabPartitionDecision(
  state: FabMatchState,
  input: Omit<
    Extract<FabDecision, { readonly kind: "partition" }>,
    "decisionId" | "stateVersion" | "kind"
  >,
): Extract<FabDecision, { readonly kind: "partition" }> {
  state.counters.decision += 1;
  return {
    ...input,
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    kind: "partition",
  };
}

export function createFabOptionDecision(
  state: FabMatchState,
  input: Omit<
    Extract<FabDecision, { readonly kind: "option" }>,
    "decisionId" | "stateVersion" | "kind"
  >,
): Extract<FabDecision, { readonly kind: "option" }> {
  state.counters.decision += 1;
  return {
    ...input,
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    kind: "option",
  };
}

export function createFabOrderingDecision(
  state: FabMatchState,
  input: Omit<
    Extract<FabDecision, { readonly kind: "ordering" }>,
    "decisionId" | "stateVersion" | "kind"
  >,
): Extract<FabDecision, { readonly kind: "ordering" }> {
  state.counters.decision += 1;
  return {
    ...input,
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    kind: "ordering",
  };
}

export function createFabGroupChoiceDecision(
  state: FabMatchState,
  input: Omit<
    Extract<FabDecision, { readonly kind: "group-choice" }>,
    "decisionId" | "stateVersion" | "kind"
  >,
): Extract<FabDecision, { readonly kind: "group-choice" }> {
  state.counters.decision += 1;
  return {
    ...input,
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    kind: "group-choice",
  };
}

export function createFabNumericDecision(
  state: FabMatchState,
  input: Omit<
    Extract<FabDecision, { readonly kind: "numeric" }>,
    "decisionId" | "stateVersion" | "kind"
  >,
): Extract<FabDecision, { readonly kind: "numeric" }> {
  state.counters.decision += 1;
  return {
    ...input,
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    kind: "numeric",
  };
}

export function createFabPaymentDecision(
  state: FabMatchState,
  input: Omit<
    Extract<FabDecision, { readonly kind: "payment" }>,
    "decisionId" | "stateVersion" | "kind"
  >,
): Extract<FabDecision, { readonly kind: "payment" }> {
  state.counters.decision += 1;
  return {
    ...input,
    decisionId: `decision-${state.counters.decision}`,
    stateVersion: state.stateID,
    kind: "payment",
  };
}
