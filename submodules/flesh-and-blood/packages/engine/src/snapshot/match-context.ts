import { type FabCardDefinitionInput, type FabRegisteredCardDefinition } from "../cards.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";
import {
  FAB_MATCH_SCHEMA_VERSION,
  type FabAutomationPreferences,
  type FabMatchState,
} from "../state.ts";
import { compileFabMatchProgram, type FabMatchProgram } from "../match-program.ts";
import type {
  FabAttackProxyRecord,
  FabCounterRecord,
  FabLkiId,
  FabMoveLkiSnapshot,
  FabObjectMarker,
  FabObjectRecord,
} from "../game/objects.ts";
import {
  fabAttackProxyId,
  fabCanonicalCardId,
  fabObjectInstanceId,
  fabPlayerId,
} from "../game/identity.ts";
import type { FabChainLink, FabCombatState, FabLastClosedCombat } from "../game/combat.ts";
import type { FabPlayerId } from "../game/identity.ts";
import type { FabZoneRef } from "../game/zones.ts";
import {
  createFabContainerModel,
  createFabRuntimeContainers,
  FAB_ZONE_KINDS,
  type FabContainerModel,
} from "../game/zones.ts";
import type { FabBanishReturnEntry, FabHistoryIndex } from "../state.ts";
import { emptyFabTurnHistory, type FabTurnHistory } from "../game/turn-history.ts";
import type { FabRulesAssets } from "../game/assets.ts";
import type { FabPriorityWindow } from "../priority.ts";
import type { FabPhase } from "../game/turn.ts";
import type { FabPrngState } from "../random.ts";
import type {
  FabDecision,
  FabDelayedTrigger,
  FabDeterministicCounters,
  FabPersistedReplacement,
  FabRulesProcess,
} from "../rules/process.ts";
import type {
  FabContinuousEffectInstance,
  FabContinuousOrderingRecord,
} from "../rules/continuous/ir.ts";
import type { FabRulesStackLayer } from "../rules/layers.ts";
import type { DeepReadonly, FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import { consumeOwnedFabCommandCandidate } from "../copy-on-write.ts";
import { hasValidFrozenCopyProperties, hasValidRuntimeGraphs } from "./validators.ts";
import { assertValidFabActiveFace } from "../game/active-face.ts";
import { collectReachableFabLkiIds } from "../game/lki.ts";

export type FabDefinitionRegistry = Readonly<Record<string, FabRegisteredCardDefinition>>;

type DeepMutable<Value> = Value extends (...args: never[]) => unknown
  ? Value
  : Value extends string | number | boolean | bigint | symbol | null | undefined
    ? Value
    : Value extends readonly unknown[]
      ? { -readonly [Key in keyof Value]: DeepMutable<Value[Key]> }
      : Value extends object
        ? { -readonly [Key in keyof Value]: DeepMutable<Value[Key]> }
        : Value;

/** Compiled rules are immutable match context; the current card IR is embedded in definitions. */
export interface FabMatchContext {
  readonly program: FabMatchProgram;
  readonly cardDefinitions: FabDefinitionRegistry;
  readonly publicCardIdentities: FabMatchProgram["publicCardIdentities"];
}

/**
 * Compact physical object encoding used only at the persistence boundary.
 * Missing values have one canonical meaning and are rehydrated before any
 * rules code receives the state.
 */
export type FabPersistedObjectRecordV17 = DeepReadonly<
  Omit<
    FabObjectRecord,
    "visibility" | "activeFace" | "counters" | "markers" | "cardPropertyState"
  > & {
    readonly visibility?: "public";
    readonly activeFace?: Extract<FabObjectRecord["activeFace"], { readonly kind: "paired" }>;
    readonly counters?: readonly FabCounterRecord[];
    readonly markers?: readonly FabObjectMarker[];
    readonly cardPropertyState?: Exclude<
      import("../cards.ts").FabCardPropertyState,
      { readonly kind: "whole-card" }
    >;
  }
>;

export type FabPersistedTurnHistoryV17 = DeepReadonly<Partial<FabTurnHistory>> & {
  readonly turnNumber: number;
};

export type FabPersistedHistoryV17 = DeepReadonly<{
  readonly game: FabHistoryIndex["game"];
  readonly turn: FabPersistedTurnHistoryV17;
  readonly combatChain: Partial<FabHistoryIndex["combatChain"]>;
  readonly chainLink: Partial<FabHistoryIndex["chainLink"]>;
  readonly resolution: FabHistoryIndex["resolution"];
}>;

/** Player state whose containers are owned solely by `containerModel`. */
export type FabPersistedPlayerV17 = DeepReadonly<
  FabRulesAssets & {
    readonly playerId: FabPlayerId;
    readonly heroCardId: string | null;
    readonly intellect: number;
    readonly marked: boolean;
    readonly extraTurnsQueued: number;
    readonly activeContract: string | null;
    readonly history: FabPersistedHistoryV17;
    readonly intimidatedInstanceIds: readonly FabBanishReturnEntry[];
    readonly pendingCrankInstanceIds: readonly string[];
  }
>;

/**
 * Closed persistence DTO. It deliberately does not extend, omit from, or
 * spread `FabMatchState`, so adding runtime state cannot silently persist it.
 */
export interface FabMatchSnapshotV21 {
  readonly schemaVersion: typeof FAB_MATCH_SCHEMA_VERSION;
  readonly programFingerprint: string;
  readonly playerIds: readonly FabPlayerId[];
  readonly players: Readonly<Record<string, FabPersistedPlayerV17>>;
  readonly containerModel: FabContainerModel;
  readonly objects: Readonly<Record<string, FabPersistedObjectRecordV17>>;
  readonly attackProxies: Readonly<Record<string, DeepReadonly<FabAttackProxyRecord>>>;
  readonly lkiArena: Readonly<Record<FabLkiId, DeepReadonly<FabMoveLkiSnapshot>>>;
  readonly firstTurnPlayerId: FabPlayerId;
  readonly activePlayerId: FabPlayerId;
  readonly priority: DeepReadonly<FabPriorityWindow> | null;
  readonly turnNumber: number;
  readonly phase: FabPhase;
  readonly combat: DeepReadonly<FabCombatState> | null;
  readonly lastClosedCombat: DeepReadonly<FabLastClosedCombat> | null;
  readonly decision: DeepReadonly<FabDecision> | null;
  readonly rulesProcess: DeepReadonly<FabRulesProcess> | null;
  readonly counters: DeepReadonly<FabDeterministicCounters>;
  readonly triggerLimitUsage: Readonly<Record<string, number>>;
  readonly optionalTriggerAutomation: Readonly<
    Record<
      string,
      Readonly<
        Partial<Record<string, import("../state.ts").FabStoredOptionalTriggerAutomationMode>>
      >
    >
  >;
  readonly automationPreferences: Readonly<Record<string, FabAutomationPreferences>>;
  readonly priorityHoldArmed: Readonly<Record<string, true>>;
  readonly triggerOccurrenceLedger: readonly DeepReadonly<
    import("../state.ts").FabTriggerOccurrenceRecord
  >[];
  readonly abilityLimitUsage: Readonly<Record<string, number>>;
  readonly activationLimitModifiers: readonly DeepReadonly<
    import("../state.ts").FabActivationLimitModifier
  >[];
  readonly delayedTriggers: readonly DeepReadonly<FabDelayedTrigger>[];
  readonly replacementEffects: readonly DeepReadonly<FabPersistedReplacement>[];
  readonly continuousEffectInstances: readonly DeepReadonly<FabContinuousEffectInstance>[];
  readonly continuousOrderingDecisions: readonly DeepReadonly<FabContinuousOrderingRecord>[];
  readonly rulesStack: readonly DeepReadonly<FabRulesStackLayer>[];
  readonly stateID: number;
  readonly gameEnded: boolean;
  readonly winnerId: string | null;
  readonly endReason: string | null;
  readonly sharedLibraryHostId: string | null;
  readonly seed: string;
  readonly rngState: DeepReadonly<FabPrngState>;
  readonly lastClashWinnerId: string | null;
}

export function createFabMatchContext(
  definitions: Readonly<Record<string, FabCardDefinitionInput>>,
  publicCardIdentities: FabMatchProgram["publicCardIdentities"],
): FabMatchContext {
  const program = compileFabMatchProgram(definitions, publicCardIdentities);
  return {
    program,
    cardDefinitions: program.cardDefinitions,
    publicCardIdentities: program.publicCardIdentities,
  };
}

/**
 * Fingerprints are deterministic in (definitions, identities), and both are
 * immutable match context — recompiling the whole program per command (server
 * persistence, bench snapshot validation) is pure waste, so memoize on object
 * identity. Weak keys let discarded matches release their entries.
 */
const programFingerprintCache = new WeakMap<
  object,
  WeakMap<object, { readonly fingerprint: string }>
>();

function fabProgramFingerprint(
  definitions: Readonly<Record<string, FabCardDefinitionInput>>,
  publicCardIdentities: FabMatchProgram["publicCardIdentities"],
): string {
  let byIdentities = programFingerprintCache.get(definitions);
  if (!byIdentities) {
    byIdentities = new WeakMap();
    programFingerprintCache.set(definitions, byIdentities);
  }
  let cached = byIdentities.get(publicCardIdentities);
  if (!cached) {
    cached = { fingerprint: compileFabMatchProgram(definitions, publicCardIdentities).fingerprint };
    byIdentities.set(publicCardIdentities, cached);
  }
  return cached.fingerprint;
}

let snapshotSerializationObserver: (() => void) | null = null;

/** Local profiling hook. Production dispatch does not install an observer. */
export function observeFabSnapshotSerialization(observer: (() => void) | null): void {
  snapshotSerializationObserver = observer;
}

/** Explicit persistence and invariant-validation boundary. */
export function serializeFabMatchSnapshot(state: FabRulesSnapshot): FabMatchSnapshotV21 {
  snapshotSerializationObserver?.();
  assertValidCardPropertyStates(state.objects, state.cardDefinitions);
  // Accepted command candidates are detached from every previously published
  // state and become immutable after publication. Their readonly persistence
  // DTO may share nested values without paying for a second clone. Ad-hoc and
  // test states retain the historical defensive detachment.
  const cloned = consumeOwnedFabCommandCandidate(state) ? state : structuredClone(state);
  const {
    cardDefinitions: _definitions,
    publicCardIdentities: _publicCardIdentities,
    players,
    containers,
    objects,
    schemaVersion,
    playerIds,
    attackProxies,
    lkiArena,
    firstTurnPlayerId,
    activePlayerId,
    priority,
    turnNumber,
    phase,
    combat,
    lastClosedCombat,
    decision,
    rulesProcess,
    counters,
    triggerLimitUsage,
    optionalTriggerAutomation,
    automationPreferences,
    priorityHoldArmed,
    triggerOccurrenceLedger,
    abilityLimitUsage,
    activationLimitModifiers,
    delayedTriggers,
    replacementEffects,
    continuousEffectInstances,
    continuousOrderingDecisions,
    rulesStack,
    stateID,
    gameEnded,
    winnerId,
    endReason,
    sharedLibraryHostId,
    seed,
    rngState,
    lastClashWinnerId,
    ...unpersisted
  } = cloned;
  unpersisted satisfies Record<string, never>;
  const serialized: FabMatchSnapshotV21 = {
    schemaVersion,
    programFingerprint: fabProgramFingerprint(state.cardDefinitions, state.publicCardIdentities),
    playerIds,
    players: Object.fromEntries(
      Object.entries(players).map(([playerId, player]) => {
        const {
          life,
          actionPoints,
          resourcePoints,
          chiPoints,
          playerId: persistedPlayerId,
          heroCardId,
          intellect,
          marked,
          extraTurnsQueued,
          activeContract,
          history,
          intimidatedInstanceIds,
          pendingCrankInstanceIds,
          ...unpersistedPlayer
        } = player;
        unpersistedPlayer satisfies Record<string, never>;
        return [
          playerId,
          {
            life,
            actionPoints,
            resourcePoints,
            chiPoints,
            playerId: persistedPlayerId,
            heroCardId,
            intellect,
            marked,
            extraTurnsQueued,
            activeContract,
            history: compactFabHistoryIndex(history),
            intimidatedInstanceIds,
            pendingCrankInstanceIds,
          } satisfies FabPersistedPlayerV17,
        ];
      }),
    ),
    containerModel: createFabContainerModel(containers),
    objects: Object.fromEntries(
      Object.entries(objects).map(([instanceId, object]) => [
        instanceId,
        compactFabObjectRecord(object),
      ]),
    ),
    attackProxies,
    lkiArena,
    firstTurnPlayerId,
    activePlayerId,
    priority,
    turnNumber,
    phase,
    combat,
    lastClosedCombat,
    decision,
    rulesProcess,
    counters,
    triggerLimitUsage,
    optionalTriggerAutomation,
    automationPreferences,
    priorityHoldArmed,
    triggerOccurrenceLedger,
    abilityLimitUsage,
    activationLimitModifiers,
    delayedTriggers,
    replacementEffects,
    continuousEffectInstances,
    continuousOrderingDecisions,
    rulesStack,
    stateID,
    gameEnded,
    winnerId,
    endReason,
    sharedLibraryHostId,
    seed,
    rngState,
    lastClashWinnerId,
  };
  const issues = collectFabSnapshotValidationIssues(serialized);
  if (issues.length > 0) {
    throw new FabSnapshotSerializationRefusalError(issues, serialized, state);
  }
  return serialized;
}

/** One failed snapshot invariant, named so failures are diagnosable at a glance. */
export interface FabSnapshotValidationIssue {
  readonly check: string;
  readonly detail?: string;
}

/**
 * Thrown when a match state fails its own persistence invariants. The message
 * names every failed invariant; `rejectedSnapshot` retains the rejected DTO so
 * hosts can dump it for offline post-mortem instead of losing the evidence.
 */
export class FabSnapshotSerializationRefusalError extends Error {
  readonly issues: readonly FabSnapshotValidationIssue[];
  readonly rejectedSnapshot: unknown;
  readonly stateSummary: Readonly<Record<string, unknown>>;

  constructor(
    issues: readonly FabSnapshotValidationIssue[],
    rejectedSnapshot: unknown,
    state: FabRulesSnapshot,
  ) {
    const summary: Record<string, unknown> = {
      stateID: state.stateID,
      turnNumber: state.turnNumber,
      phase: state.phase,
      combatStep: state.combat?.step ?? null,
      decisionKind: state.decision?.kind ?? null,
      rulesStackLayers: state.rulesStack.length,
      objectCount: Object.keys(state.objects).length,
      lkiArenaCount: Object.keys(state.lkiArena).length,
      priority: state.priority ? `${state.priority.kind}:${state.priority.holderPlayerId}` : null,
    };
    super(
      `Refusing to serialize invalid or unreachable Flesh and Blood state ${JSON.stringify(summary)}; failed invariants: ${issues
        .map((issue) => `${issue.check}${issue.detail ? ` (${issue.detail})` : ""}`)
        .join("; ")}.`,
    );
    this.name = "FabSnapshotSerializationRefusalError";
    this.issues = issues;
    this.rejectedSnapshot = rejectedSnapshot;
    this.stateSummary = summary;
  }
}

export function restoreFabMatchSnapshot(
  snapshot: unknown,
  context: FabMatchContext,
): FabMatchState {
  if (!isFabMatchSnapshotV21(snapshot)) {
    const issues = collectFabSnapshotValidationIssues(snapshot);
    throw new Error(
      `Unsupported Flesh and Blood persisted snapshot; expected clean schema ${FAB_MATCH_SCHEMA_VERSION} without embedded context or completed history. Failed invariants: ${
        issues.length > 0
          ? issues
              .map((issue) => `${issue.check}${issue.detail ? ` (${issue.detail})` : ""}`)
              .join("; ")
          : "unknown"
      }.`,
    );
  }
  // structuredClone produces a detached mutable graph, but its generic return
  // type preserves the source's readonly modifiers.
  // A persisted match is state, not a frozen copy of card behavior. Card
  // hotfixes intentionally rebind that state to the current match program;
  // fingerprints remain diagnostic metadata and must never block restore.
  if (snapshot.programFingerprint !== context.program.fingerprint) {
    console.warn(
      "[flesh-and-blood] Restoring a persisted match with the current card program because its program fingerprint changed.",
      {
        snapshotProgramFingerprint: snapshot.programFingerprint,
        currentProgramFingerprint: context.program.fingerprint,
      },
    );
  }
  const restored = structuredClone(snapshot) as DeepMutable<FabMatchSnapshotV21>;
  const containers = createFabRuntimeContainers(restored.containerModel);
  const {
    containerModel: _containerModel,
    programFingerprint: _programFingerprint,
    ...restoredState
  } = restored;
  const state: FabMatchState = {
    ...restoredState,
    playerIds: restored.playerIds.map(fabPlayerId),
    players: Object.fromEntries(
      Object.entries(restored.players).map(([playerKey, player]) => [
        playerKey,
        {
          ...player,
          playerId: fabPlayerId(player.playerId),
          history: restoreFabHistoryIndex(player.history),
        },
      ]),
    ),
    containers,
    objects: Object.fromEntries(
      Object.entries(restored.objects).map(([instanceId, object]) => [
        instanceId,
        restoreFabObjectRecord(object),
      ]),
    ),
    attackProxies: Object.fromEntries(
      Object.entries(restored.attackProxies).map(([proxyId, proxy]) => [
        proxyId,
        {
          ...proxy,
          id: fabAttackProxyId(proxy.id),
          sourceId: fabObjectInstanceId(proxy.sourceId),
          sourceRef: {
            instanceId: fabObjectInstanceId(proxy.sourceRef.instanceId),
            incarnation: proxy.sourceRef.incarnation,
          },
          controllerId: fabPlayerId(proxy.controllerId),
        },
      ]),
    ),
    lkiArena: Object.fromEntries(
      Object.entries(restored.lkiArena).map(([lkiId, snapshot]) => [
        lkiId,
        restoreFabMoveLkiSnapshot(snapshot),
      ]),
    ),
    activePlayerId: fabPlayerId(restored.activePlayerId),
    combat: restored.combat
      ? {
          ...restored.combat,
          activeLink: restored.combat.activeLink
            ? restoreFabChainLink(restored.combat.activeLink)
            : null,
          closedLinks: restored.combat.closedLinks?.map(restoreFabChainLink),
        }
      : null,
    lastClosedCombat: restored.lastClosedCombat
      ? restoreFabLastClosedCombat(restored.lastClosedCombat)
      : null,
    cardDefinitions: context.cardDefinitions,
    publicCardIdentities: context.publicCardIdentities,
  };
  assertValidCardPropertyStates(state.objects, state.cardDefinitions);
  return state;
}

function assertValidCardPropertyStates(
  objects: Readonly<Record<string, FabObjectRecord>>,
  definitions: Readonly<Record<string, FabRegisteredCardDefinition>>,
): void {
  for (const object of Object.values(objects)) {
    const definition = definitions[object.canonicalId];
    if (definition) assertValidFabActiveFace(definition, object.activeFace);
    else if (object.activeFace.kind !== "single") {
      throw new Error(`FAB paired object ${object.instanceId} has no registered definition.`);
    }
    const propertyState = object.cardPropertyState;
    if (propertyState.kind === "whole-card") continue;
    if (propertyState.kind === "face") {
      if (definition.layout.kind !== "split") {
        throw new Error(
          `FAB object ${object.instanceId} selects a split face on a non-split card.`,
        );
      }
      continue;
    }
    const hasMeld =
      definition.layout.kind === "split"
        ? definition.layout.faces.some((face) =>
            face.keywords.some((keyword) => keyword.name === "meld"),
          )
        : definition.base.keywords.some((keyword) => keyword.name === "meld");
    if (!hasMeld) {
      throw new Error(`FAB object ${object.instanceId} is melded without a printed meld ability.`);
    }
  }
}

export function isFabMatchSnapshotV21(value: unknown): value is FabMatchSnapshotV21 {
  return collectFabSnapshotValidationIssues(value).length === 0;
}

/**
 * Run every snapshot invariant and report each failure by name. The boolean
 * predicate above stays the admission gate; this collector is the diagnostic
 * twin used by error paths so a refusal says which invariant broke, not just
 * that one of ~20 did. Predicates are already defensive (they also guard
 * untrusted restores), but each is wrapped so an internal throw degrades into
 * a named failure instead of masking the diagnosis.
 */
export function collectFabSnapshotValidationIssues(
  value: unknown,
): readonly FabSnapshotValidationIssue[] {
  if (typeof value !== "object" || value === null) {
    return [{ check: "snapshot-shape", detail: `expected object, received ${typeof value}` }];
  }
  const record = value as Record<string, unknown>;
  const issues: FabSnapshotValidationIssue[] = [];
  const run = (check: string, predicate: () => boolean, detail?: () => string): void => {
    let ok: boolean;
    try {
      ok = predicate();
    } catch (error) {
      issues.push({
        check,
        detail: `validator threw: ${error instanceof Error ? error.message : String(error)}`,
      });
      return;
    }
    if (!ok) {
      const issue: FabSnapshotValidationIssue = detail ? { check, detail: detail() } : { check };
      issues.push(issue);
    }
  };
  run(
    "hasExactSnapshotKeys",
    () => hasExactSnapshotKeys(record),
    () => {
      const keys = Object.keys(record);
      const expected = FAB_MATCH_SNAPSHOT_V22_KEYS;
      const unexpected = keys.filter((key) => !expected.has(key));
      const missing = [...expected].filter((key) => !keys.includes(key));
      return `unexpected=[${unexpected.join(",")}] missing=[${missing.join(",")}]`;
    },
  );
  run(
    "schemaVersion",
    () => record.schemaVersion === FAB_MATCH_SCHEMA_VERSION,
    () => `got ${String(record.schemaVersion)}, expected ${FAB_MATCH_SCHEMA_VERSION}`,
  );
  run(
    "programFingerprint",
    () => typeof record.programFingerprint === "string",
    () => `got ${typeof record.programFingerprint}`,
  );
  run(
    "forbidden-embedded-keys",
    () =>
      !("cardDefinitions" in record) &&
      !("compiledRules" in record) &&
      !("committedEvents" in record) &&
      !("logs" in record) &&
      !("indexes" in record) &&
      !("rollbackSnapshot" in record) &&
      !("priorityPlayerId" in record),
  );
  run("isFabContainerModel", () => isFabContainerModel(record.containerModel));
  run(
    "hasValidFirstTurnPlayer",
    () =>
      typeof record.firstTurnPlayerId === "string" &&
      Array.isArray(record.playerIds) &&
      record.playerIds.includes(record.firstTurnPlayerId),
  );
  run("hasValidContainerReferences", () =>
    hasValidContainerReferences(record.containerModel, record.objects, record.playerIds),
  );
  run("hasCanonicalCompactObjectRecords", () => hasCanonicalCompactObjectRecords(record));
  run("hasValidIdentityGraph", () => hasValidIdentityGraph(record));
  run(
    "hasValidPriority",
    () => hasValidPriority(record),
    () => {
      const priority = isRecord(record.priority) ? record.priority : null;
      const combat = isRecord(record.combat) ? record.combat : null;
      return `priority=${
        priority
          ? `${String(priority.kind)}:${String(priority.holderPlayerId)}:passes=${String(priority.consecutivePasses)}:combatStep=${String(priority.combatStep)}`
          : "null"
      } combatStep=${combat ? String(combat.step) : "null"} defenseDeclarationPending=${combat ? String(combat.defenseDeclarationPending) : "n/a"} gameEnded=${String(record.gameEnded)} rulesStackLayers=${Array.isArray(record.rulesStack) ? record.rulesStack.length : "n/a"}`;
    },
  );
  run("triggerOccurrenceLedger", () => Array.isArray(record.triggerOccurrenceLedger));
  run("hasValidOptionalTriggerAutomation", () => hasValidOptionalTriggerAutomation(record));
  run("hasValidPriorityAutomation", () => hasValidPriorityAutomation(record));
  run("hasValidPriorityHoldArmed", () => hasValidPriorityHoldArmed(record));
  run("hasValidDelayedTriggers", () => hasValidDelayedTriggers(record.delayedTriggers));
  run("hasValidPersistedReplacementEffects", () =>
    hasValidPersistedReplacementEffects(record.replacementEffects),
  );
  run(
    "hasValidActivationLimitModifiers",
    () => hasValidActivationLimitModifiers(record),
    () => firstActivationLimitModifierIssue(record),
  );
  run("hasValidRuntimeGraphs", () =>
    hasValidRuntimeGraphs(
      record.decision,
      record.rulesProcess,
      record.rulesStack,
      record.continuousEffectInstances,
      record.continuousOrderingDecisions,
      {
        playerIds: new Set(
          Array.isArray(record.playerIds)
            ? record.playerIds.filter(
                (playerId): playerId is string => typeof playerId === "string",
              )
            : [],
        ),
        objects: isRecord(record.objects) ? record.objects : {},
        attackProxies: isRecord(record.attackProxies) ? record.attackProxies : {},
        lkiArena: isRecord(record.lkiArena) ? record.lkiArena : {},
        stateID: typeof record.stateID === "number" ? record.stateID : Number.NaN,
        rulesStack: Array.isArray(record.rulesStack) ? record.rulesStack : [],
        rulesProcess: record.rulesProcess,
      },
    ),
  );
  run(
    "hasOnlyReachableMoveLki",
    () => hasOnlyReachableMoveLki(record),
    () => unreachableMoveLkiDetail(record),
  );
  return issues;
}

function firstActivationLimitModifierIssue(record: Record<string, unknown>): string {
  if (!Array.isArray(record.activationLimitModifiers)) return "not an array";
  for (let index = 0; index < record.activationLimitModifiers.length; index += 1) {
    const modifier = record.activationLimitModifiers[index];
    if (!isRecord(modifier)) return `[${index}] not a record`;
    if (typeof record.turnNumber === "number" && modifier.turnNumber !== record.turnNumber) {
      return `[${index}] modifier.turnNumber=${String(modifier.turnNumber)} but snapshot turnNumber=${String(record.turnNumber)} (stale modifier not pruned at turn rollover?)`;
    }
    return `[${index}] first failing modifier: ${safeIssueJson(modifier)}`;
  }
  return "no modifiers";
}

function unreachableMoveLkiDetail(record: Record<string, unknown>): string {
  if (!isRecord(record.lkiArena)) return "lkiArena is not a record";
  try {
    const reachable = collectReachableFabLkiIds({
      objects: record.objects as FabLkiStoreObjects,
      lkiArena: record.lkiArena as FabLkiStore["lkiArena"],
      rulesStack: Array.isArray(record.rulesStack) ? record.rulesStack : [],
      rulesProcess: record.rulesProcess,
      decision: record.decision,
      delayedTriggers: Array.isArray(record.delayedTriggers) ? record.delayedTriggers : [],
      replacementEffects: Array.isArray(record.replacementEffects) ? record.replacementEffects : [],
      continuousEffectInstances: Array.isArray(record.continuousEffectInstances)
        ? record.continuousEffectInstances
        : [],
      attackProxies: isRecord(record.attackProxies) ? record.attackProxies : {},
      combat: record.combat,
      lastClosedCombat: record.lastClosedCombat,
    });
    const arenaIds = Object.keys(record.lkiArena);
    const extra = arenaIds.filter((lkiId) => !reachable.has(lkiId as FabLkiId));
    const missing = [...reachable].filter((lkiId) => !arenaIds.includes(lkiId));
    return `unreachable-in-arena=[${extra.join(",")}] reachable-but-missing=[${missing.join(",")}]`;
  } catch (error) {
    return `reachability walk threw: ${error instanceof Error ? error.message : String(error)}`;
  }
}

function safeIssueJson(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

function hasValidOptionalTriggerAutomation(record: Record<string, unknown>): boolean {
  if (!isRecord(record.optionalTriggerAutomation) || !Array.isArray(record.playerIds)) return false;
  const players = new Set(record.playerIds.filter(isNonEmptyString));
  const objects = isRecord(record.objects) ? record.objects : {};
  return Object.entries(record.optionalTriggerAutomation).every(
    ([playerId, preferences]) =>
      players.has(playerId) &&
      isRecord(preferences) &&
      Object.entries(preferences).every(
        ([instanceId, mode]) =>
          (mode === "auto-accept" || mode === "auto-decline") && instanceId in objects,
      ),
  );
}

function hasValidPriorityAutomation(record: Record<string, unknown>): boolean {
  if (!isRecord(record.automationPreferences) || !Array.isArray(record.playerIds)) return false;
  const players = new Set(record.playerIds.filter(isNonEmptyString));
  return Object.entries(record.automationPreferences).every(
    ([playerId, preferences]) => players.has(playerId) && isValidAutomationPreferences(preferences),
  );
}

function isValidAutomationPreferences(value: unknown): value is FabAutomationPreferences {
  if (!isRecord(value)) return false;
  if (
    value.priorityMode !== "auto-pass" &&
    value.priorityMode !== "always-hold" &&
    value.priorityMode !== "play-and-skip"
  ) {
    return false;
  }
  if (typeof value.autoOrderTriggers !== "boolean") return false;
  if (typeof value.autoSelectSingletonTargets !== "boolean") return false;
  for (const key of [
    "playAndSkipHoldCardIds",
    "opponentTriggerYieldCardIds",
    "instantYieldCardIds",
  ] as const) {
    const ids = value[key];
    if (
      !Array.isArray(ids) ||
      !ids.every((id): id is string => typeof id === "string" && id.length > 0)
    ) {
      return false;
    }
  }
  return true;
}

function hasValidPriorityHoldArmed(record: Record<string, unknown>): boolean {
  if (!isRecord(record.priorityHoldArmed) || !Array.isArray(record.playerIds)) return false;
  const players = new Set(record.playerIds.filter(isNonEmptyString));
  return Object.entries(record.priorityHoldArmed).every(
    ([playerId, armed]) => players.has(playerId) && armed === true,
  );
}

/** The persisted window origin admits exactly the engine's own stamp shape. */
function isValidOwnActionOrigin(origin: unknown): boolean {
  return (
    isRecord(origin) &&
    origin.kind === "own-action" &&
    typeof origin.sourceInstanceId === "string" &&
    origin.sourceInstanceId.length > 0
  );
}

function hasValidActivationLimitModifiers(record: Record<string, unknown>): boolean {
  if (!Array.isArray(record.activationLimitModifiers) || !Array.isArray(record.playerIds))
    return false;
  const players = new Set(record.playerIds.filter(isNonEmptyString));
  const objects = isRecord(record.objects) ? record.objects : {};
  const lkiArena = isRecord(record.lkiArena) ? record.lkiArena : {};
  const validRef = (value: unknown): boolean => {
    if (
      !isRecord(value) ||
      !isNonEmptyString(value.instanceId) ||
      !Number.isInteger(value.incarnation)
    )
      return false;
    const live = objects[value.instanceId];
    if (isRecord(live) && live.incarnation === value.incarnation) return true;
    return Object.values(lkiArena).some(
      (lki) =>
        isRecord(lki) &&
        isRecord(lki.ref) &&
        lki.ref.instanceId === value.instanceId &&
        lki.ref.incarnation === value.incarnation,
    );
  };
  // A granted effect outlives its source (for example, Flurry ceases after
  // setting the weapon's limit). Its source is immutable provenance, not a
  // continuation handle; only the affected attack source must remain live/LKI.
  const validProvenanceRef = (value: unknown): boolean =>
    isRecord(value) &&
    isNonEmptyString(value.instanceId) &&
    Number.isInteger(value.incarnation) &&
    Number(value.incarnation) >= 0;
  const ids = new Set<string>();
  const sequences = new Set<number>();
  return record.activationLimitModifiers.every((modifier) => {
    if (
      !isRecord(modifier) ||
      !isNonEmptyString(modifier.modifierId) ||
      ids.has(modifier.modifierId) ||
      !Number.isInteger(modifier.generatedSequence) ||
      Number(modifier.generatedSequence) < 1 ||
      sequences.has(Number(modifier.generatedSequence)) ||
      !players.has(String(modifier.controllerId)) ||
      !validProvenanceRef(modifier.sourceRef) ||
      !validRef(modifier.attackSourceRef) ||
      !Array.isArray(modifier.attackAbilityIds) ||
      modifier.attackAbilityIds.length === 0 ||
      !modifier.attackAbilityIds.every(isNonEmptyString) ||
      (modifier.operation !== "set-total" && modifier.operation !== "additional") ||
      !Number.isInteger(modifier.count) ||
      Number(modifier.count) < 1 ||
      !Number.isInteger(modifier.turnNumber) ||
      modifier.turnNumber !== record.turnNumber
    )
      return false;
    ids.add(modifier.modifierId);
    sequences.add(Number(modifier.generatedSequence));
    return true;
  });
}

function hasValidPersistedReplacementEffects(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every((replacement) => {
      if (
        !isRecord(replacement) ||
        !isRecord(replacement.applicationPolicy) ||
        !isRecord(replacement.consumptionPolicy) ||
        "consumeOnUse" in replacement
      )
        return false;
      if (
        replacement.consumptionPolicy.kind !== "never" &&
        replacement.consumptionPolicy.kind !== "on-application" &&
        replacement.consumptionPolicy.kind !== "on-opportunity"
      )
        return false;
      if (Object.keys(replacement.consumptionPolicy).length !== 1) return false;
      const policy = replacement.applicationPolicy;
      if (policy.kind === "mandatory") return Object.keys(policy).length === 1;
      if (policy.kind !== "may-apply" || !Array.isArray(policy.followUps)) return false;
      if (policy.cost !== undefined && !isRecord(policy.cost)) return false;
      return true;
    })
  );
}

const FAB_MATCH_SNAPSHOT_V22_KEYS = new Set([
  "schemaVersion",
  "programFingerprint",
  "playerIds",
  "players",
  "containerModel",
  "objects",
  "attackProxies",
  "lkiArena",
  "firstTurnPlayerId",
  "activePlayerId",
  "priority",
  "turnNumber",
  "phase",
  "combat",
  "lastClosedCombat",
  "decision",
  "rulesProcess",
  "counters",
  "triggerLimitUsage",
  "optionalTriggerAutomation",
  "automationPreferences",
  "priorityHoldArmed",
  "triggerOccurrenceLedger",
  "abilityLimitUsage",
  "activationLimitModifiers",
  "delayedTriggers",
  "replacementEffects",
  "continuousEffectInstances",
  "continuousOrderingDecisions",
  "rulesStack",
  "stateID",
  "gameEnded",
  "winnerId",
  "endReason",
  "sharedLibraryHostId",
  "seed",
  "rngState",
  "lastClashWinnerId",
]);

function hasExactSnapshotKeys(record: Record<string, unknown>): boolean {
  const keys = Object.keys(record);
  return (
    keys.length === FAB_MATCH_SNAPSHOT_V22_KEYS.size &&
    keys.every((key) => FAB_MATCH_SNAPSHOT_V22_KEYS.has(key))
  );
}

function hasValidDelayedTriggers(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every((delayed) => {
      if (!isRecord(delayed) || !isRecord(delayed.policy)) return false;
      if ("consumeOnUse" in delayed || "expiresAt" in delayed) return false;
      const policy = delayed.policy;
      if (
        policy.kind !== "windowed" ||
        (policy.matching !== "first" && policy.matching !== "every") ||
        !isRecord(policy.expiresAt)
      ) {
        return false;
      }
      const expiry = policy.expiresAt;
      switch (expiry.kind) {
        case "turn":
          return typeof expiry.turnNumber === "number";
        case "phase":
          return typeof expiry.turnNumber === "number" && typeof expiry.phase === "string";
        case "combat-chain":
          return typeof expiry.combatNumber === "number";
        case "player-turn-start":
          return typeof expiry.playerId === "string" && typeof expiry.afterTurnNumber === "number";
        case "player-turn-end":
          return typeof expiry.playerId === "string" && typeof expiry.turnNumber === "number";
        case "player-action-phase-window":
        case "player-end-phase-window":
          return typeof expiry.playerId === "string" && typeof expiry.windowTurnNumber === "number";
        case "player-next-clash":
          return typeof expiry.playerId === "string" && typeof expiry.turnNumber === "number";
        case "source":
          return (
            isRecord(expiry.ref) &&
            typeof expiry.ref.instanceId === "string" &&
            typeof expiry.ref.incarnation === "number"
          );
        default:
          return false;
      }
    })
  );
}

function compactFabObjectRecord(
  object: DeepReadonly<FabObjectRecord>,
): FabPersistedObjectRecordV17 {
  const {
    visibility,
    activeFace,
    counters,
    markers,
    cardPropertyState,
    lifeGained,
    lifeLost,
    declarationFacts,
    ...identity
  } = object;
  return {
    ...identity,
    ...(visibility === "public" ? { visibility } : {}),
    ...(activeFace.kind === "paired" ? { activeFace } : {}),
    ...(counters.length > 0 ? { counters } : {}),
    ...(markers.length > 0 ? { markers } : {}),
    ...(cardPropertyState.kind === "whole-card" ? {} : { cardPropertyState }),
    ...(lifeGained ? { lifeGained } : {}),
    ...(lifeLost ? { lifeLost } : {}),
    ...(declarationFacts && declarationFacts.length > 0 ? { declarationFacts } : {}),
  };
}

function restoreFabObjectRecord(object: FabPersistedObjectRecordV17): FabObjectRecord {
  return {
    ...object,
    instanceId: fabObjectInstanceId(object.instanceId),
    canonicalId: fabCanonicalCardId(object.canonicalId),
    ownerId: fabPlayerId(object.ownerId),
    visibility: object.visibility ?? "private",
    activeFace: object.activeFace ?? { kind: "single" },
    counters: object.counters ? [...object.counters] : [],
    markers: object.markers ? [...object.markers] : [],
    cardPropertyState: object.cardPropertyState ?? { kind: "whole-card" },
    history: {
      moves: object.history.moves.map((move) => ({
        ...move,
        from: move.from ? restoreFabZoneRef(move.from) : null,
        to: restoreFabZoneRef(move.to),
      })),
    },
  };
}

function restoreFabMoveLkiSnapshot(snapshot: FabMoveLkiSnapshot): FabMoveLkiSnapshot {
  return {
    ...snapshot,
    ref: { ...snapshot.ref, instanceId: fabObjectInstanceId(snapshot.ref.instanceId) },
    canonicalId: fabCanonicalCardId(snapshot.canonicalId),
    ownerId: fabPlayerId(snapshot.ownerId),
    controllerId: snapshot.controllerId === null ? null : fabPlayerId(snapshot.controllerId),
    zone: restoreFabZoneRef(snapshot.zone),
  };
}

const EMPTY_DAMAGE_BY_TYPE = { arcane: 0, physical: 0, generic: 0 } as const;

function compactFabHistoryIndex(history: DeepReadonly<FabHistoryIndex>): FabPersistedHistoryV17 {
  return {
    game: history.game,
    turn: compactFabTurnHistory(history.turn),
    combatChain: omitDefaultFields(history.combatChain, {
      combatNumber: null,
      draconicChainLinks: 0,
      wagered: false,
      lastAttackNames: [],
      lastAttackDidHit: false,
      boostsThisCombatChain: 0,
      cardsBanishedFromSoulThisCombatChain: 0,
    }),
    chainLink: omitDefaultFields(history.chainLink, {
      chainLinkNumber: null,
      playedInstant: false,
      damageDealtByType: EMPTY_DAMAGE_BY_TYPE,
      damageDealtBySource: {},
      damageDealtBySourceToHero: {},
    }),
    resolution: history.resolution,
  };
}

function restoreFabHistoryIndex(history: FabPersistedHistoryV17): FabHistoryIndex {
  return {
    game: { ...history.game },
    turn: restoreFabTurnHistory(history.turn),
    combatChain: {
      combatNumber: history.combatChain.combatNumber ?? null,
      draconicChainLinks: history.combatChain.draconicChainLinks ?? 0,
      wagered: history.combatChain.wagered ?? false,
      lastAttackNames: [...(history.combatChain.lastAttackNames ?? [])],
      lastAttackDidHit: history.combatChain.lastAttackDidHit ?? false,
      boostsThisCombatChain: history.combatChain.boostsThisCombatChain ?? 0,
      cardsBanishedFromSoulThisCombatChain:
        history.combatChain.cardsBanishedFromSoulThisCombatChain ?? 0,
    },
    chainLink: {
      chainLinkNumber: history.chainLink.chainLinkNumber ?? null,
      playedInstant: history.chainLink.playedInstant ?? false,
      damageDealtByType: {
        ...EMPTY_DAMAGE_BY_TYPE,
        ...history.chainLink.damageDealtByType,
      },
      damageDealtBySource: { ...history.chainLink.damageDealtBySource },
      damageDealtBySourceToHero: { ...history.chainLink.damageDealtBySourceToHero },
    },
    resolution: { ...history.resolution },
  };
}

function restoreFabTurnHistory(turn: FabPersistedTurnHistoryV17): FabTurnHistory {
  const restored = emptyFabTurnHistory(turn.turnNumber);
  const writable = restored as unknown as Record<string, unknown>;
  for (const [key, value] of Object.entries(turn)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) writable[key] = [...value];
    else if (value && typeof value === "object")
      writable[key] = Object.fromEntries(Object.entries(value));
    else writable[key] = value;
  }
  return restored;
}

function compactFabTurnHistory(turn: DeepReadonly<FabTurnHistory>): FabPersistedTurnHistoryV17 {
  return {
    turnNumber: turn.turnNumber,
    ...omitDefaultFields(turn, emptyFabTurnHistory(turn.turnNumber)),
  };
}

function omitDefaultFields<T extends object>(value: T, defaults: T): Partial<T> {
  const compacted: Partial<T> = {};
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    if (key === "turnNumber") continue;
    if (!samePersistedValue(value[key], defaults[key])) compacted[key] = value[key];
  }
  return compacted;
}

function samePersistedValue(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((entry, index) => samePersistedValue(entry, right[index]))
    );
  }
  if (!isRecord(left) || !isRecord(right)) return false;
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every((key) => samePersistedValue(left[key], right[key]))
  );
}

function restoreFabZoneRef(zone: FabZoneRef): FabZoneRef {
  return {
    ...zone,
    playerId: zone.playerId === null ? null : fabPlayerId(zone.playerId),
  };
}

function restoreFabChainLink(link: FabChainLink): FabChainLink {
  return {
    ...link,
    activeAttack:
      link.activeAttack.kind === "card"
        ? {
            kind: "card",
            sourceObjectId: fabObjectInstanceId(link.activeAttack.sourceObjectId),
          }
        : {
            kind: "proxy",
            proxyId: fabAttackProxyId(link.activeAttack.proxyId),
            sourceObjectId: fabObjectInstanceId(link.activeAttack.sourceObjectId),
          },
    attackingPlayerId: fabPlayerId(link.attackingPlayerId),
    defendingPlayerId: fabPlayerId(link.defendingPlayerId),
    attackTargetRef: restoreFabAttackTargetRef(link.attackTargetRef),
    additionalAttackTargetRefs: link.additionalAttackTargetRefs?.map(restoreFabAttackTargetRef),
    damage: {
      status: link.damage.status,
      outcomes: link.damage.outcomes.map((outcome) => ({
        target: restoreFabAttackTargetRef(outcome.target),
        damageDealtByActiveAttack: outcome.damageDealtByActiveAttack,
      })),
    },
    defendingInstanceIdsByTarget: Object.fromEntries(
      Object.entries(link.defendingInstanceIdsByTarget).map(([targetId, defenders]) => [
        targetId,
        defenders.map(fabObjectInstanceId),
      ]),
    ),
    reactionInstanceIds: link.reactionInstanceIds?.map(fabObjectInstanceId),
    wagers: link.wagers.map((wager) => ({
      ...wager,
      controllerId: fabPlayerId(wager.controllerId),
      attackingPlayerId: fabPlayerId(wager.attackingPlayerId),
      defendingPlayerId: fabPlayerId(wager.defendingPlayerId),
    })),
  };
}

function restoreFabAttackTargetRef(
  target: import("../game/combat.ts").FabAttackTargetRef,
): import("../game/combat.ts").FabAttackTargetRef {
  return target.kind === "hero"
    ? { kind: "hero", playerId: fabPlayerId(target.playerId) }
    : {
        kind: "object",
        ref: {
          instanceId: fabObjectInstanceId(target.ref.instanceId),
          incarnation: target.ref.incarnation,
        },
        controllerIdAtDeclaration: fabPlayerId(target.controllerIdAtDeclaration),
      };
}

function restoreFabLastClosedCombat(combat: FabLastClosedCombat): FabLastClosedCombat {
  return {
    attackingPlayerId: fabPlayerId(combat.attackingPlayerId),
    defendingPlayerId: fabPlayerId(combat.defendingPlayerId),
    defendingInstanceIdsByTarget: Object.fromEntries(
      Object.entries(combat.defendingInstanceIdsByTarget).map(([targetId, defenders]) => [
        targetId,
        defenders.map(fabObjectInstanceId),
      ]),
    ),
    attackDidHitByInstanceId: { ...combat.attackDidHitByInstanceId },
    defendedAttackPowersByInstanceId: Object.fromEntries(
      Object.entries(combat.defendedAttackPowersByInstanceId).map(([defenderId, powers]) => [
        defenderId,
        [...powers],
      ]),
    ),
  };
}

function hasValidIdentityGraph(record: Record<string, unknown>): boolean {
  if (!Array.isArray(record.playerIds) || !isRecord(record.players)) return false;
  const playerIds = record.playerIds;
  if (
    playerIds.length !== 2 ||
    !playerIds.every(isNonEmptyString) ||
    new Set(playerIds).size !== playerIds.length
  ) {
    return false;
  }
  const seated = new Set(playerIds);
  if (!isNonEmptyString(record.firstTurnPlayerId) || !seated.has(record.firstTurnPlayerId)) {
    return false;
  }
  const playerEntries = Object.entries(record.players);
  if (
    playerEntries.length !== playerIds.length ||
    !playerEntries.every(
      ([playerKey, player]) =>
        seated.has(playerKey) &&
        isRecord(player) &&
        player.playerId === playerKey &&
        hasValidBanishReturnEntries(player.intimidatedInstanceIds) &&
        !("soulCount" in player) &&
        !("arsenalZones" in player) &&
        !("zones" in player),
    )
  ) {
    return false;
  }
  if (!isNonEmptyString(record.activePlayerId) || !seated.has(record.activePlayerId)) return false;
  if (!isRecord(record.objects)) return false;
  if (!isRecord(record.attackProxies)) return false;
  const lkiArena = isRecord(record.lkiArena) ? record.lkiArena : {};
  if (
    !Object.entries(record.attackProxies).every(
      ([proxyKey, proxy]) =>
        isNonEmptyString(proxyKey) &&
        isRecord(proxy) &&
        proxy.id === proxyKey &&
        isNonEmptyString(proxy.sourceId) &&
        isRecord(proxy.sourceRef) &&
        proxy.sourceRef.instanceId === proxy.sourceId &&
        hasObjectRefInObjectsOrLki(proxy.sourceRef, record.objects, lkiArena) &&
        isNonEmptyString(proxy.controllerId) &&
        seated.has(proxy.controllerId) &&
        isNonEmptyString(proxy.createdByEventId),
    )
  ) {
    return false;
  }
  if (
    !Object.entries(record.objects).every(
      ([instanceKey, object]) =>
        isNonEmptyString(instanceKey) &&
        isRecord(object) &&
        object.instanceId === instanceKey &&
        isNonEmptyString(object.canonicalId) &&
        isNonEmptyString(object.ownerId) &&
        seated.has(object.ownerId) &&
        hasValidMoveHistory(object.history, seated),
    )
  ) {
    return false;
  }
  if (!isRecord(record.lkiArena) || !hasValidLkiArena(record.lkiArena, seated)) return false;
  if (
    record.combat !== null &&
    !hasValidCombat(record.combat, seated, record.objects, record.attackProxies, record.lkiArena)
  ) {
    return false;
  }
  return (
    record.lastClosedCombat === null || hasValidLastClosedCombat(record.lastClosedCombat, seated)
  );
}

function hasObjectRefInObjectsOrLki(value: unknown, objects: unknown, lkiArena: unknown): boolean {
  if (!isRecord(value) || !isRecord(objects) || !isRecord(lkiArena)) return false;
  if (!isNonEmptyString(value.instanceId) || !Number.isInteger(value.incarnation)) return false;
  const live = objects[value.instanceId];
  if (isRecord(live) && live.incarnation === value.incarnation) return true;
  return Object.values(lkiArena).some(
    (snapshot) =>
      isRecord(snapshot) &&
      isRecord(snapshot.ref) &&
      snapshot.ref.instanceId === value.instanceId &&
      snapshot.ref.incarnation === value.incarnation,
  );
}

function hasValidBanishReturnEntries(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        isRecord(entry) &&
        isNonEmptyString(entry.instanceId) &&
        typeof entry.returnToZone === "string" &&
        (FAB_ZONE_KINDS as readonly string[]).includes(entry.returnToZone),
    )
  );
}

function isFabContainerModel(value: unknown): value is FabContainerModel {
  if (
    !isRecord(value) ||
    !isRecord(value.players) ||
    !isRecord(value.shared) ||
    !isRecord(value.subcardsByHostId)
  ) {
    return false;
  }
  const shared = value.shared;
  if (
    !isStringArray(shared.combatChain) ||
    !isStringArray(shared.permanent) ||
    !isStringArray(shared.stack) ||
    !isRecord(shared.controllerIdByObjectId)
  ) {
    return false;
  }
  return (
    Object.values(value.players).every(
      (player) =>
        isRecord(player) &&
        isStringArray(player.deck) &&
        isStringArray(player.hand) &&
        isStringArray(player.graveyard) &&
        isStringArray(player.banished) &&
        isStringArray(player.pitch) &&
        isStringArray(player.inventory) &&
        (player.hero === null || isNonEmptyString(player.hero)) &&
        [player.arms, player.chest, player.head, player.legs].every(
          (id) => id === null || isNonEmptyString(id),
        ) &&
        Array.isArray(player.weapons) &&
        player.weapons.length === 2 &&
        player.weapons.every((id) => id === null || isNonEmptyString(id)) &&
        Array.isArray(player.arsenalZones) &&
        player.arsenalZones.length > 0 &&
        player.arsenalZones.every(
          (slot) =>
            isRecord(slot) &&
            isNonEmptyString(slot.id) &&
            (slot.cardId === null || isNonEmptyString(slot.cardId)),
        ),
    ) && Object.values(value.subcardsByHostId).every(isStringArray)
  );
}

function hasValidContainerReferences(
  containerModel: unknown,
  objects: unknown,
  playerIds: unknown,
): boolean {
  if (
    !isFabContainerModel(containerModel) ||
    !isRecord(objects) ||
    !Array.isArray(playerIds) ||
    !playerIds.every(isNonEmptyString)
  )
    return false;
  const seated = new Set(playerIds);
  if (
    Object.keys(containerModel.players).length !== seated.size ||
    !Object.keys(containerModel.players).every((playerId) => seated.has(playerId))
  )
    return false;
  const members = new Set<string>();
  const arsenalZoneIds = new Set<string>();
  const add = (objectId: string) => {
    if (!isRecord(objects[objectId]) || members.has(objectId)) return false;
    members.add(objectId);
    return true;
  };
  for (const player of Object.values(containerModel.players)) {
    for (const slot of player.arsenalZones) {
      if (arsenalZoneIds.has(slot.id)) return false;
      arsenalZoneIds.add(slot.id);
    }
    for (const ids of [
      player.deck,
      player.hand,
      player.graveyard,
      player.banished,
      player.pitch,
      player.inventory,
      player.arsenalZones.flatMap((slot) => (slot.cardId ? [slot.cardId] : [])),
      [player.hero, player.arms, player.chest, player.head, player.legs].filter(isNonEmptyString),
      player.weapons.filter(isNonEmptyString),
    ]) {
      if (!ids.every(add)) return false;
    }
  }
  for (const ids of [
    containerModel.shared.combatChain,
    containerModel.shared.permanent,
    containerModel.shared.stack,
    ...Object.values(containerModel.subcardsByHostId),
  ]) {
    if (!ids.every(add)) return false;
  }
  const reverseHost = new Map<string, string>();
  for (const [hostId, subcardIds] of Object.entries(containerModel.subcardsByHostId)) {
    if (subcardIds.length === 0) return false;
    for (const subcardId of subcardIds) {
      if (reverseHost.has(subcardId)) return false;
      reverseHost.set(subcardId, hostId);
    }
  }
  for (const hostId of Object.keys(containerModel.subcardsByHostId)) {
    const ancestors = new Set<string>();
    let cursor: string | undefined = hostId;
    const ancestorGuard = createFabLoopGuard({ label: "match-context: subcard ancestor walk" });
    while (cursor !== undefined) {
      ancestorGuard.tick();
      if (ancestors.has(cursor)) return false;
      ancestors.add(cursor);
      cursor = reverseHost.get(cursor);
    }
  }
  const sharedMembers = new Set([
    ...containerModel.shared.combatChain,
    ...containerModel.shared.permanent,
    ...containerModel.shared.stack,
  ]);
  const controllerEntries = Object.entries(containerModel.shared.controllerIdByObjectId);
  if (
    controllerEntries.length !== sharedMembers.size ||
    !controllerEntries.every(
      ([objectId, controllerId]) => sharedMembers.has(objectId) && seated.has(controllerId),
    )
  )
    return false;
  return Object.entries(containerModel.subcardsByHostId).every(
    ([hostId]) =>
      isRecord(objects[hostId]) ||
      (hostId.startsWith("soul:") && seated.has(hostId.slice("soul:".length))),
  );
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function _hasObjectRecord(objects: unknown, objectId: string): boolean {
  return isRecord(objects) && isRecord(objects[objectId]);
}

function hasValidMoveHistory(history: unknown, seated: ReadonlySet<string>): boolean {
  if (!isRecord(history) || !Array.isArray(history.moves)) return false;
  return history.moves.every(
    (move) =>
      isRecord(move) &&
      (move.from === null || hasValidZoneRef(move.from, seated)) &&
      hasValidZoneRef(move.to, seated),
  );
}

function hasValidZoneRef(zone: unknown, seated: ReadonlySet<string>): boolean {
  return (
    isRecord(zone) &&
    (zone.playerId === null || (isNonEmptyString(zone.playerId) && seated.has(zone.playerId))) &&
    typeof zone.zone === "string"
  );
}

function hasValidLkiArena(arena: Record<string, unknown>, seated: ReadonlySet<string>): boolean {
  return Object.entries(arena).every(
    ([lkiId, snapshot]) =>
      lkiId.startsWith("lki:") &&
      isRecord(snapshot) &&
      isRecord(snapshot.ref) &&
      isNonEmptyString(snapshot.ref.instanceId) &&
      isNonEmptyString(snapshot.canonicalId) &&
      isNonEmptyString(snapshot.ownerId) &&
      seated.has(snapshot.ownerId) &&
      (snapshot.controllerId === null ||
        (isNonEmptyString(snapshot.controllerId) && seated.has(snapshot.controllerId))) &&
      hasValidZoneRef(snapshot.zone, seated),
  );
}

function hasValidCombat(
  value: unknown,
  seated: ReadonlySet<string>,
  objects: Record<string, unknown>,
  attackProxies: Record<string, unknown>,
  lkiArena: Record<string, unknown>,
): boolean {
  if (!isRecord(value)) return false;
  if (
    value.activeLink !== null &&
    !hasValidChainLink(value.activeLink, seated, objects, attackProxies, lkiArena, true)
  )
    return false;
  return (
    value.closedLinks === undefined ||
    (Array.isArray(value.closedLinks) &&
      value.closedLinks.every((link) =>
        hasValidChainLink(link, seated, objects, attackProxies, lkiArena, false),
      ))
  );
}

function hasValidChainLink(
  value: unknown,
  seated: ReadonlySet<string>,
  objects: Record<string, unknown>,
  attackProxies: Record<string, unknown>,
  lkiArena: Record<string, unknown>,
  requireLiveAttackProxy: boolean,
): boolean {
  if (!isRecord(value)) return false;
  const declaredTargetKeys = validAttackTargetKeys(
    value.attackTargetRef,
    value.additionalAttackTargetRefs,
  );
  return (
    !("attackTarget" in value) &&
    !("additionalAttackTargets" in value) &&
    !("damageResolved" in value) &&
    !("didHit" in value) &&
    !("didHitHero" in value) &&
    !("damageDealtToHero" in value) &&
    !("attackInstanceId" in value) &&
    !("attackProxyId" in value) &&
    hasValidActiveAttack(value.activeAttack, objects, attackProxies, requireLiveAttackProxy) &&
    isNonEmptyString(value.attackingPlayerId) &&
    seated.has(value.attackingPlayerId) &&
    isNonEmptyString(value.defendingPlayerId) &&
    seated.has(value.defendingPlayerId) &&
    hasValidAttackTargetRef(value.attackTargetRef, seated, objects, lkiArena) &&
    (value.additionalAttackTargetRefs === undefined ||
      (Array.isArray(value.additionalAttackTargetRefs) &&
        value.additionalAttackTargetRefs.every((target) =>
          hasValidAttackTargetRef(target, seated, objects, lkiArena),
        ))) &&
    hasValidCombatDamage(value.damage, seated, objects, lkiArena) &&
    !("resolvedAttackPower" in value) &&
    !("resolvedAttackBasePower" in value) &&
    !("resolvedTotalDefense" in value) &&
    (value.resolvedAttackLki === undefined ||
      (isRecord(value.resolvedAttackLki) &&
        (Object.keys(value.resolvedAttackLki).length === 3 ||
          Object.keys(value.resolvedAttackLki).length === 4) &&
        [
          value.resolvedAttackLki.power,
          value.resolvedAttackLki.basePower,
          value.resolvedAttackLki.totalDefense,
        ].every((amount) => typeof amount === "number" && Number.isFinite(amount) && amount >= 0) &&
        (value.resolvedAttackLki.hasGoAgain === undefined ||
          typeof value.resolvedAttackLki.hasGoAgain === "boolean"))) &&
    (isRecord(value.damage) && value.damage.status === "resolved") ===
      (value.resolvedAttackLki !== undefined) &&
    !("defendingInstanceIds" in value) &&
    isRecord(value.defendingInstanceIdsByTarget) &&
    Object.entries(value.defendingInstanceIdsByTarget).every(
      ([targetId, defenders]) =>
        declaredTargetKeys.has(targetId) &&
        Array.isArray(defenders) &&
        defenders.every(
          (defenderId) => isNonEmptyString(defenderId) && isRecord(objects[defenderId]),
        ),
    ) &&
    (value.reactionInstanceIds === undefined ||
      (Array.isArray(value.reactionInstanceIds) &&
        value.reactionInstanceIds.every(isNonEmptyString))) &&
    Array.isArray(value.wagers) &&
    value.wagers.every(
      (wager) =>
        isRecord(wager) &&
        isNonEmptyString(wager.wagerId) &&
        wager.wagerId.startsWith("wager-") &&
        isNonEmptyString(wager.controllerId) &&
        seated.has(wager.controllerId) &&
        isNonEmptyString(wager.attackingPlayerId) &&
        seated.has(wager.attackingPlayerId) &&
        isNonEmptyString(wager.defendingPlayerId) &&
        seated.has(wager.defendingPlayerId) &&
        wager.attackingPlayerId !== wager.defendingPlayerId &&
        (wager.prize === null || isValidWagerPrize(wager.prize)),
    )
  );
}

function isValidWagerPrize(prize: unknown): boolean {
  if (!isRecord(prize)) return false;
  if (prize.kind === "create-token") {
    return (
      Array.isArray(prize.canonicalIds) &&
      prize.canonicalIds.length > 0 &&
      prize.canonicalIds.every(isNonEmptyString)
    );
  }
  return prize.kind === "effect" && isRecord(prize.effect) && isNonEmptyString(prize.effect.type);
}

function hasValidActiveAttack(
  value: unknown,
  objects: Record<string, unknown>,
  attackProxies: Record<string, unknown>,
  requireLiveProxy: boolean,
): boolean {
  if (!isRecord(value) || !isNonEmptyString(value.sourceObjectId)) return false;
  if (value.kind === "card")
    return (
      isRecord(objects[value.sourceObjectId]) &&
      Object.keys(value).length === 2 &&
      !("proxyId" in value)
    );
  if (value.kind !== "proxy" || !isNonEmptyString(value.proxyId)) return false;
  if (!requireLiveProxy) return Object.keys(value).length === 3;
  const proxy = attackProxies[value.proxyId];
  return (
    Object.keys(value).length === 3 && isRecord(proxy) && proxy.sourceId === value.sourceObjectId
  );
}

function hasValidCombatDamage(
  value: unknown,
  seated: ReadonlySet<string>,
  objects: Record<string, unknown>,
  lkiArena: Record<string, unknown>,
): boolean {
  return (
    isRecord(value) &&
    (value.status === "pending" || value.status === "resolved") &&
    Array.isArray(value.outcomes) &&
    value.outcomes.every(
      (outcome) =>
        isRecord(outcome) &&
        hasValidAttackTargetRef(outcome.target, seated, objects, lkiArena) &&
        typeof outcome.damageDealtByActiveAttack === "number" &&
        outcome.damageDealtByActiveAttack >= 0,
    )
  );
}

function hasValidAttackTargetRef(
  value: unknown,
  seated: ReadonlySet<string>,
  objects: Record<string, unknown>,
  lkiArena: Record<string, unknown>,
): boolean {
  if (!isRecord(value)) return false;
  if (value.kind === "hero") {
    return (
      Object.keys(value).length === 2 &&
      isNonEmptyString(value.playerId) &&
      seated.has(value.playerId)
    );
  }
  if (
    value.kind !== "object" ||
    !isRecord(value.ref) ||
    !isNonEmptyString(value.ref.instanceId) ||
    typeof value.ref.incarnation !== "number" ||
    !Number.isInteger(value.ref.incarnation) ||
    !isNonEmptyString(value.controllerIdAtDeclaration) ||
    !seated.has(value.controllerIdAtDeclaration)
  ) {
    return false;
  }
  const instanceId = value.ref.instanceId;
  const incarnation = value.ref.incarnation;
  const object = objects[instanceId];
  if (isRecord(object) && object.incarnation === incarnation) return true;
  return Object.values(lkiArena).some(
    (snapshot) =>
      isRecord(snapshot) &&
      isRecord(snapshot.ref) &&
      snapshot.ref.instanceId === instanceId &&
      snapshot.ref.incarnation === incarnation,
  );
}

function validAttackTargetKeys(primary: unknown, additional: unknown): ReadonlySet<string> {
  const keys = new Set<string>();
  for (const target of [primary, ...(Array.isArray(additional) ? additional : [])]) {
    if (!isRecord(target)) continue;
    if (target.kind === "hero" && isNonEmptyString(target.playerId)) {
      keys.add(target.playerId);
    } else if (
      target.kind === "object" &&
      isRecord(target.ref) &&
      isNonEmptyString(target.ref.instanceId)
    ) {
      keys.add(target.ref.instanceId);
    }
  }
  return keys;
}

function hasValidLastClosedCombat(value: unknown, seated: ReadonlySet<string>): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.attackingPlayerId) &&
    seated.has(value.attackingPlayerId) &&
    isNonEmptyString(value.defendingPlayerId) &&
    seated.has(value.defendingPlayerId) &&
    !("defendingInstanceIds" in value) &&
    isRecord(value.defendingInstanceIdsByTarget) &&
    Object.values(value.defendingInstanceIdsByTarget).every(
      (defenders) => Array.isArray(defenders) && defenders.every(isNonEmptyString),
    ) &&
    isRecord(value.attackDidHitByInstanceId) &&
    Object.entries(value.attackDidHitByInstanceId).every(
      ([attackId, didHit]) => isNonEmptyString(attackId) && typeof didHit === "boolean",
    ) &&
    isRecord(value.defendedAttackPowersByInstanceId) &&
    Object.entries(value.defendedAttackPowersByInstanceId).every(
      ([defenderId, powers]) =>
        isNonEmptyString(defenderId) &&
        Array.isArray(powers) &&
        powers.every((power) => typeof power === "number" && Number.isFinite(power) && power >= 0),
    )
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function hasCanonicalCompactObjectRecords(record: Record<string, unknown>): boolean {
  if (!isRecord(record.objects)) return false;
  return Object.values(record.objects).every(
    (object) =>
      isRecord(object) &&
      hasValidPersistedObjectDerivation(object, record) &&
      !("underInstanceIds" in object) &&
      !("face" in object) &&
      (object.cardPropertyState === undefined ||
        hasValidCardPropertyState(object.cardPropertyState)) &&
      (object.declarationFacts === undefined ||
        (Array.isArray(object.declarationFacts) &&
          object.declarationFacts.every(hasValidDeclarationFact))) &&
      (object.visibility === undefined || object.visibility === "public") &&
      (object.activeFace === undefined || hasValidActiveFaceState(object.activeFace)) &&
      (object.counters === undefined ||
        (Array.isArray(object.counters) && object.counters.length > 0)) &&
      (object.markers === undefined ||
        (Array.isArray(object.markers) && object.markers.length > 0)),
  );
}

function hasValidDeclarationFact(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (value.kind === "numeric-binding") {
    return (
      Object.keys(value).length === 3 &&
      isNonEmptyString(value.binding) &&
      typeof value.value === "number" &&
      Number.isFinite(value.value)
    );
  }
  if (value.kind === "boost" || value.kind === "rune-gate") {
    return Object.keys(value).length === 1;
  }
  if (value.kind === "scrap") {
    return (
      Object.keys(value).length === 3 &&
      (value.scrappedCanonicalId === null || isNonEmptyString(value.scrappedCanonicalId)) &&
      Array.isArray(value.scrappedNames) &&
      value.scrappedNames.every(isNonEmptyString)
    );
  }
  if (value.kind === "charge") {
    const keys = Object.keys(value);
    if (keys.length === 1) return true;
    const color = value.color;
    const chargedCard = value.chargedCard;
    const chargedCardInstanceId = isRecord(chargedCard) ? chargedCard.instanceId : undefined;
    const chargedCardIncarnation = isRecord(chargedCard) ? chargedCard.incarnation : undefined;
    const validChargedCard =
      isRecord(chargedCard) &&
      Object.keys(chargedCard).length === 2 &&
      isNonEmptyString(chargedCardInstanceId) &&
      typeof chargedCardIncarnation === "number" &&
      Number.isInteger(chargedCardIncarnation) &&
      chargedCardIncarnation >= 0;
    return (
      (keys.length === 2 || keys.length === 3) &&
      (color === null ||
        color === "red" ||
        color === "yellow" ||
        color === "blue" ||
        color === "purple" ||
        color === undefined) &&
      (keys.length === 2
        ? "color" in value
          ? color !== undefined
          : validChargedCard
        : validChargedCard)
    );
  }
  if (value.kind === "played-at-chain-link") {
    return (
      Object.keys(value).length === 2 &&
      Number.isInteger(value.chainLinkNumber) &&
      Number(value.chainLinkNumber) >= 1
    );
  }
  if (value.kind === "played-from") {
    return Object.keys(value).length === 2 && isNonEmptyString(value.zone);
  }
  return (
    value.kind === "fusion" &&
    Array.isArray(value.revealedSupertypes) &&
    value.revealedSupertypes.every(isNonEmptyString)
  );
}

function hasValidPersistedObjectDerivation(
  object: Record<string, unknown>,
  snapshot: Record<string, unknown>,
): boolean {
  if (
    object.objectKind !== "catalog-card" &&
    object.objectKind !== "created-token" &&
    object.objectKind !== "macro"
  ) {
    return false;
  }
  if (!isRecord(object.baseSource)) return false;
  if (object.baseSource.kind === "registered") {
    return Object.keys(object.baseSource).length === 1;
  }
  if (
    object.objectKind !== "created-token" ||
    object.baseSource.kind !== "frozen-copy" ||
    !hasValidFrozenCopyProperties(object.baseSource.copyable) ||
    !isRecord(object.baseSource.source) ||
    !isNonEmptyString(object.baseSource.source.instanceId) ||
    !Number.isInteger(object.baseSource.source.incarnation) ||
    Number(object.baseSource.source.incarnation) < 0 ||
    !isNonEmptyString(object.baseSource.source.canonicalId) ||
    !isNonEmptyString(object.baseSource.createdByEventId)
  ) {
    return false;
  }
  const source = object.baseSource.source;
  const sourceInstanceId = String(source.instanceId);
  const sourceIncarnation = Number(source.incarnation);
  const sourceCanonicalId = String(source.canonicalId);
  const live = isRecord(snapshot.objects) ? snapshot.objects[sourceInstanceId] : undefined;
  if (
    isRecord(live) &&
    live.incarnation === sourceIncarnation &&
    live.canonicalId === sourceCanonicalId
  ) {
    return true;
  }
  if (!isRecord(snapshot.lkiArena)) return false;
  return Object.values(snapshot.lkiArena).some(
    (lki) =>
      isRecord(lki) &&
      isRecord(lki.ref) &&
      lki.ref.instanceId === sourceInstanceId &&
      lki.ref.incarnation === sourceIncarnation &&
      lki.canonicalId === sourceCanonicalId,
  );
}

function hasValidActiveFaceState(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  return (
    value.kind === "paired" &&
    keys.length === 3 &&
    (value.family === "flip" || value.family === "twin" || value.family === "transcend") &&
    Array.isArray(value.activeFaceIds) &&
    value.activeFaceIds.length > 0 &&
    value.activeFaceIds.every(isNonEmptyString)
  );
}

function hasValidCardPropertyState(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  if (value.kind === "whole-card") return keys.length === 1;
  if (value.kind === "meld") return keys.length === 1;
  return (
    value.kind === "face" && keys.length === 2 && (value.face === "left" || value.face === "right")
  );
}

function hasValidPriority(record: Record<string, unknown>): boolean {
  const combat = isRecord(record.combat) ? record.combat : null;
  if (record.priority === null) {
    return (
      record.gameEnded === true ||
      (combat !== null &&
        (combat.step === "close" ||
          (combat.step === "defend" && combat.defenseDeclarationPending === true)))
    );
  }
  if (!isRecord(record.priority)) return false;
  const holder = record.priority.holderPlayerId;
  const kind = record.priority.kind;
  const passes = record.priority.consecutivePasses;
  const combatStep = record.priority.combatStep;
  const origin = record.priority.origin;
  const playerIds = Array.isArray(record.playerIds) ? record.playerIds : [];
  const rulesStack = Array.isArray(record.rulesStack) ? record.rulesStack : [];
  const validCombatStep =
    combatStep === null ||
    combatStep === "layer" ||
    combatStep === "attack" ||
    combatStep === "defend" ||
    combatStep === "reaction" ||
    combatStep === "damage" ||
    combatStep === "resolution" ||
    combatStep === "close";
  const validContext =
    (kind === "action" && combat === null && rulesStack.length === 0 && combatStep === null) ||
    (kind === "layer" && rulesStack.length > 0 && combatStep === (combat?.step ?? null)) ||
    (kind === "combat" &&
      combat !== null &&
      combat.step === combatStep &&
      combat.step !== "layer" &&
      combat.step !== "close" &&
      combat.defenseDeclarationPending !== true);
  return (
    typeof holder === "string" &&
    playerIds.includes(holder) &&
    validCombatStep &&
    validContext &&
    (origin === undefined || isValidOwnActionOrigin(origin)) &&
    typeof passes === "number" &&
    Number.isSafeInteger(passes) &&
    passes >= 0 &&
    passes < playerIds.length
  );
}

function hasOnlyReachableMoveLki(record: Record<string, unknown>): boolean {
  if (!isRecord(record.lkiArena) || !isRecord(record.objects)) return false;
  const lkiArena = record.lkiArena;
  for (const object of Object.values(record.objects)) {
    if (!isRecord(object) || !isRecord(object.history) || !Array.isArray(object.history.moves)) {
      return false;
    }
    for (const move of object.history.moves) {
      if (!isRecord(move)) return false;
      if (move.lki === null) continue;
      if (typeof move.lki !== "string" || !move.lki.startsWith("lki:")) return false;
    }
  }
  try {
    const reachable = collectReachableFabLkiIds({
      objects: record.objects as FabLkiStoreObjects,
      lkiArena: lkiArena as FabLkiStore["lkiArena"],
      rulesStack: Array.isArray(record.rulesStack) ? record.rulesStack : [],
      rulesProcess: record.rulesProcess,
      decision: record.decision,
      delayedTriggers: Array.isArray(record.delayedTriggers) ? record.delayedTriggers : [],
      replacementEffects: Array.isArray(record.replacementEffects) ? record.replacementEffects : [],
      continuousEffectInstances: Array.isArray(record.continuousEffectInstances)
        ? record.continuousEffectInstances
        : [],
      attackProxies: isRecord(record.attackProxies) ? record.attackProxies : {},
      combat: record.combat,
      lastClosedCombat: record.lastClosedCombat,
    });
    const arenaIds = Object.keys(lkiArena);
    return (
      arenaIds.length === reachable.size &&
      arenaIds.every((lkiId) => reachable.has(lkiId as FabLkiId) && isRecord(lkiArena[lkiId]))
    );
  } catch {
    return false;
  }
}

type FabLkiStore = import("../game/lki.ts").FabLkiStore;
type FabLkiStoreObjects = FabLkiStore["objects"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
