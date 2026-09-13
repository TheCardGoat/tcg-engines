import { FAB_ZONE_KINDS, type FabMatchState } from "../../state.ts";
import type { FabEquipmentSlot } from "../../pregame.ts";
import { appendFabEventGroup } from "../../kernel/event-journal.ts";
import type { FabObjectSnapshot, FabProcessId } from "../../rules/events.ts";
import type { FabCombatCloseProcedure, FabRulesProcess } from "../../rules/process.ts";
import { executeFabEventJournalTransaction } from "../../kernel/transaction/index.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import {
  nextFabDestinationRef,
  snapshotObject,
  snapshotAttackSource,
} from "../../rules/snapshots.ts";
import { mutateInPlace } from "../../copy-on-write.ts";
import { startFabRulesProcess } from "../../kernel/process-state.ts";
import {
  fabActiveAttackIdentity,
  fabCombatDidHit,
  fabPrimaryDefenders,
} from "../../game/combat.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import { exactAttackBinding } from "../../rules/exact-attack.ts";

export type FabCombatCloseResult =
  | { readonly accepted: true; readonly state: FabMatchState }
  | {
      readonly accepted: false;
      readonly state: FabMatchState;
      readonly error: string;
      readonly errorCode: string;
    };

/** Resolves and closes one basic chain link through event boundaries. */
export function closeFabCombatChain(
  current: FabMatchState,
  actorId: string,
  options: FabEventTransactionOptions,
): FabCombatCloseResult {
  const combat = current.combat;
  const link = combat?.activeLink;
  if (!combat || !link || combat.step !== "resolution") {
    return failure(current, "The combat chain cannot close now.", "not_combat_resolution");
  }
  const state = mutateInPlace(current, (draft) => {
    draft.stateID += 1;
    draft.counters.process += 1;
  });
  const processId: FabProcessId = `process-${state.counters.process}`;
  const attackZone =
    FAB_ZONE_KINDS.find((zone) =>
      state.containers.zonesByPlayerId[link.attackingPlayerId]![zone].includes(
        link.activeAttack.sourceObjectId,
      ),
    ) ?? "combatChain";
  const attack = snapshotAttackSource(state, link.activeAttack, link.attackingPlayerId, attackZone);
  const attackBinding = exactAttackBinding(link.activeAttack, attack);
  const procedure: FabCombatCloseProcedure = {
    kind: "combat-close",
    actorId,
    attack,
    stage: "resolve-link",
    eventGroups: [],
  };
  const rulesProcess = startFabRulesProcess(state, process(processId, procedure));
  appendFabEventGroup(rulesProcess, [
    {
      name: "chain-link-resolve",
      processId,
      cause: { kind: "rule", rule: "chain-link-resolves", controllerId: link.attackingPlayerId },
      controllerId: link.attackingPlayerId,
      source: attack,
      affected: [attack],
      bindings: { attack: attackBinding },
      data: {
        attack,
        attackingPlayerId: link.attackingPlayerId,
        defendingPlayerId: link.defendingPlayerId,
        didHit: fabCombatDidHit(link),
      },
    },
  ]);
  const objects = state.playerIds.flatMap((playerId) =>
    state.containers.zonesByPlayerId[playerId]!.combatChain.map((instanceId) =>
      snapshotObject(state, instanceId, playerId, "combatChain"),
    ),
  );
  const closingDefenders = fabPrimaryDefenders(link).flatMap((instanceId) => {
    const object = objects.find((candidate) => candidate.instanceId === instanceId);
    return object ? [object] : [];
  });
  const closingAttackPower = buildFabRulesView(state).combat()?.attackPower;
  // Fire combat-chain-close BEFORE clearing the chain so triggered-static
  // abilities on combat-chain cards (e.g. Swing Big "when the combat chain
  // closes, if this didn't hit") can match while the source is still on
  // the chain.  The move-zone and counter events are computed up-front
  // (they reference link data captured above) and appended after the close
  // event so the chain clears after triggers collect.
  appendFabEventGroup(rulesProcess, [
    {
      name: "combat-chain-close",
      processId,
      cause: { kind: "rule", rule: "combat-chain-closes", controllerId: link.attackingPlayerId },
      controllerId: link.attackingPlayerId,
      source: attack,
      affected: objects,
      bindings: {
        attack: attackBinding,
        "closing-defenders": closingDefenders,
        ...(closingAttackPower === undefined ? {} : { "closing-attack-power": closingAttackPower }),
        "closing-active-attack-id": fabActiveAttackIdentity(link.activeAttack) ?? "",
      },
      data: { turnPlayerId: state.activePlayerId, attackCount: combat.chainLinkNumber ?? 1 },
    },
  ]);
  if (objects.length > 0) {
    let resetOffset = 0;
    appendFabEventGroup(
      rulesProcess,
      objects.map((object) => {
        const origin = link.defendingOrigins[object.instanceId];
        const destroyed = isDestroyedOnClose(object, attack, origin?.kind === "equipment");
        const destination =
          origin?.kind === "equipment" && !destroyed
            ? equipmentDestination(origin.zone)
            : isReturningPermanent(object)
              ? { to: "permanent" as const }
              : { to: "graveyard" as const };
        // Blade Break / temper / mirage: emit a real `destroy` event so
        // "when this is destroyed" triggers fire (New Horizon, etc.).
        // Non-destroyed equipment still returns via move-zone.
        if (destroyed) {
          return {
            name: "destroy" as const,
            processId,
            cause: {
              kind: "rule" as const,
              rule: "combat-chain-clears",
              controllerId: object.controllerId,
            },
            controllerId: object.controllerId,
            source: attack,
            affected: [object],
            bindings: { attack: attackBinding },
            data: {
              object,
              destinationRef: nextFabDestinationRef(state, object, resetOffset++),
              from: "combat-chain" as const,
              to: "graveyard" as const,
              reason: "destroy" as const,
            },
          };
        }
        return {
          name: "move-zone" as const,
          processId,
          cause: {
            kind: "rule" as const,
            rule: "combat-chain-clears",
            controllerId: object.controllerId,
          },
          controllerId: object.controllerId,
          source: attack,
          affected: [object],
          bindings: { attack: attackBinding },
          data: {
            object,
            destinationRef:
              destination.to === "graveyard"
                ? nextFabDestinationRef(state, object, resetOffset++)
                : null,
            from: "combat-chain" as const,
            ...destination,
            reason: destination.to === "graveyard" ? ("resolve" as const) : ("move" as const),
          },
        };
      }),
    );
  }
  const counterEvents = objects.flatMap((object) => {
    const origin = link.defendingOrigins[object.instanceId];
    if (origin?.kind !== "equipment" || isDestroyedOnClose(object, attack, true)) return [];
    const keywords = object.current.keywords.map((keyword) => keyword.name);
    const defense = object.current.numeric.defense ?? 0;
    const counts: { readonly property: "defense"; readonly value: -1; readonly count: number }[] =
      [];
    // CR 8.3.2 battleworn: defending equipment takes one −1 defense counter.
    if (keywords.includes("battleworn")) counts.push({ property: "defense", value: -1, count: 1 });
    // CR 8.3.34 guardwell: −1 defense counters equal to its defense value.
    if (keywords.includes("guardwell") && defense > 0)
      counts.push({ property: "defense", value: -1, count: defense });
    // CR 8.3.10 temper: one −1 defense counter (destroy path handled above).
    if (keywords.includes("temper")) counts.push({ property: "defense", value: -1, count: 1 });
    return counts.map((counter) => ({
      name: "numeric-counter-added" as const,
      processId,
      cause: {
        kind: "rule" as const,
        rule: "combat-chain-closes",
        controllerId: object.controllerId,
      },
      controllerId: object.controllerId,
      source: object,
      affected: [object],
      bindings: { attack: attackBinding },
      data: { object, ...counter },
    }));
  });
  if (counterEvents.length > 0) {
    appendFabEventGroup(rulesProcess, counterEvents);
  }
  const committed = executeFabEventJournalTransaction(state, procedure.eventGroups, options);
  if (
    !committed.committed &&
    ("suspendedForReplacementOrder" in committed || "suspendedForContinuousOrder" in committed)
  ) {
    return { accepted: true, state: committed.state };
  }
  return committed.committed
    ? { accepted: true, state: committed.state }
    : failure(current, "The combat-close journal failed atomically.", "combat_close_failed");
}

/**
 * CR 8.3.3 blade-break destroys defending equipment when the chain closes;
 * CR 8.3.10 temper destroys it once the −1 counter would reduce defense to 0;
 * CR 8.3.25 mirage destroys it after defending a non-Illusionist 6+ power attack.
 */
/** CR 7.7.5: permanents remaining on the chain return to the permanent zone. */
function isReturningPermanent(object: FabObjectSnapshot): boolean {
  const types = object.current.typeBox.types;
  const subtypes = object.current.typeBox.subtypes;
  return (
    subtypes.includes("Ally") ||
    subtypes.includes("Aura") ||
    subtypes.includes("Item") ||
    subtypes.includes("Landmark") ||
    subtypes.includes("Ash") ||
    subtypes.includes("Figment") ||
    subtypes.includes("Affliction") ||
    subtypes.includes("Invocation") ||
    subtypes.includes("Construct") ||
    (types.includes("Token") && object.current.numeric.life !== undefined)
  );
}

function isDestroyedOnClose(
  object: FabObjectSnapshot,
  attack: FabObjectSnapshot,
  fromEquipment: boolean,
): boolean {
  const keywords = object.current.keywords.map((keyword) => keyword.name);
  if (fromEquipment && keywords.includes("blade-break")) return true;
  if (fromEquipment && keywords.includes("temper") && (object.current.numeric.defense ?? 0) <= 1) {
    return true;
  }
  // CR 8.3.25 Mirage is not equipment-only — hand-played DRs (Flicker Trick)
  // destroy on close the same way as Mirage equipment.
  const attackIdentity = [...attack.current.typeBox.types, ...attack.current.typeBox.supertypes];
  return (
    keywords.includes("mirage") &&
    (attack.current.numeric.power ?? 0) >= 6 &&
    !attackIdentity.includes("Illusionist")
  );
}

function equipmentDestination(
  zone: FabEquipmentSlot,
):
  | { readonly to: "equipment-head" | "equipment-chest" | "equipment-arms" | "equipment-legs" }
  | { readonly to: "weapon"; readonly equipmentSlot: "weapon1" | "weapon2" } {
  switch (zone) {
    case "head":
      return { to: "equipment-head" };
    case "chest":
      return { to: "equipment-chest" };
    case "arms":
      return { to: "equipment-arms" };
    case "legs":
      return { to: "equipment-legs" };
    case "weapon1":
      return { to: "weapon", equipmentSlot: "weapon1" };
    case "weapon2":
      return { to: "weapon", equipmentSlot: "weapon2" };
  }
}

function process(processId: FabProcessId, procedure: FabCombatCloseProcedure): FabRulesProcess {
  return {
    processId,
    stage: "procedure",
    pendingEvents: [],
    futureSubjectEvents: [],
    replacementCandidates: [],
    replacementChoiceResolved: false,
    replacementChoicePlayerIds: [],
    selectedOptionalReplacementIds: [],
    orderedReplacementIds: [],
    appliedReplacementIds: [],
    cancelledContinuousApplicationKeys: [],
    pendingTriggers: [],
    orderedTriggerIds: [],
    triggerPlayerOrder: [],
    orderedTriggerControllers: [],
    stateTriggersOnStack: [],
    resolvingLayerId: null,
    effectChoices: {},
    effectPartitions: {},
    effectOptions: {},
    effectTargets: {},
    iterationCount: 0,
    journalReplacementOrders: {},
    journalReplacementChoices: {},
    journalReplacementChoicePlayerIds: {},
    resolutionEventGroups: [],
    procedure,
  };
}

function failure(state: FabMatchState, error: string, errorCode: string): FabCombatCloseResult {
  return { accepted: false, state, error, errorCode };
}
