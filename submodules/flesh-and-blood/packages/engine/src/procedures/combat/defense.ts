import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabMatchState } from "../../state.ts";
import { compileFabContinuousEffect } from "../../rules/continuous/compiler.ts";
import type { ProposedEvent } from "../../rules/events.ts";
import type { FabDefenseQuote } from "../../rules/legality-quotes.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import { isHeroAttackTarget } from "../../rules/combat-target.ts";
import { executeFabEventTransaction } from "../../kernel/transaction/index.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import { exactAttackBinding } from "../../rules/exact-attack.ts";

export type FabDefenseResult =
  | { readonly accepted: true; readonly state: FabMatchState }
  | {
      readonly accepted: false;
      readonly state: FabMatchState;
      readonly error: string;
      readonly errorCode: string;
    };

/** Declares legal hand, Arsenal, and equipped defenders as one atomic event batch. */
export function declareFabDefenders(
  current: FabMatchState,
  actorId: string,
  instanceIds: readonly string[],
  options: FabEventTransactionOptions,
): FabDefenseResult {
  return executeFabDefenseQuote(
    current,
    buildFabRulesView(current).quoteDefense({ actorId, instanceIds }),
    options,
  );
}

/** Execute only the exact defense quote produced for this authoritative state version. */
export function executeFabDefenseQuote(
  current: FabMatchState,
  quote: FabDefenseQuote,
  options: FabEventTransactionOptions,
): FabDefenseResult {
  if (quote.stateID !== current.stateID)
    return failure(current, "The defense quote is stale.", "stale_defense_quote");
  if (!quote.allowed) return failure(current, quote.reason, quote.reasonCode);
  const { actorId } = quote.request;
  const link = current.combat?.activeLink;
  if (!link || quote.attack === null)
    return failure(current, "The defense quote is incomplete.", "invalid_defense_quote");
  const attack = snapshotObject(
    current,
    link.activeAttack.sourceObjectId,
    link.attackingPlayerId,
    "combatChain",
  );
  const attackBinding = exactAttackBinding(link.activeAttack, attack);
  const defenders = quote.defenders.map((entry) => ({
    object: snapshotObject(current, entry.ref.instanceId, actorId, entry.origin),
    origin: entry.origin,
  }));
  const view = buildFabRulesView(current);
  const attackHasFragment = view
    .object(attack.ref)
    ?.current.keywords.some((keyword) => keyword.name === "fragment");
  const fragmentEffect: FabEffect = {
    type: "modify-numeric",
    property: "power",
    op: "add",
    amount: -2,
    target: { selector: "self" },
    duration: "this-chain-link",
  };
  const result = executeFabEventTransaction(
    current,
    (processId) => {
      const events: ProposedEvent[] = [];
      // CR 7.3.2d: all declared cards for an attack-target become defending
      // as a single multi-event; the declaration order fixes the object order
      // inside it (CR 7.3.2c).
      const defendOccurrence =
        defenders.length > 1
          ? {
              occurrenceId: `occurrence-${processId}-defend` as const,
              namedEvent: "defend",
            }
          : undefined;
      for (const { object, origin } of defenders) {
        events.push({
          name: "defend",
          processId,
          cause: { kind: "player-command", actorId, command: "defend" },
          controllerId: actorId,
          source: object,
          affected: [object],
          bindings: { defendingCard: object, attack: attackBinding },
          data: { actorId, object, attack, from: origin, origin, destinationRef: null },
          ...(defendOccurrence ? { multiEvent: defendOccurrence } : {}),
        });
        const defense = view.object(object.ref)?.current.numeric.defense;
        if (!attackHasFragment || defense === undefined || defense < 2) continue;
        const effectId = `${processId}:fragment:${object.ref.instanceId}:continuous`;
        const compiled = compileFabContinuousEffect({ effectId, effect: fragmentEffect });
        if (!compiled.ok) throw new Error(compiled.error.mechanic);
        const eventBase = {
          processId,
          cause: {
            kind: "rule" as const,
            rule: "fragment",
            controllerId: link.attackingPlayerId,
          },
          controllerId: link.attackingPlayerId,
          source: attack,
          affected: [attack],
          bindings: { defendingCard: object, attack: attackBinding },
        };
        events.push({
          ...eventBase,
          name: "fragment",
          data: { actorId: link.attackingPlayerId, object: attack },
        });
        events.push({
          ...eventBase,
          name: "continuous-effect-generated",
          data: {
            effectId,
            controllerId: link.attackingPlayerId,
            source: attack,
            origin: { kind: "layer" },
            effectPath: ["fragment", object.ref.instanceId],
            simultaneousGroupId: null,
            atoms: compiled.atoms,
            duration: "this-chain-link",
            expiresAt: {
              kind: "combat-chain",
              combatNumber: current.combat?.chainLinkNumber ?? 0,
            },
            initialSubjects: [attackBinding.attack],
            futureApplicability: null,
          },
        });
      }
      events.push({
        name: "defense-declaration-complete",
        processId,
        cause: { kind: "player-command", actorId, command: "defend" },
        controllerId: actorId,
        source: attack,
        affected: [attack],
        bindings: { attack: attackBinding },
        data: { attack, defendingPlayerId: actorId },
      });
      // CR 8.3.31 protect: when the attack targets a non-hero entity (ally,
      // spectra, or permanent), the defend command handler guarantees every
      // declared defender carries the protect keyword. Emit a protect event so
      // triggered abilities like Reya the Unyielding's "Whenever you protect
      // another hero" can subscribe.
      if (!isHeroAttackTarget(current, link.attackTargetRef)) {
        events.push({
          name: "protect",
          processId,
          cause: { kind: "player-command", actorId, command: "defend" },
          controllerId: actorId,
          source: null,
          affected: [],
          bindings: {},
          data: {
            playerId: actorId,
            protectedPlayerId:
              link.attackTargetRef?.kind === "object"
                ? link.attackTargetRef.controllerIdAtDeclaration
                : actorId,
          },
        });
      }
      return events;
    },
    options,
  );
  return result.batch
    ? { accepted: true, state: result.state }
    : failure(current, "The defender declaration produced no rules change.", "defense_no_op");
}

function failure(state: FabMatchState, error: string, errorCode: string): FabDefenseResult {
  return { accepted: false, state, error, errorCode };
}
