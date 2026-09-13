import { fabAllDefenders } from "./game/combat.ts";
import { fabPlayerId } from "./game/identity.ts";
import type {
  FabDeclarationContext,
  FabDeclaredTarget,
  FabTargetCandidate,
} from "./kernel/trigger-declaration.ts";
import { runtimeZonesForCanonicalZone } from "./rules/condition-evaluator.ts";
import {
  buildFabRulesView,
  matchesFabSnapshotFilter,
  resolveFabEventBindings,
} from "./rules/state-rules-view.ts";
import { snapshotObject } from "./rules/snapshots.ts";
import {
  filterWantsControlledDagger,
  seatsForUnrestrictedObjectTarget,
  targetControllerFromDeclaredTargets,
} from "./runtime-helpers.ts";
import { FAB_ZONE_KINDS, type FabMatchState } from "./state.ts";
import { printedIdentityKey } from "./rules/printed-identity.ts";

export function legalFabDecisionTargets(
  state: Readonly<FabMatchState>,
  pending: FabDeclarationContext,
  target: FabDeclaredTarget,
): readonly FabTargetCandidate[] {
  if (target.selector === "any-hero") {
    const rules = buildFabRulesView(state);
    return state.playerIds.map((playerId) => ({
      instanceId: playerId,
      target: { kind: "player", playerId: fabPlayerId(playerId) },
      label: heroLabel(state, rules, playerId),
    }));
  }
  const declaredPlayerEntries =
    target.selector === "object" && target.playerTargetBinding
      ? Object.entries(pending.declaredTargets ?? {}).filter(([key]) =>
          key.endsWith(`:player@${target.playerTargetBinding}`),
        )
      : [];
  if (declaredPlayerEntries.length > 1) return [];
  const declaredPlayerIds = declaredPlayerEntries[0]?.[1].flatMap((entry) =>
    entry.kind === "player" ? [entry.playerId] : [],
  );
  if (
    target.selector === "object" &&
    target.playerTargetBinding &&
    (!declaredPlayerIds ||
      declaredPlayerIds.length !== 1 ||
      !state.playerIds.some((playerId) => playerId === declaredPlayerIds[0]))
  ) {
    return [];
  }
  if (target.selector !== "object") return [];
  const targetController = targetControllerFromDeclaredTargets(state, pending.declaredTargets);
  const relatedPlayerIds =
    declaredPlayerIds ??
    seatsForUnrestrictedObjectTarget(state, pending.controllerId, target.player, target.zones, {
      ...(pending.bindings as Readonly<Record<string, unknown>> | undefined),
      ...(targetController ? { "target-controller": targetController } : {}),
    });
  const relatedPlayerIdSet: ReadonlySet<string> = new Set(relatedPlayerIds);
  const playerIds = target.playerRelation === "owner" ? state.playerIds : relatedPlayerIds;
  const relationCandidates = target.relation
    ? new Set(
        buildFabRulesView(state)
          .targetCandidates(target, {
            controllerId: pending.controllerId,
            source: pending.source.ref,
            bindings: resolveFabEventBindings(pending.bindings),
          })
          .map((candidate) => candidate.ref.instanceId),
      )
    : null;
  const candidates: FabTargetCandidate[] = [];
  const seen = new Set<string>();
  const position = "position" in target ? target.position : undefined;
  const positionedCount = typeof target.count === "number" ? target.count : 1;
  for (const playerId of playerIds) {
    if (!state.players[playerId]) continue;
    for (const zone of target.zones.flatMap(runtimeZonesForCanonicalZone)) {
      if (zone === "under") {
        const hosted = state.containers.subcardsByHostId[pending.source.instanceId] ?? [];
        for (const instanceId of hosted) {
          if (seen.has(instanceId)) continue;
          const snapshot = snapshotObject(state, instanceId, playerId, "under");
          seen.add(instanceId);
          candidates.push({
            instanceId,
            target: { kind: "object", ref: snapshot.ref },
            label: snapshot.current.names[0] ?? instanceId,
            printedName: printedIdentityKey(snapshot.current.names, snapshot.canonicalId),
          });
        }
        continue;
      }
      let instanceIds = [...state.containers.zonesByPlayerId[playerId]![zone]];
      if (
        zone === "combatChain" &&
        instanceIds.length === 0 &&
        state.lastClosedCombat &&
        fabAllDefenders(state.lastClosedCombat).length > 0
      ) {
        instanceIds = [...fabAllDefenders(state.lastClosedCombat)];
      }
      if (zone === "combatChain") {
        instanceIds = combatChainCandidates(state, playerId, instanceIds, target.filter);
      }
      if (position === "top") instanceIds = instanceIds.slice().reverse();
      const matches: FabTargetCandidate[] = [];
      for (const instanceId of instanceIds) {
        if (seen.has(instanceId)) continue;
        const liveZone =
          FAB_ZONE_KINDS.find((candidateZone) =>
            state.playerIds.some((seat) =>
              state.containers.zonesByPlayerId[seat]?.[candidateZone].includes(instanceId),
            ),
          ) ?? zone;
        const livePlayer =
          state.playerIds.find((seat) =>
            state.containers.zonesByPlayerId[seat]?.[liveZone]?.includes(instanceId),
          ) ?? playerId;
        const snapshot = snapshotObject(state, instanceId, livePlayer, liveZone);
        if (target.playerRelation === "owner" && !relatedPlayerIdSet.has(snapshot.ownerId))
          continue;
        if (relationCandidates && !relationCandidates.has(snapshot.instanceId)) continue;
        if (
          target.filter &&
          !matchesFabSnapshotFilter(
            state,
            snapshot,
            target.filter,
            pending.bindings,
            pending.controllerId,
          )
        )
          continue;
        seen.add(instanceId);
        matches.push({
          instanceId,
          target: { kind: "object", ref: snapshot.ref },
          label: snapshot.current.names.join(" // ") || snapshot.canonicalId || instanceId,
          printedName: printedIdentityKey(snapshot.current.names, snapshot.canonicalId),
        });
      }
      candidates.push(...(position ? matches.slice(0, positionedCount) : matches));
    }
  }
  return candidates;
}

function heroLabel(
  state: Readonly<FabMatchState>,
  rules: ReturnType<typeof buildFabRulesView>,
  playerId: string,
): string {
  const heroId = state.players[playerId]?.heroCardId;
  const hero = heroId ? state.objects[heroId] : undefined;
  return hero
    ? rules
        .object({ instanceId: hero.instanceId, incarnation: hero.incarnation })
        ?.current.names.join(" // ") || playerId
    : playerId;
}

function combatChainCandidates(
  state: Readonly<FabMatchState>,
  playerId: string,
  initial: readonly string[],
  filter: unknown,
): string[] {
  const ids = [...initial];
  const attackId = state.combat?.activeLink?.activeAttack.sourceObjectId;
  if (
    attackId &&
    state.combat?.activeLink?.attackingPlayerId === playerId &&
    !ids.includes(attackId)
  )
    ids.push(attackId);
  if (state.combat?.activeLink) {
    for (const defenderId of fabAllDefenders(state.combat.activeLink)) {
      if (!ids.includes(defenderId)) ids.push(defenderId);
    }
  }
  if (filterWantsControlledDagger(filter)) {
    for (const seat of ["weapon1", "weapon2"] as const) {
      for (const equippedId of state.containers.zonesByPlayerId[playerId]![seat]) {
        if (!ids.includes(equippedId)) ids.push(equippedId);
      }
    }
  }
  return ids;
}
