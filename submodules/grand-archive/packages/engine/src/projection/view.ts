import { projectGrandArchiveCombatView, type GrandArchiveCombatView } from "./combat.ts";
import type {
  GrandArchiveActivationState,
  GrandArchiveObjectState,
  GrandArchiveZone,
} from "@tcg/grand-archive-types";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../game/identity.ts";
import { grandArchiveObjectFace } from "../game/card-runtime.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState, GrandArchiveStackItem } from "../game/model.ts";
import { grandArchivePlayerHasState } from "../rules/state/player-continuous.ts";
import { grandArchiveObjectEffectiveStates } from "../game/object-state.ts";
import { collectGrandArchiveActionRules } from "../rules/state/rule-modifications.ts";
import { grandArchivePlayerZoneObjectIds } from "../game/zone-ownership.ts";
import { GRAND_ARCHIVE_PRIVATE_ZONES, GRAND_ARCHIVE_ZONES } from "../game/zones.ts";
import { grandArchiveViewerRetainsBanishedIdentity } from "../game/visibility.ts";

export interface GrandArchiveViewerObject {
  readonly id: GrandArchiveObjectId;
  /** Changes whenever this stable object id becomes a new rules object. */
  readonly incarnation: number;
  readonly definitionId: string;
  readonly activeDefinitionId?: string;
  /** Bottom-to-top position among viewer-visible physical cards, including the base card. */
  readonly lineagePosition?: number;
  readonly isToken: boolean;
  readonly ownerId: GrandArchivePlayerId;
  readonly controllerId: GrandArchivePlayerId;
  readonly zone: GrandArchiveZone;
  readonly hostId?: GrandArchiveObjectId;
  readonly banishedBySourceId?: GrandArchiveObjectId;
  readonly face: "default" | "transformed";
  readonly facing: "face-up" | "face-down";
  readonly name: string;
  readonly states: readonly GrandArchiveObjectState[];
  readonly activationStates: readonly GrandArchiveActivationState[];
  readonly activationVariables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  readonly cascadeCounts: Readonly<Record<string, number>>;
  readonly counters: Readonly<Record<string, number>>;
  readonly damage: number;
}

export type GrandArchiveViewerZone =
  | {
      readonly visibility: "visible";
      readonly objects: readonly GrandArchiveViewerObject[];
      /** Private face-down cards omitted from an otherwise public zone. */
      readonly hiddenCount: number;
    }
  | {
      readonly visibility: "hidden";
      readonly count: number;
      /** Face-up cards remain public even while contained in a private zone. */
      readonly revealedObjects: readonly GrandArchiveViewerObject[];
    };

export interface GrandArchiveViewerPlayer {
  readonly id: GrandArchivePlayerId;
  readonly name: string;
  readonly turnOrder: number;
  readonly lost: boolean;
  readonly conceded: boolean;
  readonly mastery?: GrandArchiveMatchState["players"][GrandArchivePlayerId]["mastery"];
  readonly zones: Readonly<Record<GrandArchiveZone, GrandArchiveViewerZone>>;
}

export type GrandArchiveViewerStackItem = GrandArchiveStackItem extends infer Item
  ? Item extends GrandArchiveStackItem
    ? Omit<Item, "bindings" | "activationPayment"> & {
        readonly presentation?: {
          readonly name: string;
          readonly definitionId?: string;
          readonly printedText?: string;
        };
      }
    : never
  : never;

export interface GrandArchiveViewerState {
  readonly schemaVersion: 1;
  readonly stateVersion: number;
  readonly mode: GrandArchiveMatchState["mode"];
  readonly status: GrandArchiveMatchState["status"];
  readonly winnerIds: readonly GrandArchivePlayerId[];
  readonly gameStates: GrandArchiveMatchState["gameStates"];
  readonly selfId: GrandArchivePlayerId;
  /** Player currently performing ordered pre-game actions, when that stage is active. */
  readonly pregamePlayerId: GrandArchivePlayerId | null;
  readonly turn: GrandArchiveMatchState["turn"];
  readonly opportunityHolderId: GrandArchivePlayerId | null;
  readonly decision: GrandArchiveViewerDecision | null;
  readonly combat: GrandArchiveMatchState["combat"];
  readonly combatView: GrandArchiveCombatView | null;
  readonly stack: readonly GrandArchiveViewerStackItem[];
  readonly players: readonly GrandArchiveViewerPlayer[];
}

type GrandArchiveReplacementDecision = Extract<
  NonNullable<GrandArchiveMatchState["decision"]>,
  { readonly kind: "choose-replacement" }
>;

type GrandArchiveDelegatedDefenderDecision = Extract<
  NonNullable<GrandArchiveMatchState["decision"]>,
  { readonly kind: "choose-delegated-defender" }
>;

export type GrandArchiveViewerDecision =
  | Exclude<
      NonNullable<GrandArchiveMatchState["decision"]>,
      GrandArchiveReplacementDecision | GrandArchiveDelegatedDefenderDecision
    >
  | Omit<GrandArchiveReplacementDecision, "continuation">
  | Omit<
      GrandArchiveDelegatedDefenderDecision,
      | "reservePayment"
      | "costSelections"
      | "costPaymentOrders"
      | "costOptionIndex"
      | "payOptionalCost"
    >;

function projectDecision(
  decision: NonNullable<GrandArchiveMatchState["decision"]>,
): GrandArchiveViewerDecision {
  if (decision.kind !== "choose-replacement" && decision.kind !== "choose-delegated-defender") {
    return decision;
  }
  if (decision.kind === "choose-delegated-defender") {
    const {
      reservePayment: _reservePayment,
      costSelections: _costSelections,
      costPaymentOrders: _costPaymentOrders,
      costOptionIndex: _costOptionIndex,
      payOptionalCost: _payOptionalCost,
      ...visible
    } = decision;
    return visible;
  }
  const { continuation: _privateContinuation, ...visible } = decision;
  return visible;
}

function projectStackItem(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  viewerId: GrandArchivePlayerId,
  item: GrandArchiveStackItem,
): GrandArchiveViewerStackItem {
  const redact = <Item extends GrandArchiveStackItem>(
    current: Item,
  ): Omit<Item, "bindings" | "activationPayment"> => {
    const {
      bindings: _internalBindings,
      activationPayment: _privateActivationPayment,
      ...visible
    } = current;
    return visible;
  };
  const publicSource = (objectId: GrandArchiveObjectId | undefined) => {
    if (!objectId) return undefined;
    const object = state.objects[objectId];
    if (!object) return undefined;
    if (!viewerMayLookAtFaceDownObject(program, state, viewerId, objectId)) return undefined;
    const face = grandArchiveObjectFace(program, object);
    return {
      name: face.name,
      definitionId: object.activeDefinitionId ?? object.definitionId,
      printedText: face.rulesText,
    };
  };
  const projected = (() => {
    switch (item.kind) {
      case "card-activation":
        return redact(item);
      case "materialization":
        return redact(item);
      case "bestowment":
        return redact(item);
      case "activated-ability":
        return redact(item);
      case "triggered-ability":
        return redact(item);
      case "replacement-follow-up":
        return redact(item);
    }
  })();
  const abilitySource = item.sourceId ? state.objects[item.sourceId] : undefined;
  const presentation =
    item.kind === "card-activation" || item.kind === "materialization" || item.kind === "bestowment"
      ? publicSource(item.cardId)
      : item.sourceId && abilitySource && !isPrivateZone(abilitySource.zone)
        ? publicSource(item.sourceId)
        : undefined;
  const printedText = "ability" in item ? item.ability?.text : undefined;
  return presentation || printedText
    ? {
        ...projected,
        presentation: {
          name: presentation?.name ?? item.masterySource?.name ?? item.gameSource?.name ?? "Effect",
          ...(presentation?.definitionId ? { definitionId: presentation.definitionId } : {}),
          ...(printedText || presentation?.printedText
            ? { printedText: printedText || presentation?.printedText }
            : {}),
        },
      }
    : projected;
}

function isPrivateZone(zone: GrandArchiveZone): boolean {
  return (GRAND_ARCHIVE_PRIVATE_ZONES as readonly GrandArchiveZone[]).includes(zone);
}

/** Owner-indexed zones cannot describe cross-owner lineage order or the base card.
 * Reconstruct physical placement from authoritative events, then omit concealed cards.
 * Object-Specific Zones / Inner Lineage 1; Champion / Leveling Up 1, 6–7.
 */
function visibleLineagePositions(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  viewerId: GrandArchivePlayerId,
): ReadonlyMap<GrandArchiveObjectId, number> {
  const lineages = new Map<GrandArchiveObjectId, GrandArchiveObjectId[]>();
  const detach = (id: GrandArchiveObjectId) => {
    for (const [host, cards] of lineages) {
      const index = cards.indexOf(id);
      if (index >= 0 && id !== host) {
        cards.splice(index, 1);
        return host;
      }
    }
    return undefined;
  };
  const attach = (id: GrandArchiveObjectId, host: GrandArchiveObjectId, bottom: boolean) => {
    const cards = lineages.get(host) ?? [host];
    // A normal attachment joins Inner Lineage beneath the current champion.
    cards.splice(bottom ? 0 : Math.max(0, cards.length - 1), 0, id);
    lineages.set(host, cards);
  };
  for (const event of state.eventHistory) {
    switch (event.type) {
      case "champion-leveled-up": {
        detach(event.cardId);
        const cards = lineages.get(event.championId) ?? [event.championId];
        cards.push(event.cardId);
        lineages.set(event.championId, cards);
        break;
      }
      case "champion-deleveled":
        detach(event.cardId);
        break;
      case "object-moved": {
        if (event.from === event.to && event.placement !== "top" && event.placement !== "bottom")
          break;
        const previousHost = detach(event.objectId);
        if (event.from === "field" && event.to !== "field") lineages.delete(event.objectId);
        const host = event.hostId ?? (event.from === event.to ? previousHost : undefined);
        if (event.to === "inner-lineage" && host)
          attach(event.objectId, host, event.placement === "bottom");
        break;
      }
      case "object-created":
        if (event.object.zone === "inner-lineage" && event.object.hostId)
          attach(event.object.id, event.object.hostId, event.placement === "bottom");
        break;
      case "object-ceased":
        detach(event.objectId);
        break;
      case "object-removed-from-game":
        detach(event.object.id);
        lineages.delete(event.object.id);
        break;
    }
  }
  const positions = new Map<GrandArchiveObjectId, number>();
  for (const [host, cards] of lineages) {
    if (state.objects[host]?.zone !== "field") continue;
    cards
      .filter((id) => {
        const object = state.objects[id];
        return (
          object &&
          (id === host || (object.zone === "inner-lineage" && object.hostId === host)) &&
          viewerMayLookAtFaceDownObject(program, state, viewerId, id)
        );
      })
      .forEach((id, index) => positions.set(id, index));
  }
  return positions;
}

function projectObject(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  objectId: GrandArchiveObjectId,
  lineagePositions: ReadonlyMap<GrandArchiveObjectId, number>,
): GrandArchiveViewerObject {
  const object = state.objects[objectId];
  if (!object) throw new Error(`Zone contains missing object ${objectId}`);
  const face = grandArchiveObjectFace(program, object);
  return {
    id: object.id,
    incarnation: object.incarnation,
    definitionId: object.definitionId,
    ...(lineagePositions.has(objectId) ? { lineagePosition: lineagePositions.get(objectId) } : {}),
    ...(object.activeDefinitionId ? { activeDefinitionId: object.activeDefinitionId } : {}),
    isToken: object.isToken,
    ownerId: object.ownerId,
    controllerId: object.controllerId,
    zone: object.zone,
    ...(object.hostId ? { hostId: object.hostId } : {}),
    ...(object.banishedBySourceId ? { banishedBySourceId: object.banishedBySourceId } : {}),
    face: object.face,
    facing: object.facing,
    name: face.name,
    states: [...grandArchiveObjectEffectiveStates(state, object)],
    activationStates: [...object.activationStates],
    activationVariables: object.activationVariables,
    cascadeCounts: object.cascadeCounts,
    counters: object.counters,
    damage: object.damage,
  };
}

function viewerMayLookAtFaceDownObject(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  viewerId: GrandArchivePlayerId,
  objectId: GrandArchiveObjectId,
): boolean {
  const object = state.objects[objectId];
  if (!object) return false;
  if (object.facing === "face-up") return true;
  if (state.status === "finished" && object.revealAtEndOfGame) return true;
  if (grandArchiveViewerRetainsBanishedIdentity(state, viewerId, objectId)) return true;
  if (
    object.zone !== "main-deck" &&
    object.zone !== "banishment" &&
    object.controllerId === viewerId
  ) {
    return true;
  }
  return collectGrandArchiveActionRules({
    action: "look-at",
    activationKind: "ability",
    playerId: viewerId,
    candidateId: object.id,
    fromZone: object.zone,
    evaluation: {
      program,
      state,
      controllerId: viewerId,
      sourceId: object.id,
      abilityBearerId: object.id,
      candidateId: object.id,
      bindings: {},
    },
  }).some((rule) => rule.effect.mode === "allow");
}

function projectPublicZone(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  viewerId: GrandArchivePlayerId,
  objectIds: readonly GrandArchiveObjectId[],
  lineagePositions: ReadonlyMap<GrandArchiveObjectId, number>,
): GrandArchiveViewerZone {
  const visibleObjectIds = objectIds.filter((objectId) =>
    viewerMayLookAtFaceDownObject(program, state, viewerId, objectId),
  );
  return {
    visibility: "visible",
    objects: visibleObjectIds.map((objectId) =>
      projectObject(program, state, objectId, lineagePositions),
    ),
    hiddenCount: objectIds.length - visibleObjectIds.length,
  };
}

export function projectGrandArchiveViewerState(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  viewerId: GrandArchivePlayerId,
): GrandArchiveViewerState {
  if (!state.players[viewerId]) throw new Error("Viewer is not a player in this match");
  const lineagePositions = visibleLineagePositions(program, state, viewerId);
  const players = state.turnOrder.map((playerId): GrandArchiveViewerPlayer => {
    const player = state.players[playerId];
    if (!player) throw new Error(`Turn order contains missing player ${playerId}`);
    const zones: Record<GrandArchiveZone, GrandArchiveViewerZone> = {
      "main-deck": { visibility: "hidden", count: 0, revealedObjects: [] },
      "material-deck": { visibility: "hidden", count: 0, revealedObjects: [] },
      hand: { visibility: "hidden", count: 0, revealedObjects: [] },
      memory: { visibility: "hidden", count: 0, revealedObjects: [] },
      graveyard: { visibility: "visible", objects: [], hiddenCount: 0 },
      banishment: { visibility: "visible", objects: [], hiddenCount: 0 },
      field: { visibility: "visible", objects: [], hiddenCount: 0 },
      "effects-stack": { visibility: "visible", objects: [], hiddenCount: 0 },
      intent: { visibility: "visible", objects: [], hiddenCount: 0 },
      pantheon: { visibility: "visible", objects: [], hiddenCount: 0 },
      "inner-lineage": { visibility: "visible", objects: [], hiddenCount: 0 },
      loaded: { visibility: "visible", objects: [], hiddenCount: 0 },
    };
    for (const zone of GRAND_ARCHIVE_ZONES) {
      const objectIds = grandArchivePlayerZoneObjectIds(state, playerId, zone);
      zones[zone] =
        isPrivateZone(zone) && (playerId !== viewerId || zone === "main-deck")
          ? {
              visibility: "hidden",
              count: objectIds.length,
              revealedObjects: objectIds.flatMap((objectId) => {
                const object = state.objects[objectId];
                const isContinuouslyRevealedTopCard =
                  zone === "main-deck" &&
                  objectId === objectIds[0] &&
                  grandArchivePlayerHasState(program, state, playerId, {
                    named: "top-main-deck-revealed",
                  });
                return object?.facing === "face-up" ||
                  isContinuouslyRevealedTopCard ||
                  viewerMayLookAtFaceDownObject(program, state, viewerId, objectId)
                  ? [projectObject(program, state, objectId, lineagePositions)]
                  : [];
              }),
            }
          : projectPublicZone(program, state, viewerId, objectIds, lineagePositions);
    }
    return {
      id: player.id,
      name: player.name,
      turnOrder: player.turnOrder,
      lost: player.lost,
      conceded: player.conceded,
      ...(player.mastery ? { mastery: player.mastery } : {}),
      zones,
    };
  });
  return {
    schemaVersion: 1,
    stateVersion: state.stateVersion,
    mode: state.mode,
    status: state.status,
    winnerIds: state.winnerIds,
    gameStates: state.gameStates,
    selfId: viewerId,
    pregamePlayerId:
      state.status === "pregame" && state.pregame?.stage === "player-actions"
        ? (state.turnOrder[state.pregame.currentPlayerIndex] ?? null)
        : null,
    turn: state.turn,
    opportunityHolderId: state.opportunity?.holderId ?? null,
    decision: state.decision?.playerId === viewerId ? projectDecision(state.decision) : null,
    combat: state.combat,
    combatView: projectGrandArchiveCombatView(program, state),
    stack: state.stack
      .filter((item) => item.kind !== "replacement-follow-up")
      .map((item) => projectStackItem(program, state, viewerId, item)),
    players,
  };
}
