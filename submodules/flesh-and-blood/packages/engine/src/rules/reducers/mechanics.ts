import { baseCardPower, basePropertiesOf } from "../../cards.ts";
import type { FabMatchState } from "../../state.ts";
import type { ProposedEvent } from "../events.ts";
import type { FabEventReduction } from "../../kernel/transaction-kernel.ts";
import { nextRandom } from "../../random.ts";
import { fabCanonicalCardId, fabObjectInstanceId } from "../../game/identity.ts";
import { fabPlayerId } from "../../game/identity.ts";
import { createSyntheticFabObjectSnapshot } from "../snapshots.ts";
import { fabActiveAttackIdentity } from "../../game/combat.ts";
import { proposeFreshClashEvents } from "../proposals/mechanic-effects.ts";
import { attachFabTransformSources } from "../hosted-card-transitions.ts";
import { initialFabActiveFaceForCreatedName, selectFabActiveFace } from "../../game/active-face.ts";
import { resolveTransformIntoCanonicalId } from "../transform.ts";

export type MechanicsEventName =
  | "boost"
  | "fuse"
  | "charge"
  | "intimidate"
  | "clash-win"
  | "clash-lose"
  | "clash"
  | "clash-outcome"
  | "clash-prize"
  | "reclash-request"
  | "wager"
  | "wager-loss"
  | "wager-win"
  | "crank"
  | "usurp"
  | "transcend"
  | "complete-contract"
  | "trigger"
  | "fragment"
  | "beat-chest"
  | "crowd-cheers"
  | "crowd-boos"
  | "protect"
  | "become"
  | "transform"
  | "roll";

type MechanicsEvent = Extract<ProposedEvent, { name: MechanicsEventName }>;

export function reduceMechanicsEvent(
  state: FabMatchState,
  event: MechanicsEvent,
): FabEventReduction | null {
  switch (event.name) {
    case "boost": {
      const player = state.players[event.data.actorId];
      if (!player) return null;
      player.history.turn.boosted = true;
      player.history.turn.boostsThisTurn += 1;
      player.history.turn.banishedFromBoostingThisTurn = true;
      // Boost is paid while playing an attack (often before the chain is
      // marked open). "Boosted this combat chain" still counts that play.
      player.history.combatChain.boostsThisCombatChain += 1;
      const banished = event.data.banished;
      if (banished?.current.typeBox.subtypes.includes("Evo")) {
        player.history.turn.evoBanishedFromBoostingThisTurn = true;
      }
      const object = state.objects[event.data.object.instanceId];
      if (!object || object.incarnation !== event.data.object.ref.incarnation) return null;
      state.objects[event.data.object.instanceId] = {
        ...object,
        declarationFacts: [
          ...(object.declarationFacts ?? []).filter((fact) => fact.kind !== "boost"),
          { kind: "boost" },
        ],
      };
      return { state };
    }
    case "fuse": {
      const player = state.players[event.data.actorId];
      if (!player || event.data.revealed.length === 0) return null;
      // `fused` is both a player-scoped turn-history fact (for "you fused"
      // triggers) and an object-scoped declaration fact (for "this was
      // fused" effects). Do not turn the former into a one-shot gate: every
      // successfully fused object in the turn must retain its own fact.
      player.history.turn.fused = true;
      const fusedSupertypes = [
        ...new Set([
          ...player.history.turn.fusedSupertypesThisTurn,
          ...event.data.revealed.flatMap((revealed) => revealed.current.typeBox.supertypes),
        ]),
      ];
      player.history.turn.fusedSupertypesThisTurn = fusedSupertypes;
      const object = state.objects[event.data.object.instanceId];
      if (!object || object.incarnation !== event.data.object.ref.incarnation) return null;
      const revealedSupertypes = [
        ...new Set(event.data.revealed.flatMap((revealed) => revealed.current.typeBox.supertypes)),
      ];
      state.objects[event.data.object.instanceId] = {
        ...object,
        declarationFacts: [
          ...(object.declarationFacts ?? []).filter((fact) => fact.kind !== "fusion"),
          { kind: "fusion", revealedSupertypes },
        ],
      };
      return { state };
    }
    case "charge": {
      // CR 8.5.29: charging stamps the turn flag even if soul already held cards.
      const player = state.players[event.data.actorId];
      if (!player) return null;
      player.history.turn.charged = true;
      const object = state.objects[event.data.object.instanceId];
      if (object && object.incarnation === event.data.object.ref.incarnation) {
        state.objects[event.data.object.instanceId] = {
          ...object,
          declarationFacts: [
            ...(object.declarationFacts ?? []).filter((fact) => fact.kind !== "charge"),
            {
              kind: "charge",
              color: event.data.charged.current.color,
              chargedCard: {
                instanceId: fabObjectInstanceId(event.data.charged.ref.instanceId),
                incarnation: event.data.charged.ref.incarnation,
              },
            },
          ],
        };
      }
      return { state };
    }
    case "intimidate": {
      const player = state.players[event.data.actorId];
      if (!player || !state.players[event.data.playerId]) return null;
      player.history.turn.intimidatesThisTurn += 1;
      return { state };
    }
    case "clash-win": {
      // Force-set winner (win-clash replacement leaf overrides deck tops).
      state.lastClashWinnerId = event.data.playerId;
      const winner = state.players[event.data.playerId];
      if (winner) winner.history.turn.clashesWonThisTurn += 1;
      return { state };
    }
    case "clash-lose":
      // Observation-only: committed so clash-lose listeners can fire.
      return { state };
    case "clash-outcome": {
      const { firstPlayerId, secondPlayerId, winnerId } = event.data;
      if (!state.players[firstPlayerId] || !state.players[secondPlayerId]) return null;
      state.lastClashWinnerId = winnerId;
      if (!winnerId) return { state };
      const loserId = winnerId === firstPlayerId ? secondPlayerId : firstPlayerId;
      // CR 8.5.45a: the winner won by revealing that card. Stamp only that
      // reveal on clash-win (and the loser's reveal on clash-lose) so
      // "when you win a clash revealing this" LKI sources are the winner's
      // card, not both deck-tops copied from clash-outcome.
      const winnerCard = clashRevealedCardForPlayer(event, winnerId);
      const loserCard = clashRevealedCardForPlayer(event, loserId);
      return {
        state,
        followUpEvents: [
          {
            ...event,
            name: "clash-win",
            actorId: winnerId,
            controllerId: winnerId,
            affected: winnerCard ? [winnerCard] : [],
            bindings: {
              ...event.bindings,
              ...(winnerCard ? { revealed: winnerCard } : {}),
            },
            data: { playerId: winnerId, opponentId: loserId },
          },
          {
            ...event,
            name: "clash-lose",
            actorId: loserId,
            controllerId: loserId,
            affected: loserCard ? [loserCard] : [],
            bindings: {
              ...event.bindings,
              ...(loserCard ? { revealed: loserCard } : {}),
            },
            data: { playerId: loserId, opponentId: winnerId },
          },
        ],
      };
    }
    case "clash-prize": {
      const branch = event.data.branches.find(
        (candidate) => candidate.winnerId === state.lastClashWinnerId,
      );
      return { state, ...(branch ? { followUpEvents: branch.events } : {}) };
    }
    case "reclash-request": {
      if (!state.players[event.data.firstPlayerId] || !state.players[event.data.secondPlayerId])
        return null;
      const followUpEvents = proposeFreshClashEvents(
        state,
        { ...event, bindings: { ...event.bindings, "reclash-final": true } },
        event.data.clashId,
        event.data.firstPlayerId,
        event.data.secondPlayerId,
      );
      const prize = event.data.deferredEffect;
      const outcome = followUpEvents.find(
        (
          candidate,
        ): candidate is Extract<(typeof followUpEvents)[number], { name: "clash-outcome" }> =>
          candidate.name === "clash-outcome",
      );
      if (prize && outcome) {
        followUpEvents.push({
          ...outcome,
          name: "clash-prize",
          data: {
            clashId: event.data.clashId,
            branches: [],
            deferredEffect: prize,
          },
        });
      }
      return {
        state,
        followUpEvents,
      };
    }
    case "wager": {
      const player = state.players[event.data.actorId];
      if (!player) return null;
      // Idempotent chain stamp — multi-stake sequences (Might + Vigor) each
      // produce a wager observation; the second must not fail-closed.
      player.history.combatChain.wagered = true;
      const link = state.combat?.activeLink;
      if (
        link &&
        (fabActiveAttackIdentity(link.activeAttack) === event.data.object.instanceId ||
          link.activeAttack.sourceObjectId === event.data.object.instanceId)
      ) {
        link.wagers = [
          ...link.wagers,
          {
            wagerId: event.data.wagerId,
            controllerId: player.playerId,
            attackingPlayerId: fabPlayerId(event.data.attackingPlayerId),
            defendingPlayerId: fabPlayerId(event.data.defendingPlayerId),
            prize: event.data.prize,
          },
        ];
      }
      // Stamp object-level observation for leaf contracts / filters.
      const instanceId = event.data.object.instanceId;
      const object = state.objects[instanceId];
      if (object) {
        state.objects[instanceId] = {
          ...object,
          markers: [
            ...object.markers.filter((marker) => marker.kind !== "wagered"),
            { kind: "wagered" },
          ],
        };
      }
      return { state };
    }
    case "wager-loss": {
      const winnerId = fabPlayerId(event.data.winnerId);
      const loserId = fabPlayerId(event.data.loserId);
      const followUpEvents: ProposedEvent[] = [
        {
          ...event,
          name: "wager-win",
          controllerId: winnerId,
          affected: [event.data.attack],
          bindings: {
            ...event.bindings,
            winner: winnerId,
            loser: loserId,
          },
          data: {
            actorId: winnerId,
            object: event.data.attack,
            wagerId: event.data.wagerId,
            loserId,
            prize: event.data.prize,
          },
        },
      ];
      const tokenIds =
        event.data.prize?.kind === "create-token" ? event.data.prize.canonicalIds : [];
      for (const [index, canonicalId] of tokenIds.entries()) {
        const definition = state.cardDefinitions[canonicalId];
        if (!definition) return null;
        const object = createSyntheticFabObjectSnapshot({
          ref: {
            instanceId: `${event.data.wagerId}:prize-${index}`,
            incarnation: state.counters.objectIncarnation + index + 1,
          },
          canonicalId,
          objectKind: "created-token",
          baseSource: { kind: "registered" },
          ownerId: winnerId,
          controllerId: winnerId,
          zone: "unknown",
          zoneRef: { playerId: winnerId, zone: "arena" },
          base: basePropertiesOf(definition),
        });
        followUpEvents.push({
          ...event,
          name: "create",
          cause: { kind: "rule", rule: "wager", controllerId: winnerId },
          controllerId: winnerId,
          affected: [object],
          bindings: { ...event.bindings, winner: winnerId, prize: object },
          data: { playerId: winnerId, object },
        });
      }
      return { state, followUpEvents };
    }
    case "crank": {
      const player = state.players[event.data.actorId];
      if (!player) return null;
      if (event.data.intent) {
        // Play-time intent only records pending crank; not a CR "you crank" event.
        if (player.pendingCrankInstanceIds.includes(event.data.object.instanceId)) return null;
        player.pendingCrankInstanceIds.push(event.data.object.instanceId);
        return { state };
      }
      // Resolution crank (CR 8.3.29): may fire multiple times per turn (each
      // entering item). Always commit so "the second time you crank" (Puffin)
      // and similar ordinals can observe each occurrence. The boolean flag is
      // only "have you cranked this turn" for conditions — never a one-shot gate.
      player.history.turn.cranked = true;
      return { state };
    }
    case "wager-win":
      // No state mutation, but returning { state } ensures the event is
      // committed to the batch and visible to trigger subscribers.
      return { state };
    case "usurp": {
      const player = state.players[event.data.actorId];
      if (player) player.history.turn.usurped = true;
      return { state };
    }
    case "complete-contract": {
      const player = state.players[event.data.actorId];
      if (player) {
        player.activeContract = null;
        // CR 8.4.7 / 8.5.39a: completing a contract is a per-player turn fact
        // (DYN123 Pay Day "If you've completed a contract this turn"). A
        // contract can complete any number of times per turn (8.5.39b) — the
        // stamp is idempotent so the boolean stays set for the whole turn and
        // resets with the turn ledger (emptyFabTurnHistory).
        player.history.turn.completedAContract = true;
      }
      const layerId = state.rulesProcess?.resolvingLayerId;
      if (layerId) {
        const index = state.rulesStack.findIndex((layer) => layer.layerId === layerId);
        const layer = index >= 0 ? state.rulesStack[index] : undefined;
        if (layer && layer.controllerId === event.data.actorId) {
          state.rulesStack[index] = {
            ...layer,
            bindings: { ...layer.bindings, "completed-contract-this-way": 1 },
          };
        }
      }
      return { state };
    }
    case "trigger":
      // CR 1.9.1b observation-only events — no state mutation, but must be
      // committed so triggered abilities can observe them.
      return { state };
    case "transcend": {
      const player = state.players[event.data.actorId];
      if (!player) return null;
      const object = state.objects[event.data.object.instanceId];
      if (!object || object.incarnation !== event.data.object.ref.incarnation) return null;
      const definition = state.cardDefinitions[object.canonicalId];
      if (definition?.layout.kind === "transcend") {
        state.objects[object.instanceId] = {
          ...object,
          activeFace: selectFabActiveFace(definition, definition.layout.back.faceId),
        };
        player.history.turn.transcended = true;
        return { state };
      }
      player.history.turn.transcended = true;
      return { state };
    }
    case "fragment": {
      const object = state.objects[event.data.object.instanceId];
      if (!object) return null;
      // Stamp turn fact for "an attack has fragmented this turn" gates
      // (Starfield Veil family). Actor is the attacking controller.
      const actor = state.players[event.data.actorId];
      if (actor) actor.history.turn.attackFragmented = true;
      if (
        object.markers.some((marker) => marker.kind === "status" && marker.value === "fragmented")
      )
        return { state };
      state.objects[object.instanceId] = {
        ...object,
        markers: [...object.markers, { kind: "status", value: "fragmented" }],
      };
      return { state };
    }
    case "beat-chest": {
      const player = state.players[event.data.actorId];
      if (!player || event.data.discarded.length === 0 || player.history.turn.beatenChest)
        return null;
      player.history.turn.beatenChest = true;
      return { state };
    }
    case "clash": {
      // CR 8.3.34: record the clash winner for subsequent mechanic checks.
      // The winner was determined by the effect proposal (top-deck power
      // comparison); firstPlayerId is the controller who initiated it.
      const first = state.players[event.data.firstPlayerId];
      const second = state.players[event.data.secondPlayerId];
      if (!first || !second) return null;
      // Top of deck is the last index; read printed power from the card def.
      const firstTop =
        state.containers.zonesByPlayerId[event.data.firstPlayerId]!.deck[
          state.containers.zonesByPlayerId[event.data.firstPlayerId]!.deck.length - 1
        ];
      const secondTop =
        state.containers.zonesByPlayerId[event.data.secondPlayerId]!.deck[
          state.containers.zonesByPlayerId[event.data.secondPlayerId]!.deck.length - 1
        ];
      const printedPower = (instanceId: string | undefined): number => {
        if (!instanceId) return -1;
        const canonicalId = state.objects[instanceId]?.canonicalId ?? "";
        return baseCardPower(state.cardDefinitions[canonicalId]) ?? -1;
      };
      const firstPower = printedPower(firstTop);
      const secondPower = printedPower(secondTop);
      if (firstPower > secondPower) {
        state.lastClashWinnerId = event.data.firstPlayerId;
      } else if (secondPower > firstPower) {
        state.lastClashWinnerId = event.data.secondPlayerId;
      } else {
        state.lastClashWinnerId = null;
      }
      return { state };
    }
    case "crowd-cheers": {
      const player = state.players[event.data.playerId];
      if (!player || player.history.turn.crowdCheered) return null;
      player.history.turn.crowdCheered = true;
      return { state };
    }
    case "protect":
      // CR 8.3.31: protect is a CR 1.9.1b observation-only event — no state
      // mutation, but must be committed so triggered abilities can observe it.
      return { state };
    case "crowd-boos": {
      const player = state.players[event.data.playerId];
      if (!player || player.history.turn.crowdBooed) return null;
      player.history.turn.crowdBooed = true;
      return { state };
    }
    case "become":
      // CR 1.9.1b observation-only events — no state mutation, but must be
      // committed so triggered abilities can observe them.
      return { state };
    case "transform": {
      const into = event.data.into;
      const instanceId = event.data.object.instanceId;
      const object = state.objects[instanceId];
      if (event.data.destination?.kind === "resolving-card") {
        const hostSnapshot = event.data.destination.object;
        const host = state.objects[hostSnapshot.instanceId];
        if (!host || host.incarnation !== hostSnapshot.ref.incarnation) return null;
        const definition = state.cardDefinitions[host.canonicalId];
        if (
          definition?.layout.kind !== "flip" ||
          (definition.layout.family !== "invocation" && definition.layout.family !== "construct")
        )
          return null;
        const firstSource = event.affected[0];
        if (
          !firstSource ||
          event.affected.some(
            (source) => state.objects[source.instanceId]?.incarnation !== source.ref.incarnation,
          )
        )
          return null;
        if (
          !attachFabTransformSources({
            state,
            sourceIds: [
              fabObjectInstanceId(firstSource.instanceId),
              ...event.affected.slice(1).map((source) => fabObjectInstanceId(source.instanceId)),
            ],
            destination: {
              kind: "resolving-card",
              hostId: fabObjectInstanceId(hostSnapshot.instanceId),
            },
          })
        ) {
          return null;
        }
        state.objects[hostSnapshot.instanceId] = {
          ...state.objects[hostSnapshot.instanceId]!,
          activeFace: selectFabActiveFace(definition, definition.layout.back.faceId),
        };
        return { state };
      }
      // Demi-heroes that transform from inventory (e.g. DTD164 Blasmophet)
      // replace the seated hero. The previous hero becomes a subcard of the
      // demi-hero, preserving the physical-card topology while keeping the
      // hero zone's single authoritative occupant.
      if (
        object &&
        typeof into === "string" &&
        event.data.object.zone === "inventory" &&
        state.cardDefinitions[object.canonicalId]?.base.typeBox.types.includes("Demi-Hero")
      ) {
        const ownerId = event.data.object.zoneRef.playerId ?? object.ownerId;
        const owner = state.players[ownerId];
        if (!owner) return null;
        const inventoryIndex =
          state.containers.zonesByPlayerId[ownerId]!.inventory.indexOf(instanceId);
        if (inventoryIndex < 0) return null;
        const previousHeroId = owner.heroCardId;
        if (
          previousHeroId &&
          previousHeroId !== instanceId &&
          !attachFabTransformSources({
            state,
            sourceIds: [fabObjectInstanceId(previousHeroId)],
            destination: {
              kind: "resolving-card",
              hostId: fabObjectInstanceId(instanceId),
            },
          })
        ) {
          return null;
        }
        state.containers.zonesByPlayerId[ownerId]!.inventory.splice(inventoryIndex, 1);
        state.containers.zonesByPlayerId[ownerId]!.heroZone = [instanceId];
        owner.heroCardId = instanceId;
        state.objects[instanceId] = {
          ...object,
          visibility: "public",
          activeFace: initialFabActiveFaceForCreatedName(
            state.cardDefinitions[object.canonicalId]!,
            into,
          ),
          markers: [
            ...object.markers.filter((marker) => marker.kind !== "transformed"),
            { kind: "transformed", into },
          ],
        };
        return { state };
      }
      if (into === "this" && event.data.intoObject) {
        const transformedIntoId = event.data.intoObject.instanceId;
        const transformedInto = state.objects[transformedIntoId];
        if (!object || !transformedInto || transformedIntoId === instanceId) return null;

        if (
          !attachFabTransformSources({
            state,
            sourceIds: [fabObjectInstanceId(instanceId)],
            destination: {
              kind: "resolving-card",
              hostId: fabObjectInstanceId(transformedIntoId),
            },
          })
        )
          return null;
        state.objects[transformedIntoId] = {
          ...state.objects[transformedIntoId]!,
          markers: [
            ...transformedInto.markers.filter((marker) => marker.kind !== "transformed"),
            { kind: "transformed", into },
          ],
        };
        return { state };
      }
      // Token / catalog / real-card identity transform. Resolve registered
      // definitions under `token:${slug}`, bare canonicalId, or a printed slug;
      // rewrite the object's identity in place. For a REAL card (e.g.
      // Singularity → Teklovossen the Mechropotent) also swap `base` so the type
      // line becomes the destination card's, carrying the controller's current
      // life forward (the Demi-Hero def has no inherent life; Singularity's
      // life-set step runs after the transform).
      if (
        object &&
        typeof into === "string" &&
        into !== "traverse" &&
        into !== "agent-of-chaos" &&
        into !== "transcend" &&
        into !== "token" &&
        into !== "this"
      ) {
        const resolvedId = resolveTransformIntoCanonicalId(state.cardDefinitions, into);
        if (resolvedId && state.cardDefinitions[resolvedId]) {
          const isRealCard = !resolvedId.startsWith("token:");
          if (isRealCard) {
            // The hero target swaps its canonicalId to the destination card →
            // the view derives the destination's types (Evo). Non-hero targets
            // stamp the transform marker only (the a2 fires from the
            // already-collected trigger). A proper multi-target merge (attach
            // sources under the hero via attachFabTransformSources) orphans zones
            // when the destination is a heroZone permanent — the hosted-card
            // topology/timing needs fixing first (P0 architecture follow-up).
            const isHero = (
              state.containers.zonesByPlayerId[object.ownerId]?.heroZone ?? []
            ).includes(instanceId);
            if (isHero) {
              state.objects[instanceId] = {
                ...object,
                canonicalId: fabCanonicalCardId(resolvedId),
                markers: [
                  ...object.markers.filter((marker) => marker.kind !== "transformed"),
                  { kind: "transformed", into },
                ],
              };
            } else {
              // Non-hero target: merge under the hero-destination. The runtime
              // derivation (runtime-derived.ts) SKIPS subcards whose host is in
              // heroZone (treats them as soul hosts — line 45-54). So hero-hosted
              // subcards must ALSO be seated in the soul zone for the derivation
              // to find them. Without soul seating, the object is removed from
              // its original zone + added to subcardsByHostId[heroId], but the
              // derivation skips that entry → orphan.
              const ownerId = object.ownerId;
              const heroId = state.containers.zonesByPlayerId[ownerId]?.heroZone[0];
              const playerZones = state.containers.zonesByPlayerId[ownerId];
              if (playerZones && heroId) {
                // Remove from current zone.
                for (const zn of Object.keys(playerZones)) {
                  if (zn === "under" || zn === "soul") continue;
                  const arr = (playerZones as Record<string, readonly string[]>)[zn];
                  if (arr.includes(instanceId)) {
                    (playerZones as Record<string, string[]>)[zn] = arr.filter(
                      (id) => id !== instanceId,
                    );
                    break;
                  }
                }
                // Seat in soul (hero-hosted subcards are tracked via soul zone).
                (playerZones as Record<string, string[]>).soul = [
                  ...((playerZones as Record<string, readonly string[]>).soul ?? []),
                  instanceId,
                ];
                // Track topology: source is a subcard of the hero.
                const oldSub = state.containers.subcardsByHostId;
                state.containers = {
                  ...state.containers,
                  subcardsByHostId: {
                    ...oldSub,
                    [heroId]: [...(oldSub[heroId] ?? []), fabObjectInstanceId(instanceId)],
                  },
                };
              }
              state.objects[instanceId] = {
                ...object,
                markers: [
                  ...object.markers.filter((marker) => marker.kind !== "transformed"),
                  { kind: "transformed", into },
                ],
              };
            }
          } else {
            state.objects[instanceId] = {
              ...object,
              canonicalId: fabCanonicalCardId(resolvedId),
              markers: [
                ...object.markers.filter((marker) => marker.kind !== "transformed"),
                { kind: "transformed", into },
              ],
            };
          }
          return { state };
        }
        // Unknown into: still stamp observation markers (legacy leaf contracts).
        state.objects[instanceId] = {
          ...object,
          markers: [
            ...object.markers.filter((marker) => marker.kind !== "transformed"),
            { kind: "transformed", into },
          ],
        };
        return { state };
      }
      // Generic transform observation (token / this / unparsed) for leaf contracts.
      if (object && into !== undefined && into !== "traverse" && into !== "agent-of-chaos") {
        state.objects[instanceId] = {
          ...object,
          markers: [
            ...object.markers.filter((marker) => marker.kind !== "transformed"),
            { kind: "transformed", into: into === "token" ? "transform" : into },
          ],
        };
        return { state };
      }
      if (into === "traverse") {
        // IAR traverse: change the selected twin face without changing the
        // physical object, its life, or its canonical identity.
        if (!object) return null;
        const definition = state.cardDefinitions[object.canonicalId];
        if (!definition || definition.layout.kind !== "twin") {
          return { state };
        }
        const generating = event.data.previous ?? event.source ?? object;
        const generatingFace =
          generating && "activeFace" in generating ? generating.activeFace : undefined;
        const generatingOnBack =
          generatingFace?.kind === "paired" &&
          generatingFace.activeFaceIds.includes(definition.layout.back.faceId);
        const currentOnBack =
          object.activeFace?.kind === "paired" &&
          object.activeFace.activeFaceIds.includes(definition.layout.back.faceId);
        // UST notes: extra traverse layers from the same face fail once that
        // face is no longer showing (do not flip back and forth).
        if (generatingOnBack !== currentOnBack) {
          return { state };
        }
        const activeBack =
          object.activeFace.kind === "paired" &&
          object.activeFace.activeFaceIds.includes(definition.layout.back.faceId);
        state.objects[instanceId] = {
          ...object,
          activeFace: selectFabActiveFace(
            definition,
            activeBack ? definition.layout.front.faceId : definition.layout.back.faceId,
          ),
          markers: [
            ...object.markers.filter((marker) => marker.kind !== "transformed"),
            { kind: "transformed", into },
          ],
        };
      } else if (into === "agent-of-chaos") {
        // HNT arakni-marionette / web-of-deceit: "become a random Agent of
        // Chaos". Pool = every registered definition carrying the trait
        // (match setup must register the demi-heroes; the engine stays
        // cards-package-free). Life is preserved; abilities come from the
        // new definition. Deterministic RNG from the match seed.
        if (!object) return { state };
        const pool = agentsOfChaosCanonicalIds(state);
        if (pool.length === 0) return { state };
        const roll = nextRandom(state.rngState);
        state.rngState = roll.state;
        const chosen = pool[Math.floor(roll.value * pool.length)]!;
        state.objects[instanceId] = {
          ...object,
          canonicalId: fabCanonicalCardId(chosen),
          markers: [
            ...object.markers.filter((marker) => marker.kind !== "transformed"),
            { kind: "transformed", into },
          ],
        };
      }
      return { state };
    }
    case "roll":
      return event.data.result >= 1 && event.data.result <= event.data.sides ? { state } : null;
    default:
      return assertNeverMechanics(event);
  }
}

/** CR 8.5.45: each clashing player reveals one deck-top. Identify it by owner. */
function clashRevealedCardForPlayer(
  event: Extract<MechanicsEvent, { name: "clash-outcome" }>,
  playerId: string,
) {
  const match = (object: NonNullable<(typeof event.affected)[number]>) =>
    object.ownerId === playerId || object.zoneRef.playerId === playerId;
  return event.affected.find(match) ?? event.data.revealed.find(match);
}

/**
 * Agents of Chaos available this match: definitions registered with the
 * printed trait. Sorted so RNG index selection is seed-stable across runs.
 */
function agentsOfChaosCanonicalIds(state: FabMatchState): readonly string[] {
  const ids: string[] = [];
  for (const [canonicalId, definition] of Object.entries(state.cardDefinitions)) {
    if (definition.base.traits.includes("Agent of Chaos")) {
      ids.push(canonicalId);
    }
  }
  return ids.sort((a, b) => a.localeCompare(b));
}

function assertNeverMechanics(event: never): never {
  throw new Error(`Unhandled FAB mechanics event: ${JSON.stringify(event)}`);
}
