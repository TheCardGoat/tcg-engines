/**
 * Fluent helper namespace exposed as `game.helpers` on {@link FabTestEngine}.
 *
 * Type-only imports stay inside `testing/` so this module never loads the
 * engine barrel (and its automation catalog side effects) at runtime.
 */
import type { FabCardRef } from "./test-fixtures.ts";
import type { FabTestEngine } from "./test-engine.ts";
import type { FabPlayerHandle } from "./player-handle.ts";
import type { FabMoveLogMessage } from "../moves.ts";
import type { FabLogKey, FabLogMessageValuesByName } from "../log/messages.ts";
import {
  expectCombat,
  expectFabPlayer,
  type FabCombatAssert,
  type FabPlayerAssert,
} from "./fluent-assert.ts";
import type { FabAttackFlowPlayOptions } from "./play-options.ts";
import { fabListedPartitionGroups } from "./intent.ts";

/** Play option shapes accepted by {@link FabTestHelpers.attackToDefend}. */
export type FabAttackToDefendOptions = FabAttackFlowPlayOptions;

/** Decisions that {@link FabTestHelpers.resolveUntilIdle} may answer explicitly. */
export interface FabResolveUntilIdleOptions {
  /**
   * Same policy as {@link FabTestEngine.untilIdle}: answer optional boolean /
   * pay-decline prompts. Omit (or `"throw"`) to require an explicit test answer.
   */
  readonly optionals?: "decline" | "accept" | "throw";
  /** Answer optional boolean decisions with this value. Omit to require an explicit test answer. */
  readonly optionalBoolean?: boolean;
  /** Select all or no optional choices. Omit to require an explicit test answer. */
  readonly optionalOptions?: "all" | "none";
  /** Select the first legal entity target(s) when the test scenario requires a target.
   * `"maximum"` picks the printed upper bound (needed for `up-to` / min 0). */
  readonly entityTargets?: "minimum" | "maximum";
  /** Select one entity target by its real catalog identity. */
  readonly entityTargetCanonicalId?: string;
  /** Pitch one payment card by its real catalog identity. */
  readonly paymentCanonicalId?: string;
  /** Answer an effect-resolution prompt by unique option id or label substring. */
  readonly effectResolution?: string;
  /** Preserve the engine-presented order for an ordering decision. */
  readonly ordering?: "listed";
  /** Safety cap for passes and decision answers. */
  readonly maxSteps?: number;
}

/**
 * Test-only convenience verbs grouped under one namespace. Every method is a
 * thin wrapper over the public {@link FabTestEngine} surface — it never
 * reimplements rules logic.
 */
export class FabTestHelpers {
  private readonly engine: FabTestEngine;

  constructor(engine: FabTestEngine) {
    this.engine = engine;
  }

  /** Fluent assertions over the game's public combat projection. */
  expectCombat(): FabCombatAssert {
    return expectCombat(this.engine);
  }

  /** Fluent assertions over one player's public state. */
  expectPlayer(player: FabPlayerHandle): FabPlayerAssert {
    return expectFabPlayer(player);
  }

  /**
   * Play an attack card layer, resolve it, then pass Attack → Defend. When
   * `defender` is omitted, the attacker's sole opponent is targeted.
   */
  attackToDefend(
    attacker: FabPlayerHandle,
    card: FabCardRef,
    defender?: FabPlayerHandle,
    options: FabAttackToDefendOptions = {},
  ): void {
    const defenderId = defender?.id ?? this.soleOpponentIdOf(attacker.id);
    this.engine.attackToDefendInternal(attacker, card, defenderId, options);
  }

  /** From Defend step (blocks already declared or not), pass through to closed combat. */
  resolveRestOfCombat(): void {
    this.engine.resolveCombatNoReactions();
  }

  /** Intent drain to the reaction step (attacker priority unless `as: "defender"`). */
  toReaction(as: "attacker" | "defender" = "attacker"): void {
    this.engine.toReaction(as);
  }

  /** Intent drain: close combat. Optionals throw unless `optionals` is set. */
  closeCombat(policy?: Parameters<FabTestEngine["closeCombat"]>[0]): void {
    this.engine.closeCombat(policy);
  }

  /** Intent drain: action-phase idle. */
  untilIdle(policy?: Parameters<FabTestEngine["untilIdle"]>[0]): void {
    this.engine.untilIdle(policy);
  }

  /**
   * Resolve public priority until neither combat nor a rules layer remains.
   * Forced decisions are answered automatically; optional choices must be
   * declared by the test so the scenario stays player-visible.
   */
  resolveUntilIdle(options: FabResolveUntilIdleOptions = {}): void {
    const maxSteps = options.maxSteps ?? 96;
    for (let step = 0; step < maxSteps; step += 1) {
      const decision = this.engine.getState().decision;
      if (decision) {
        if (this.engine.answerForcedDecision()) continue;
        const optionalBoolean =
          options.optionalBoolean ??
          (options.optionals === "accept"
            ? true
            : options.optionals === "decline"
              ? false
              : undefined);
        if (decision.kind === "boolean" && optionalBoolean !== undefined) {
          this.engine.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "boolean", value: optionalBoolean },
            },
          });
          continue;
        }
        if (decision.kind === "option" && optionalBoolean !== undefined) {
          const pay = decision.options.find(
            (option) => option.id === "pay" || /pay/i.test(option.label),
          );
          const decline = decision.options.find(
            (option) => option.id === "decline" || /decline/i.test(option.label),
          );
          const chosen = optionalBoolean ? pay : decline;
          if (chosen) {
            this.engine.exec({
              move: "answer-decision",
              actorId: decision.actorId,
              payload: {
                decisionId: decision.decisionId,
                stateVersion: decision.stateVersion,
                answer: { kind: "option", optionIds: [chosen.id] },
              },
            });
            continue;
          }
        }
        if (decision.kind === "option" && options.optionalOptions) {
          this.engine.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "option",
                optionIds:
                  options.optionalOptions === "all"
                    ? decision.options.map((option) => option.id)
                    : [],
              },
            },
          });
          continue;
        }
        if (
          decision.kind === "entity-target" &&
          (options.entityTargets === "minimum" || options.entityTargets === "maximum")
        ) {
          const take =
            options.entityTargets === "maximum"
              ? Math.min(decision.max, decision.candidates.length)
              : decision.min;
          const instanceIds = decision.candidates
            .slice(0, take)
            .map((candidate) => candidate.instanceId);
          if (instanceIds.length !== take) {
            throw new Error(`Cannot select ${take} target(s) for ${decision.decisionId}.`);
          }
          this.engine.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "entity-target", instanceIds },
            },
          });
          continue;
        }
        if (decision.kind === "entity-target" && options.entityTargetCanonicalId) {
          const candidate = decision.candidates.find(
            (entry) =>
              this.engine.getState().objects[entry.instanceId]?.canonicalId ===
              options.entityTargetCanonicalId,
          );
          if (!candidate && decision.min > 0) {
            throw new Error(
              `Cannot select ${options.entityTargetCanonicalId} for ${decision.decisionId}.`,
            );
          }
          this.engine.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "entity-target",
                instanceIds: candidate ? [candidate.instanceId] : [],
              },
            },
          });
          continue;
        }
        if (decision.kind === "effect-resolution" && options.effectResolution) {
          const needle = options.effectResolution.toLowerCase();
          const matches = decision.options.filter(
            (option) =>
              option.id.toLowerCase() === needle ||
              option.id.toLowerCase().includes(needle) ||
              option.label.toLowerCase().includes(needle),
          );
          if (matches.length !== 1) {
            throw new Error(
              `effectResolution "${options.effectResolution}" matched ${matches.length} option(s).`,
            );
          }
          this.engine.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "effect-resolution", optionId: matches[0]!.id },
            },
          });
          continue;
        }
        if (decision.kind === "payment" && options.paymentCanonicalId) {
          const candidate = decision.candidates.find(
            (entry) =>
              this.engine.getState().objects[entry.instanceId]?.canonicalId ===
              options.paymentCanonicalId,
          );
          if (!candidate) {
            throw new Error(
              `Cannot select payment ${options.paymentCanonicalId} for ${decision.decisionId}.`,
            );
          }
          this.engine.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "payment", instanceIds: [candidate.instanceId] },
            },
          });
          continue;
        }
        if (decision.kind === "ordering" && options.ordering === "listed") {
          this.engine.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
            },
          });
          continue;
        }
        if (decision.kind === "partition" && options.ordering === "listed") {
          this.engine.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "partition", groups: fabListedPartitionGroups(decision) },
            },
          });
          continue;
        }
        throw new Error(
          `resolveUntilIdle requires an explicit ${decision.kind} answer for ${decision.decisionId}.`,
        );
      }
      const state = this.engine.getState();
      if (!this.engine.combat()?.open && state.rulesStack.length === 0 && !state.rulesProcess)
        return;
      this.engine.passBoth();
    }
    throw new Error(`resolveUntilIdle exceeded ${maxSteps} steps.`);
  }

  /** Pass public priority until `player` holds it, or fail instead of silently continuing. */
  passPriorityTo(player: FabPlayerHandle, maxPasses = 4): void {
    for (let pass = 0; pass < maxPasses; pass += 1) {
      if (player.hasPriority()) return;
      const actorId = this.engine.getState().priority?.holderPlayerId ?? null;
      if (!actorId) break;
      this.engine.pass(actorId);
    }
    throw new Error(`Could not pass priority to ${player.id}.`);
  }

  /** Assert the current combat step (fluent `expectStep` surface). */
  expectStep(step: string): void {
    const combat = this.engine.combat();
    if (combat?.step !== step) {
      throw new Error(`Expected combat step "${step}", got "${combat?.step ?? "closed"}"`);
    }
  }

  /**
   * Search the transient player-log receipt for a substring (or regex) match against
   * entry messages or move names. Lifted from the duplicated
   * `*-production-helpers.ts` copies.
   */
  logHas(pattern: string | RegExp): boolean {
    const test =
      typeof pattern === "string"
        ? (text: string) => text.includes(pattern)
        : (text: string) => pattern.test(text);
    return this.engine.playerLogs().some((entry) => test(entry.message) || test(entry.move));
  }

  /**
   * Assert a canonical PUBLIC log message with the given key (and optional
   * typed value subset) exists on the accumulated move-log receipts.
   */
  expectLog<TKey extends FabLogKey>(
    key: TKey,
    values?: Partial<FabLogMessageValuesByName[TKey]>,
  ): void {
    const seenPublicKeys = new Set<string>();
    for (const log of this.engine.moveLogs()) {
      for (const message of log.public) {
        if (message.key === key && fabLogValuesMatch(message, values)) return;
        seenPublicKeys.add(message.key);
      }
    }
    const detail = values ? ` matching ${JSON.stringify(values)}` : "";
    throw new Error(
      `Expected a public "${key}" log message${detail}. Public keys logged: ` +
        `${seenPublicKeys.size > 0 ? [...seenPublicKeys].sort().join(", ") : "(none)"}.`,
    );
  }

  /** Assert that no canonical PUBLIC log with this key/value subset exists. */
  expectNoPublicLog<TKey extends FabLogKey>(
    key: TKey,
    values?: Partial<FabLogMessageValuesByName[TKey]>,
  ): void {
    for (const log of this.engine.moveLogs()) {
      const found = log.public.find(
        (message) => message.key === key && fabLogValuesMatch(message, values),
      );
      if (!found) continue;
      const detail = values ? ` matching ${JSON.stringify(values)}` : "";
      throw new Error(`Expected no public "${key}" log message${detail}, but one was emitted.`);
    }
  }

  /**
   * Assert a private appendix message with the given key exists for every
   * listed viewer and never leaks publicly or into another seat's appendix.
   */
  expectPrivateLog<TKey extends FabLogKey>(
    key: TKey,
    visibleTo: string | readonly string[],
    values?: Partial<FabLogMessageValuesByName[TKey]>,
  ): void {
    const viewers = typeof visibleTo === "string" ? [visibleTo] : [...visibleTo];
    if (viewers.length === 0) {
      throw new Error("expectPrivateLog requires at least one viewer.");
    }
    const logs = this.engine.moveLogs();
    if (
      logs.some((log) =>
        log.public.some((message) => message.key === key && fabLogValuesMatch(message, values)),
      )
    ) {
      throw new Error(`Private "${key}" log message leaked into a public list.`);
    }
    const privateKeysByViewer = new Map<string, Set<string>>();
    for (const log of logs) {
      for (const [viewer, messages] of Object.entries(log.privateByPlayerId ?? {})) {
        for (const message of messages) {
          const keys = privateKeysByViewer.get(viewer) ?? new Set<string>();
          keys.add(message.key);
          privateKeysByViewer.set(viewer, keys);
        }
      }
    }
    for (const viewer of viewers) {
      const found = logs.some((log) =>
        (log.privateByPlayerId?.[viewer] ?? []).some(
          (message) => message.key === key && fabLogValuesMatch(message, values),
        ),
      );
      if (found) continue;
      const seen = privateKeysByViewer.get(viewer);
      const detail = values ? ` matching ${JSON.stringify(values)}` : "";
      throw new Error(
        `Expected a private "${key}" log message${detail} for ${viewer}. Private keys for ` +
          `${viewer}: ${seen && seen.size > 0 ? [...seen].sort().join(", ") : "(none)"}.`,
      );
    }
    for (const other of this.engine.getState().playerIds) {
      if (viewers.includes(other)) continue;
      if (
        logs.some((log) =>
          (log.privateByPlayerId?.[other] ?? []).some(
            (message) => message.key === key && fabLogValuesMatch(message, values),
          ),
        )
      ) {
        throw new Error(`Private "${key}" log message leaked to ${other}.`);
      }
    }
  }

  /** Resolve the sole opposing seat (1v1 product scope). */
  private soleOpponentIdOf(playerId: string): string {
    const opponents = this.engine.getState().playerIds.filter((id) => id !== playerId);
    if (opponents.length !== 1) {
      throw new Error(
        `Cannot derive a sole opponent for ${playerId} (found ${opponents.length}; product scope is 1v1).`,
      );
    }
    return opponents[0]!;
  }
}

/** Partial equality over the primitive interpolation values of one message. */
function fabLogValuesMatch(message: FabMoveLogMessage, expected: object | undefined): boolean {
  if (!expected) return true;
  return Object.entries(expected).every(([name, value]) => message.values?.[name] === value);
}
