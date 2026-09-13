import type { FabMatchRuntime } from "../../runtime.ts";
import { arsenalHasRoom } from "../../rules/arsenal-capacity.ts";
import type { FabRulesView } from "../../rules/rules-view.ts";
import { estimateOnHitValue } from "./defend.ts";
import { heroMirrorKey } from "./profiles/names.ts";
import type { FabHeuristicCard, FabHeuristicSnapshot } from "./types.ts";

export function buildHeuristicSnapshot(
  runtime: FabMatchRuntime,
  actorId: string,
  view: FabRulesView,
): FabHeuristicSnapshot {
  const state = runtime.getState();
  const player = state.players[actorId];
  const zones = state.containers.zonesByPlayerId[actorId];
  const combat = state.combat;
  const defending =
    Boolean(combat?.open) &&
    combat?.activeLink?.defendingPlayerId === actorId &&
    (combat.step === "defend" || combat.step === "reaction");
  const evaluatedCombat = defending ? view.combat() : null;
  const opponentId = state.playerIds.find((id) => id !== actorId);
  const opponentLife = opponentId ? (state.players[opponentId]?.life ?? null) : null;
  const opponentGraveyardCount = opponentId
    ? (state.containers.zonesByPlayerId[opponentId]?.graveyard.length ?? 0)
    : 0;
  const remainingDamage = evaluatedCombat
    ? Math.max(0, evaluatedCombat.attackPower - evaluatedCombat.defense)
    : defending
      ? 0
      : null;
  const attackHasGoAgain = Boolean(
    evaluatedCombat?.attack.current.keywords.some((keyword) => keyword.name === "go-again"),
  );
  const heroId = player?.heroCardId ?? null;
  const heroRecord = heroId ? state.objects[heroId] : undefined;
  const heroObject = heroRecord
    ? view.object({ instanceId: heroRecord.instanceId, incarnation: heroRecord.incarnation })
    : null;
  const opponentHeroId = opponentId ? (state.players[opponentId]?.heroCardId ?? null) : null;
  const opponentHeroRecord = opponentHeroId ? state.objects[opponentHeroId] : undefined;
  const opponentHeroObject = opponentHeroRecord
    ? view.object({
        instanceId: opponentHeroRecord.instanceId,
        incarnation: opponentHeroRecord.incarnation,
      })
    : null;
  const heroCanonicalId = heroObject?.canonicalId ?? heroRecord?.canonicalId ?? null;
  const heroName = heroObject?.current.names.join(" // ") ?? "";
  const opponentHeroCanonicalId =
    opponentHeroObject?.canonicalId ?? opponentHeroRecord?.canonicalId ?? null;
  const opponentHeroName = opponentHeroObject?.current.names.join(" // ") ?? "";
  const selfKey = heroMirrorKey(heroName, heroCanonicalId);
  const opponentKey = heroMirrorKey(opponentHeroName, opponentHeroCanonicalId);
  const draftCards = {
    hand: (zones?.hand ?? []).flatMap((id) => cardView(state, view, id) ?? []),
    arsenal: (zones?.arsenal ?? []).flatMap((id) => cardView(state, view, id) ?? []),
    banished: (zones?.banished ?? []).flatMap((id) => cardView(state, view, id) ?? []),
    arena: (zones?.arena ?? []).flatMap((id) => cardView(state, view, id) ?? []),
    graveyard: (zones?.graveyard ?? []).flatMap((id) => cardView(state, view, id) ?? []),
    combatChain: (zones?.combatChain ?? []).flatMap((id) => cardView(state, view, id) ?? []),
    equipment: (
      ["head", "chest", "arms", "legs", "weapon1", "weapon2", "heroZone"] as const
    ).flatMap((zone) => (zones?.[zone] ?? []).flatMap((id) => cardView(state, view, id) ?? [])),
  };
  const decision = state.decision;
  const procedure = state.rulesProcess?.procedure;
  const pendingAttackPayment =
    decision?.actorId === actorId &&
    decision.kind === "payment" &&
    procedure?.kind === "play-card" &&
    procedure.actorId === actorId &&
    procedure.object.current.typeBox.subtypes.includes("Attack")
      ? {
          sourceInstanceId: procedure.object.instanceId,
          remainingCost: decision.amount,
          pitchedInstanceIds: procedure.pitchedInstanceIds,
        }
      : undefined;

  return {
    actorId,
    isActive: actorId === state.activePlayerId,
    combatOpen: Boolean(combat?.open),
    stackOpen: state.rulesStack.length > 0,
    defending,
    actionPoints: player?.actionPoints ?? 0,
    resourcePoints: player?.resourcePoints ?? 0,
    intellect: player?.intellect ?? 4,
    life: player?.life ?? 0,
    opponentLife,
    opponentGraveyardCount,
    hand: draftCards.hand,
    arsenal: draftCards.arsenal,
    equipment: draftCards.equipment,
    banished: draftCards.banished,
    arena: draftCards.arena,
    graveyard: draftCards.graveyard,
    combatChain: draftCards.combatChain,
    arsenalHasRoom: arsenalHasRoom(state, actorId),
    seismicSurgeCount: draftCards.arena.filter((card) => {
      const key = `${card.name} ${card.canonicalId}`.toLowerCase();
      return key.includes("seismic surge") || key.includes("seismic-surge");
    }).length,
    turnNumber: state.turnNumber,
    refillsHandAtEndOfTurn: state.turnNumber === 1 && actorId !== state.activePlayerId,
    boostsThisTurn: player?.history.turn.boostsThisTurn ?? 0,
    remainingDamage,
    attackPower: evaluatedCombat?.attackPower ?? null,
    attackHasGoAgain,
    attackOnHitValue: evaluatedCombat
      ? estimateOnHitValue(view, evaluatedCombat.attack.ref, {
          hand: draftCards.hand,
          arsenal: draftCards.arsenal,
        })
      : 0,
    chainLinkNumber: combat?.chainLinkNumber ?? 1,
    combatStep: combat?.step === "defend" || combat?.step === "reaction" ? combat.step : null,
    decisionKind: state.decision?.actorId === actorId ? state.decision.kind : null,
    pendingAttackPayment,
    heroCanonicalId,
    heroName,
    opponentHeroCanonicalId,
    opponentHeroName,
    isMirror: selfKey.length > 0 && selfKey === opponentKey,
    discardedPower6: player?.history.turn.discardedPower6 === true,
    pitchedPower6: player?.history.turn.pitchedPower6 === true,
    opponentMarked: opponentId ? state.players[opponentId]?.marked === true : false,
    bluePutIntoGraveyardThisTurn: player?.history.turn.bluePutIntoGraveyard === true,
  };
}

function cardView(
  state: ReturnType<FabMatchRuntime["getState"]>,
  view: FabRulesView,
  instanceId: string,
): FabHeuristicCard | null {
  const record = state.objects[instanceId];
  if (!record) return null;
  const object = view.object({
    instanceId: record.instanceId,
    incarnation: record.incarnation,
  });
  if (!object) return null;
  const types = object.current.typeBox.types;
  const subtypes = object.current.typeBox.subtypes;
  const zone = object.zone.zone;
  return {
    instanceId,
    canonicalId: object.canonicalId,
    name: object.current.names.join(" // ") || object.canonicalId,
    types,
    subtypes,
    power: object.current.numeric.power ?? 0,
    cost: object.current.numeric.cost ?? 0,
    defense: object.current.numeric.defense ?? 0,
    pitch: object.current.numeric.pitch ?? 0,
    isAttack: subtypes.includes("Attack"),
    isDefenseReaction: types.includes("Defense Reaction"),
    isResource: types.includes("Resource"),
    isEquipment:
      types.includes("Equipment") ||
      zone === "head" ||
      zone === "chest" ||
      zone === "arms" ||
      zone === "legs",
    hasGoAgain: object.current.keywords.some((keyword) => keyword.name === "go-again"),
    hasStealth: object.current.keywords.some((keyword) => keyword.name === "stealth"),
    hasHeave: object.current.keywords.some((keyword) => keyword.name === "heave"),
    hasWateryGrave: object.current.keywords.some((keyword) => keyword.name === "watery-grave"),
    hasBattleworn: object.current.keywords.some((keyword) => keyword.name === "battleworn"),
    hasTemper: object.current.keywords.some((keyword) => keyword.name === "temper"),
    hasBladeBreak: object.current.keywords.some((keyword) => keyword.name === "blade-break"),
    additionalHandDiscard: additionalHandDiscardCount(object),
  };
}

function additionalHandDiscardCount(
  object: NonNullable<ReturnType<FabRulesView["object"]>>,
): number {
  let total = 0;
  for (const ability of object.current.abilities) {
    if (ability.kind !== "static" || ability.playEffect?.role !== "additional-cost") continue;
    if (ability.playEffect.optional === true) continue;
    const cost = ability.playEffect.cost;
    if (!cost || cost.class !== "effect" || cost.type !== "discard") continue;
    if (cost.from !== undefined && cost.from !== "hand") continue;
    const count = cost.count;
    total += typeof count === "number" ? count : 1;
  }
  return total;
}

export function cardByInstance(
  snapshot: FabHeuristicSnapshot,
  instanceId: string,
): FabHeuristicCard | undefined {
  return (
    snapshot.hand.find((card) => card.instanceId === instanceId) ??
    snapshot.arsenal.find((card) => card.instanceId === instanceId) ??
    snapshot.equipment.find((card) => card.instanceId === instanceId) ??
    snapshot.banished.find((card) => card.instanceId === instanceId) ??
    snapshot.arena.find((card) => card.instanceId === instanceId) ??
    snapshot.graveyard.find((card) => card.instanceId === instanceId) ??
    snapshot.combatChain.find((card) => card.instanceId === instanceId)
  );
}
