import type { FabCardFilter, FabEffect, FleshAndBloodAbility } from "@tcg/flesh-and-blood-types";
import type { FabMatchState, FabZoneKind } from "../state.ts";
import { getFabRuntimeDerived } from "../runtime-derived.ts";
import type {
  CommittedEvent,
  FabEventBindings,
  FabObjectSnapshot,
  ProposedEvent,
} from "./events.ts";
import { snapshotObject } from "./snapshots.ts";
import { findObjectZone, matchesFabSnapshotFilter } from "./state-rules-view.ts";

type FabContractTask = Extract<FabEffect, { type: "contract-task" }>;

function normalizeName(value: string | null | undefined): string {
  return (value ?? "").toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
}

function isContractTask(effect: FabEffect | undefined): effect is FabContractTask {
  return effect?.type === "contract-task";
}

function contractTaskFromAbility(ability: FleshAndBloodAbility): FabContractTask | null {
  if (ability.kind === "resolution" && isContractTask(ability.effect)) return ability.effect;
  if (
    ability.kind === "static" &&
    ability.staticKind !== "triggered" &&
    isContractTask(ability.effect)
  ) {
    return ability.effect;
  }
  return null;
}

function contractTaskOnSnapshot(snapshot: FabObjectSnapshot, task: string): FabContractTask | null {
  const abilities = [...snapshot.base.abilities, ...snapshot.current.abilities];
  for (const ability of abilities) {
    const effect = contractTaskFromAbility(ability);
    if (effect && effect.task === task) return effect;
  }
  return null;
}

function filterWithoutMarked(filter: FabCardFilter): FabCardFilter {
  if (filter.hasStatus !== "marked") return filter;
  const { hasStatus: _marked, ...rest } = filter;
  return rest;
}

function heroSnapshot(state: FabMatchState, playerId: string): FabObjectSnapshot | null {
  const heroId = state.players[playerId]?.heroCardId;
  if (!heroId) return null;
  const location = findObjectZone(state, heroId);
  return snapshotObject(
    state,
    heroId,
    location?.playerId ?? playerId,
    location?.zone ?? "heroZone",
  );
}

function hitTargetSnapshot(
  state: FabMatchState,
  event: CommittedEvent<"hit">,
): FabObjectSnapshot | null {
  const target = event.data.target;
  if ("kind" in target && target.kind === "hero") {
    return heroSnapshot(state, target.playerId);
  }
  return "current" in target ? target : null;
}

function opponentOwned(snapshot: FabObjectSnapshot, controllerId: string): boolean {
  return snapshot.ownerId !== controllerId;
}

/** CR 8.5.21 name-card stamps `named-card:<name>` on the contracted hero. */
function namedCardBindings(state: FabMatchState, controllerId: string): FabEventBindings {
  const heroId = state.players[controllerId]?.heroCardId;
  const hero = heroId ? state.objects[heroId] : undefined;
  const marker = hero?.markers.find(
    (entry) => entry.kind === "status" && entry.value.startsWith("named-card:"),
  );
  if (!marker || marker.kind !== "status") return {};
  const named = marker.value.slice("named-card:".length);
  if (!named) return {};
  return { "named-card": named, namedCard: named };
}

function contractFilterBindings(
  state: FabMatchState,
  event: CommittedEvent,
  controllerId: string,
): FabEventBindings {
  return { ...namedCardBindings(state, controllerId), ...event.bindings };
}

function banishCompletesTask(
  state: FabMatchState,
  event: CommittedEvent,
  controllerId: string,
  filter: FabCardFilter,
): boolean {
  if (event.name !== "banish") return false;
  if ((event.actorId ?? event.controllerId) !== controllerId) return false;
  const object = event.data.object;
  if (!opponentOwned(object, controllerId)) return false;
  return matchesFabSnapshotFilter(
    state,
    object,
    filter,
    contractFilterBindings(state, event, controllerId),
    controllerId,
  );
}

function hitCompletesTask(
  state: FabMatchState,
  event: CommittedEvent,
  controllerId: string,
  filter: FabCardFilter,
): boolean {
  if (event.name !== "hit") return false;
  if (
    (event.actorId ?? event.controllerId) !== controllerId &&
    event.data.actorId !== controllerId
  ) {
    return false;
  }
  if (filter.hasStatus === "marked" && event.data.targetWasMarked !== true) return false;
  const target = hitTargetSnapshot(state, event as CommittedEvent<"hit">);
  if (!target) return false;
  const names = target.current.names.length > 0 ? target.current.names : target.base.names;
  if (filter.moniker) {
    const want = normalizeName(filter.moniker);
    if (!names.some((name) => normalizeName(name).includes(want))) return false;
  }
  return matchesFabSnapshotFilter(
    state,
    target,
    filterWithoutMarked(filter),
    contractFilterBindings(state, event, controllerId),
    controllerId,
  );
}

function eventCompletesTask(
  state: FabMatchState,
  event: CommittedEvent,
  controllerId: string,
  task: FabContractTask,
): boolean {
  if (task.completeOn === "banish") {
    return banishCompletesTask(state, event, controllerId, task.filter);
  }
  return hitCompletesTask(state, event, controllerId, task.filter);
}

function contractSourceInstanceId(state: FabMatchState, controllerId: string): string | null {
  const task = state.players[controllerId]?.activeContract;
  if (!task) return null;
  const marker = `contract:${task}`;
  for (const [instanceId, object] of Object.entries(state.objects)) {
    if (object.markers.some((entry) => entry.kind === "status" && entry.value === marker)) {
      return instanceId;
    }
  }
  // Combat close resets the card-layer incarnation and drops the status
  // marker. Fall back to a card the controller owns that still prints this
  // contract task so complete-contract can observe (CR 8.5.39).
  for (const [instanceId, object] of Object.entries(state.objects)) {
    if (object.ownerId !== controllerId) continue;
    const zone = findObjectZone(state, instanceId)?.zone ?? "graveyard";
    const snapshot = snapshotObject(state, instanceId, object.ownerId, zone);
    if (contractTaskOnSnapshot(snapshot, task)) return instanceId;
  }
  return state.players[controllerId]?.heroCardId ?? null;
}

function seatedContractTask(
  state: FabMatchState,
  controllerId: string,
  task: string,
): FabContractTask | null {
  const instanceId = contractSourceInstanceId(state, controllerId);
  if (!instanceId) return null;
  const location = getFabRuntimeDerived(state).objectLocations.get(instanceId);
  const zone: FabZoneKind = location?.zone ?? "graveyard";
  const playerId = location?.playerId ?? controllerId;
  const source = snapshotObject(state, instanceId, playerId, zone);
  return contractTaskOnSnapshot(source, task);
}

/** CR 8.5.39: a seated contract is completed when its task becomes true. */
export function contractCompletedByEvents(
  state: FabMatchState,
  events: readonly CommittedEvent[],
  controllerId: string,
  task: string,
): boolean {
  const seated = seatedContractTask(state, controllerId, task);
  if (!seated) return false;
  return events.some((event) => eventCompletesTask(state, event, controllerId, seated));
}

export function proposeCompleteContractEvent(
  state: FabMatchState,
  processId: ProposedEvent["processId"],
  controllerId: string,
): ProposedEvent | null {
  const instanceId = contractSourceInstanceId(state, controllerId);
  if (!instanceId) return null;
  const location = getFabRuntimeDerived(state).objectLocations.get(instanceId);
  const zone: FabZoneKind = location?.zone ?? "graveyard";
  const playerId = location?.playerId ?? controllerId;
  const source = snapshotObject(state, instanceId, playerId, zone);
  return {
    name: "complete-contract",
    processId,
    cause: { kind: "rule", rule: "contract-progress", controllerId },
    controllerId,
    source,
    affected: [source],
    bindings: { contract: source },
    data: { actorId: controllerId, object: source },
  };
}
