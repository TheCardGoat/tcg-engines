import { openFabPriorityForCurrentContext } from "../priority.ts";
import { fabObjectInstanceId, fabPlayerId } from "../game/identity.ts";
import {
  FAB_ZONE_KINDS,
  type FabChainLink,
  type FabMatchState,
  type FabZoneKind,
} from "../state.ts";
import {
  inspectFabTestObject,
  registerFabTestObject,
  setFabFixtureObjectSetup,
  type FabFixtureObjectSetup,
} from "./test-fixtures.ts";

/** Arrange-only fixture mutation. Tests should prefer these before the first command. */
export function seatCreateObject(
  state: FabMatchState,
  input: {
    readonly instanceId: string;
    readonly canonicalId: string;
    readonly ownerId: string;
    readonly zone: FabZoneKind;
  },
): void {
  const owner = state.players[input.ownerId];
  if (!owner) throw new Error(`Unknown FAB fixture owner ${input.ownerId}.`);
  registerFabTestObject(state, input.instanceId, input.canonicalId, input.ownerId);
  if (!state.containers.zonesByPlayerId[input.ownerId]![input.zone].includes(input.instanceId))
    state.containers.zonesByPlayerId[input.ownerId]![input.zone].push(input.instanceId);
}

export function seatMoveObject(
  state: FabMatchState,
  instanceId: string,
  ownerId: string,
  to: FabZoneKind,
): void {
  if (!state.players[ownerId] || !state.objects[instanceId])
    throw new Error(`Unknown FAB fixture object ${instanceId}.`);
  for (const zone of FAB_ZONE_KINDS)
    state.containers.zonesByPlayerId[ownerId]![zone] = state.containers.zonesByPlayerId[ownerId]![
      zone
    ].filter((id) => id !== instanceId);
  state.containers.zonesByPlayerId[ownerId]![to].push(instanceId);
}

/**
 * Arrange-only material seating: place a registered object directly under a
 * host (Ash materials sit beneath their dragon from construction; Evo
 * transforms carry their Base). Test plumbing only — production hosting goes
 * through move-zone/transform events.
 */
export function seatHostUnder(
  state: FabMatchState,
  input: { readonly instanceId: string; readonly hostInstanceId: string },
): void {
  const instanceId = fabObjectInstanceId(input.instanceId);
  const hostInstanceId = fabObjectInstanceId(input.hostInstanceId);
  if (!state.objects[instanceId]) throw new Error(`Unknown FAB fixture object ${instanceId}.`);
  if (!state.objects[hostInstanceId]) {
    throw new Error(`Unknown FAB fixture host ${hostInstanceId}.`);
  }
  for (const playerId of state.playerIds) {
    const zones = state.containers.zonesByPlayerId[playerId];
    if (!zones) continue;
    for (const zone of FAB_ZONE_KINDS) {
      const list = zones[zone];
      if (list) zones[zone] = list.filter((id) => id !== instanceId);
    }
  }
  const children = state.containers.subcardsByHostId[hostInstanceId] ?? [];
  if (!children.includes(instanceId)) {
    state.containers.subcardsByHostId[hostInstanceId] = [...children, instanceId];
  }
}

export function seatPrepareObject(
  state: FabMatchState,
  instanceId: string,
  setup: FabFixtureObjectSetup,
): void {
  setFabFixtureObjectSetup(state, instanceId, setup);
}

export function seatInspectObject(state: FabMatchState, instanceId: string): FabFixtureObjectSetup {
  return inspectFabTestObject(state, instanceId);
}

export function seatEstablishCombat(
  state: FabMatchState,
  input: {
    readonly attackInstanceId: string;
    readonly attackingPlayerId: string;
    readonly defendingPlayerId: string;
    readonly step?: "attack" | "defend" | "reaction" | "damage" | "resolution" | "close";
  },
): void {
  const heroObjectId = state.containers.zonesByPlayerId[input.defendingPlayerId]?.heroZone[0];
  if (!heroObjectId) {
    throw new Error(
      `Cannot establish combat without a physical hero for ${input.defendingPlayerId}.`,
    );
  }
  const attackTargetRef = {
    kind: "hero" as const,
    playerId: fabPlayerId(input.defendingPlayerId),
  };
  const activeLink: FabChainLink = {
    activeAttack: {
      kind: "card",
      sourceObjectId: fabObjectInstanceId(input.attackInstanceId),
    },
    attackingPlayerId: fabPlayerId(input.attackingPlayerId),
    defendingPlayerId: fabPlayerId(input.defendingPlayerId),
    attackTargetRef,
    defendingInstanceIdsByTarget: { [attackTargetRef.playerId]: [] },
    defendingOrigins: {},
    damage: {
      status: "pending",
      outcomes: [{ target: attackTargetRef, damageDealtByActiveAttack: 0 }],
    },
    reactionInstanceIds: [],
    attackReactionPlayedOrActivated: false,
    attackingPlayerPlayedOrActivatedInReaction: false,
    wagers: [],
  };
  state.combat = {
    open: true,
    step: input.step ?? "attack",
    activeLink,
    defenseDeclarationPending: false,
    chainLinkNumber: 1,
    closedLinks: [],
  };
}

export function seatSetPriority(state: FabMatchState, playerId: string): void {
  if (!state.players[playerId]) throw new Error(`Unknown FAB priority player ${playerId}.`);
  openFabPriorityForCurrentContext(state, playerId);
}
