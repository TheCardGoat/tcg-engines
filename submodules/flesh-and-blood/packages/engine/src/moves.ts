/**
 * Move registry for the Flesh and Blood rules engine.
 *
 * Core skeleton moves (CR citations in runtime handlers):
 * - `begin-play` — announce a card and begin interactive asset-cost payment (CR 5.1)
 * - `activate` — announce a structured activated ability (CR 5.1)
 * - `defend` — declare defending cards from hand (CR 7.3)
 * - `pass` — pass priority (CR 1.11.4), or declare no defenders during CR 7.3.2
 * - `end-turn` — end phase: pitch-to-bottom, draw-to-intellect, next turn (CR 4.4)
 * - `concede` — lose the game (CR 4.5.3c)
 */
import type { FabSplitPlayMethod } from "./cards.ts";
import type { FabLogActivityReference } from "./log/messages.ts";
import type { CommittedEvent } from "./rules/events.ts";
import type { FabMatchSnapshotV21 } from "./snapshot/match-context.ts";
export type FabMoveName =
  | "begin-play"
  | "set-optional-trigger-automation"
  | "set-automation-preferences"
  | "arm-priority-hold"
  | "answer-decision"
  | "activate"
  | "defend"
  | "pass"
  | "end-turn"
  | "concede";

export const FAB_MOVE_NAMES: readonly FabMoveName[] = [
  "begin-play",
  "set-optional-trigger-automation",
  "set-automation-preferences",
  "arm-priority-hold",
  "answer-decision",
  "activate",
  "defend",
  "pass",
  "end-turn",
  "concede",
];

export function isFabMoveName(value: string): value is FabMoveName {
  return (FAB_MOVE_NAMES as readonly string[]).includes(value);
}

/** Canonical, fail-closed command decoded once at the runtime boundary. */
export type FabCommand =
  | {
      readonly move: "begin-play";
      readonly instanceId: string;
      readonly from?: "hand" | "arsenal" | "banished" | "deck" | "graveyard";
      readonly playPermissionId?: string;
      readonly target?: string;
      readonly additionalTarget?: string;
      readonly boost?: boolean;
      readonly scrap?: boolean;
      readonly scrapInstanceId?: string;
      readonly beatChest?: boolean;
      readonly beatChestInstanceId?: string;
      readonly crank?: boolean;
      /** CR 5.1.2c / 8.3.38: exactly one split-card play method. */
      readonly playMethod?: FabSplitPlayMethod;
      readonly fuse?: boolean;
      readonly fuseInstanceIds?: readonly string[];
      readonly chargeInstanceId?: string;
      /** Graveyard card banished to pay an optional effect additional-cost. */
      readonly banishCostInstanceId?: string;
      /** Generic optional additional costs explicitly declared by the chooser. */
      readonly declaredOptionalCostAbilityIds?: readonly string[];
      /** Ability ids whose generic optional additional costs were accepted. */
      readonly paidOptionalCostAbilityIds?: readonly string[];
    }
  | {
      readonly move: "set-optional-trigger-automation";
      readonly instanceId: string;
      readonly mode: import("./state.ts").FabOptionalTriggerAutomationMode;
      /** Exact active optional-effect prompt this preference also answers. */
      readonly decision?: {
        readonly decisionId: string;
        readonly stateVersion: number;
      };
    }
  | {
      readonly move: "set-automation-preferences";
      /**
       * Additive patch; whole-list writes are deliberately impossible so a
       * stale client can never clobber a list it has not loaded.
       */
      readonly preferences: {
        readonly priorityMode?: import("./state.ts").FabPriorityAutomationMode;
        readonly autoOrderTriggers?: boolean;
        readonly autoSelectSingletonTargets?: boolean;
        readonly addPlayAndSkipHoldCardId?: string;
        readonly removePlayAndSkipHoldCardId?: string;
        readonly addOpponentTriggerYieldCardId?: string;
        readonly removeOpponentTriggerYieldCardId?: string;
        readonly addInstantYieldCardId?: string;
        readonly removeInstantYieldCardId?: string;
      };
    }
  | { readonly move: "arm-priority-hold" }
  | {
      readonly move: "activate";
      readonly instanceId: string;
      readonly ability?: string;
      readonly target?: string;
      readonly alternativeCostIndex?: number;
    }
  | { readonly move: "defend"; readonly instanceIds: readonly string[] }
  | {
      readonly move: "answer-decision";
      readonly decisionId: string;
      readonly stateVersion: number;
      readonly answer: unknown;
      /**
       * Answers consecutive decisions exposed as one player-facing choice.
       * Each answer is validated against the decision produced by the prior
       * answer, and the entire sequence commits as one command.
       */
      readonly followUpAnswers?: readonly unknown[];
    }
  | { readonly move: "pass" }
  | ({ readonly move: "end-turn"; readonly traverse?: boolean } & (
      | { readonly arsenalInstanceId: string; readonly chooseArsenal?: never }
      | { readonly chooseArsenal: true; readonly arsenalInstanceId?: never }
      | { readonly arsenalInstanceId?: never; readonly chooseArsenal?: never }
    ))
  | { readonly move: "concede"; readonly reason?: string };

export function decodeFabCommand(
  move: FabMoveName,
  payload: Record<string, unknown>,
): FabCommand | null {
  const keys = Object.keys(payload);
  const hasOnly = (allowed: readonly string[]) => keys.every((key) => allowed.includes(key));
  const isIdentifier = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;
  const optionalString = (value: unknown) => value === undefined || isIdentifier(value);
  const optionalBoolean = (value: unknown) => value === undefined || typeof value === "boolean";
  const optionalStringArray = (value: unknown) =>
    value === undefined || (Array.isArray(value) && value.every(isIdentifier));
  const optionalPlayMethod = (value: unknown): value is FabSplitPlayMethod | undefined => {
    if (value === undefined) return true;
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    const method = value as Record<string, unknown>;
    const methodKeys = Object.keys(method);
    if (method.kind === "meld") return methodKeys.length === 1;
    return (
      method.kind === "face" &&
      methodKeys.length === 2 &&
      (method.face === "left" || method.face === "right")
    );
  };
  switch (move) {
    case "set-optional-trigger-automation": {
      if (!hasOnly(["instanceId", "mode", "decision"])) return null;
      if (!isIdentifier(payload.instanceId)) return null;
      if (
        payload.mode !== "ask" &&
        payload.mode !== "auto-accept" &&
        payload.mode !== "auto-decline"
      )
        return null;
      if (payload.decision !== undefined) {
        if (
          typeof payload.decision !== "object" ||
          payload.decision === null ||
          Array.isArray(payload.decision)
        )
          return null;
        const decision = payload.decision as Record<string, unknown>;
        if (
          Object.keys(decision).some((key) => key !== "decisionId" && key !== "stateVersion") ||
          !isIdentifier(decision.decisionId) ||
          !Number.isSafeInteger(decision.stateVersion) ||
          (decision.stateVersion as number) < 0
        )
          return null;
        return {
          move,
          instanceId: payload.instanceId,
          mode: payload.mode,
          decision: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion as number,
          },
        };
      }
      return { move, instanceId: payload.instanceId, mode: payload.mode };
    }
    case "set-automation-preferences": {
      if (
        !hasOnly([
          "priorityMode",
          "autoOrderTriggers",
          "autoSelectSingletonTargets",
          "addPlayAndSkipHoldCardId",
          "removePlayAndSkipHoldCardId",
          "addOpponentTriggerYieldCardId",
          "removeOpponentTriggerYieldCardId",
          "addInstantYieldCardId",
          "removeInstantYieldCardId",
        ])
      )
        return null;
      if (
        payload.priorityMode !== undefined &&
        payload.priorityMode !== "auto-pass" &&
        payload.priorityMode !== "always-hold" &&
        payload.priorityMode !== "play-and-skip"
      )
        return null;
      if (!optionalBoolean(payload.autoOrderTriggers)) return null;
      if (!optionalBoolean(payload.autoSelectSingletonTargets)) return null;
      const identifierKeys = [
        "addPlayAndSkipHoldCardId",
        "removePlayAndSkipHoldCardId",
        "addOpponentTriggerYieldCardId",
        "removeOpponentTriggerYieldCardId",
        "addInstantYieldCardId",
        "removeInstantYieldCardId",
      ] as const;
      if (identifierKeys.some((key) => !optionalString(payload[key]))) return null;
      const preferences: Record<string, unknown> = {};
      if (payload.priorityMode !== undefined) preferences.priorityMode = payload.priorityMode;
      if (payload.autoOrderTriggers !== undefined)
        preferences.autoOrderTriggers = payload.autoOrderTriggers;
      if (payload.autoSelectSingletonTargets !== undefined)
        preferences.autoSelectSingletonTargets = payload.autoSelectSingletonTargets;
      for (const key of identifierKeys) {
        if (payload[key] !== undefined) preferences[key] = payload[key];
      }
      if (Object.keys(preferences).length === 0) return null;
      return {
        move,
        preferences: preferences as Extract<
          FabCommand,
          { readonly move: "set-automation-preferences" }
        >["preferences"],
      };
    }
    case "arm-priority-hold": {
      if (!hasOnly([])) return null;
      return { move };
    }
    case "begin-play": {
      if (
        !hasOnly([
          "instanceId",
          "from",
          "playPermissionId",
          "target",
          "additionalTarget",
          "boost",
          "scrap",
          "scrapInstanceId",
          "beatChest",
          "beatChestInstanceId",
          "crank",
          "playMethod",
          "fuse",
          "fuseInstanceIds",
          "chargeInstanceId",
          "banishCostInstanceId",
          "declaredOptionalCostAbilityIds",
          "paidOptionalCostAbilityIds",
        ])
      )
        return null;
      if (
        !isIdentifier(payload.instanceId) ||
        !optionalString(payload.playPermissionId) ||
        !optionalString(payload.target) ||
        !optionalString(payload.additionalTarget) ||
        !optionalString(payload.scrapInstanceId) ||
        !optionalString(payload.beatChestInstanceId) ||
        !optionalString(payload.chargeInstanceId) ||
        !optionalString(payload.banishCostInstanceId) ||
        !optionalStringArray(payload.declaredOptionalCostAbilityIds) ||
        !optionalStringArray(payload.paidOptionalCostAbilityIds) ||
        !optionalBoolean(payload.boost) ||
        !optionalBoolean(payload.scrap) ||
        !optionalBoolean(payload.beatChest) ||
        !optionalBoolean(payload.crank) ||
        !optionalPlayMethod(payload.playMethod) ||
        !optionalBoolean(payload.fuse) ||
        !optionalStringArray(payload.fuseInstanceIds)
      )
        return null;
      const from = payload.from;
      if (
        from !== undefined &&
        from !== "hand" &&
        from !== "arsenal" &&
        from !== "banished" &&
        from !== "deck" &&
        from !== "graveyard"
      )
        return null;
      return {
        move,
        instanceId: payload.instanceId,
        ...(from ? { from } : {}),
        ...(typeof payload.playPermissionId === "string"
          ? { playPermissionId: payload.playPermissionId }
          : {}),
        ...(typeof payload.target === "string" ? { target: payload.target } : {}),
        ...(typeof payload.additionalTarget === "string"
          ? { additionalTarget: payload.additionalTarget }
          : {}),
        ...(typeof payload.boost === "boolean" ? { boost: payload.boost } : {}),
        ...(typeof payload.scrap === "boolean" ? { scrap: payload.scrap } : {}),
        ...(typeof payload.scrapInstanceId === "string"
          ? { scrapInstanceId: payload.scrapInstanceId }
          : {}),
        ...(typeof payload.beatChest === "boolean" ? { beatChest: payload.beatChest } : {}),
        ...(typeof payload.beatChestInstanceId === "string"
          ? { beatChestInstanceId: payload.beatChestInstanceId }
          : {}),
        ...(typeof payload.crank === "boolean" ? { crank: payload.crank } : {}),
        ...(payload.playMethod ? { playMethod: payload.playMethod } : {}),
        ...(typeof payload.fuse === "boolean" ? { fuse: payload.fuse } : {}),
        ...(Array.isArray(payload.fuseInstanceIds)
          ? { fuseInstanceIds: payload.fuseInstanceIds }
          : {}),
        ...(typeof payload.chargeInstanceId === "string"
          ? { chargeInstanceId: payload.chargeInstanceId }
          : {}),
        ...(typeof payload.banishCostInstanceId === "string"
          ? { banishCostInstanceId: payload.banishCostInstanceId }
          : {}),
        ...(Array.isArray(payload.declaredOptionalCostAbilityIds)
          ? { declaredOptionalCostAbilityIds: payload.declaredOptionalCostAbilityIds }
          : {}),
        ...(Array.isArray(payload.paidOptionalCostAbilityIds)
          ? { paidOptionalCostAbilityIds: payload.paidOptionalCostAbilityIds }
          : {}),
      };
    }
    case "activate":
      return hasOnly(["instanceId", "ability", "target", "alternativeCostIndex"]) &&
        isIdentifier(payload.instanceId) &&
        optionalString(payload.ability) &&
        optionalString(payload.target) &&
        (payload.alternativeCostIndex === undefined ||
          (typeof payload.alternativeCostIndex === "number" &&
            Number.isInteger(payload.alternativeCostIndex) &&
            payload.alternativeCostIndex >= 0))
        ? {
            move,
            instanceId: payload.instanceId,
            ...(typeof payload.ability === "string" ? { ability: payload.ability } : {}),
            ...(typeof payload.target === "string" ? { target: payload.target } : {}),
            ...(typeof payload.alternativeCostIndex === "number"
              ? { alternativeCostIndex: payload.alternativeCostIndex }
              : {}),
          }
        : null;
    case "defend":
      return hasOnly(["instanceIds"]) &&
        Array.isArray(payload.instanceIds) &&
        payload.instanceIds.every(isIdentifier)
        ? { move, instanceIds: payload.instanceIds }
        : null;
    case "answer-decision":
      return hasOnly(["decisionId", "stateVersion", "answer", "followUpAnswers"]) &&
        isIdentifier(payload.decisionId) &&
        typeof payload.stateVersion === "number" &&
        Number.isFinite(payload.stateVersion) &&
        (payload.followUpAnswers === undefined || Array.isArray(payload.followUpAnswers)) &&
        "answer" in payload
        ? {
            move,
            decisionId: payload.decisionId,
            stateVersion: payload.stateVersion,
            answer: payload.answer,
            ...(Array.isArray(payload.followUpAnswers)
              ? { followUpAnswers: payload.followUpAnswers }
              : {}),
          }
        : null;
    case "pass":
      return hasOnly([]) ? { move } : null;
    case "end-turn": {
      if (
        !hasOnly(["arsenalInstanceId", "traverse", "chooseArsenal"]) ||
        !optionalString(payload.arsenalInstanceId) ||
        !optionalBoolean(payload.traverse) ||
        (payload.chooseArsenal !== undefined && payload.chooseArsenal !== true) ||
        (typeof payload.arsenalInstanceId === "string" && payload.chooseArsenal === true)
      ) {
        return null;
      }
      const traverse = typeof payload.traverse === "boolean" ? { traverse: payload.traverse } : {};
      if (typeof payload.arsenalInstanceId === "string") {
        return { move, arsenalInstanceId: payload.arsenalInstanceId, ...traverse };
      }
      if (payload.chooseArsenal === true) {
        return { move, chooseArsenal: true, ...traverse };
      }
      return { move, ...traverse };
    }
    case "concede":
      return hasOnly(["reason"]) && optionalString(payload.reason)
        ? { move, ...(typeof payload.reason === "string" ? { reason: payload.reason } : {}) }
        : null;
  }
}

/** A player-readable message emitted as part of a command receipt. */
export interface FabMoveLogObjectReference {
  /** Physical object identity retained from the event's last known information. */
  readonly instanceId: string;
  /** Printed identity used for an exact preview without guessing from a display name. */
  readonly canonicalId: string | null;
}

/**
 * The game-native role a card or ability served in a combat chain. This is
 * semantic receipt data, not a display label: consumers must not infer it
 * from a card name or from a card's current zone after combat has closed.
 */
export type FabCombatLogRole = "attack" | "block" | "attack-reaction" | "defense-reaction";

/** Authoritative evaluated combat totals attached to an immutable receipt. */
export interface FabCombatValueSnapshot {
  readonly attack: number;
  readonly defense: number;
}

export type FabCombatLogState =
  | { readonly kind: "attack"; readonly after: FabCombatValueSnapshot }
  | {
      readonly kind: "defense";
      readonly cardDefense: number;
    }
  | {
      readonly kind: "reaction";
      readonly role: "attack-reaction" | "defense-reaction";
      readonly before: FabCombatValueSnapshot;
      readonly after: FabCombatValueSnapshot;
    }
  | {
      readonly kind: "outcome";
      readonly final: FabCombatValueSnapshot;
      readonly damage: number;
    };

export interface FabMoveLogMessage {
  readonly key: string;
  readonly values?: Readonly<Record<string, string | number | boolean | null>>;
  /** Stack/layer provenance for grouping facts across command receipts. */
  readonly activityRef?: FabLogActivityReference;
  /** Event-specific player-history treatment when provenance changes a key's default role. */
  readonly narrativeRole?: import("./log/messages.ts").FabLogNarrativeRole;
  /** Combat role for a card or ability used while a combat chain is open. */
  readonly combatRole?: FabCombatLogRole;
  /** Numeric combat truth captured by the engine, never reconstructed by UI. */
  readonly combatState?: FabCombatLogState;
  /**
   * Object references keyed by the interpolation slot they describe. Keeping
   * them separate from `values` preserves translatable prose while allowing a
   * viewer projection to build exact, privacy-safe card affordances.
   */
  readonly objectRefs?: Readonly<Partial<Record<string, FabMoveLogObjectReference>>>;
  readonly defaultMessage: string;
}

/**
 * A semantic, command-local log entry. Event names and reducer details never
 * escape through this contract; callers may safely persist these records.
 */
export interface FabMoveLog {
  /** Stable identity of the accepted command that produced this semantic log. */
  readonly commandId: string;
  readonly moveType: FabMoveName;
  readonly playerId: string;
  readonly timestamp: number;
  /** Stable ordering among logs emitted by the same accepted command. */
  readonly sequence: number;
  readonly turnNumber: number;
  readonly public: readonly FabMoveLogMessage[];
  readonly privateByPlayerId?: Readonly<Record<string, readonly FabMoveLogMessage[]>>;
}

export type FabCommandStatus = "settled" | "awaiting-decision" | "game-ended";

/** Information exposure that makes an earlier server snapshot unsafe to offer as undo. */
export type FabUndoBarrierReason =
  | "draw"
  | "reveal"
  | "move-hidden-to-public"
  | "look-hidden-zone"
  | "search-hidden-zone"
  | "shuffle"
  | "random-result";

export interface FabUndoBarrier {
  readonly reasons: readonly FabUndoBarrierReason[];
}

/** Deterministic metadata supplied once by the command owner. */
export interface FabCommandExecutionContext {
  readonly commandId: string;
  readonly timestamp: number;
}

/** Complete command input for the pure state-transition boundary. */
export interface FabCommandTransition {
  readonly actorId: string;
  readonly command: FabCommand;
  readonly execution?: FabCommandExecutionContext;
}

/** Result of a typed FAB command transition. */
export type FabCommandResult = FabCommandSuccess | FabCommandFailure;

export type FabCommandOutcome =
  | { readonly kind: "applied" }
  | {
      readonly kind: "rules-action-reversed";
      readonly action: "play-card" | "activate";
      readonly reason: import("./procedures/reversal.ts").FabRulesActionReversalReason;
    };

export interface FabCommandSuccess {
  readonly success: true;
  readonly stateID: number;
  readonly state: import("./kernel/transaction-kernel.ts").FabRulesSnapshot;
  /** The already-validated persistence DTO for this exact accepted state. */
  readonly snapshot: FabMatchSnapshotV21;
  readonly actorId: string;
  readonly processedCommand: FabCommand;
  readonly execution: FabCommandExecutionContext;
  readonly outcome: FabCommandOutcome;
  /** One localizable player-narrative receipt for this accepted command. */
  readonly playerLog: import("./player-log.ts").FabPlayerLog;
  readonly moveLogs: readonly FabMoveLog[];
  /**
   * Command-local rules events retained for trusted in-process consumers such
   * as the server adapter. These events can contain private object snapshots
   * and must never be serialized directly to a viewer.
   */
  readonly committedEvents: readonly CommittedEvent[];
  readonly status: FabCommandStatus;
  /** Null means the server may retain its pre-command snapshot under its own undo policy. */
  readonly undoBarrier: FabUndoBarrier | null;
}

export interface FabCommandFailure {
  readonly success: false;
  readonly error: string;
  readonly errorCode?: string;
  readonly currentStateID: number;
  /** Trusted local diagnostic data. Adapters must not project it to players. */
  readonly diagnostic?: FabInvalidTransitionDiagnostic;
}

export interface FabInvalidTransitionDiagnostic {
  readonly commandId: string;
  readonly failedInvariant: string;
  readonly baseStateID: number;
  readonly candidateStateID?: number;
  readonly processId?: string;
  readonly decisionId?: string;
  readonly rejectedCandidate?: unknown;
}
