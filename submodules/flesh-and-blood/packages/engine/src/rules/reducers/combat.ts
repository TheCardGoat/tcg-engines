import type { FabMatchState } from "../../state.ts";
import type { ProposedEvent } from "../events.ts";
import type { FabEventReduction } from "../../kernel/transaction-kernel.ts";
import { nextFabDestinationRef } from "../snapshots.ts";
import { buildFabRulesView } from "../state-rules-view.ts";
import { endGameForLoser, moveKnownObject, validAttackTarget } from "./shared.ts";
import { closeFabPriority, openFabPriority } from "../../priority.ts";
import {
  fabAttackProxyId,
  fabObjectInstanceId,
  fabPlayerId,
  type FabObjectInstanceId,
} from "../../game/identity.ts";
import {
  fabAttackTargetKey,
  fabAttackTargetRefsEqual,
  fabAllDefenders,
  fabCombatDamageForTarget,
  fabCombatDamageResolved,
  fabCombatDidHit,
} from "../../game/combat.ts";
import { fabPlayerLogCard, fabPlayerLogTarget, type FabPlayerLogFact } from "../../player-log.ts";

export type CombatEventName =
  | "attack"
  | "attack-target-declared"
  | "defend"
  | "defense-declaration-complete"
  | "resolve-combat-damage"
  | "advance-combat-step"
  | "hit"
  | "reaction-step"
  | "chain-link-resolve"
  | "combat-chain-close"
  | "go-again"
  | "deal-damage"
  | "dealt-damage"
  | "prevent"
  | "retarget-attack";

type CombatEvent = Extract<ProposedEvent, { name: CombatEventName }>;

export function reduceCombatEvent(
  state: FabMatchState,
  event: CombatEvent,
): FabEventReduction | null {
  switch (event.name) {
    case "attack-target-declared":
      return state.players[event.data.actorId] ? { state } : null;
    case "attack": {
      const player = state.players[event.data.actorId];
      if (
        !player ||
        !validAttackTarget(
          state,
          event.data.actorId,
          event.data.target,
          event.data.defendingPlayerId,
        )
      )
        return null;
      // CR 7.2.2c (C) / 7.7.2b: validAttackTarget deliberately accepts a
      // spectra/permanent target that was destroyed during finalizePlay (it
      // still exists in state.objects, now in the graveyard). "legal
      // attack-targets" here means THIS attack's declared target(s), not every
      // attackable object in the arena — the opponent hero is NOT a fallback
      // target. So when the attack's declared spectra/permanent target was
      // destroyed before the Attack Step and no other declared target survives,
      // the attack has no legal attack-target: it is cleared and the combat
      // chain closes. The active link is still formed (so the standard close
      // procedure can retire the attack card to the graveyard), but the link
      // jumps straight to Resolution, skipping the Defend/Damage steps — the
      // destroyed aura is never treated as a live, defendable target. This
      // mirrors activeAttackDestroyedBeforeDamage (zone-moves/helpers.ts).
      const defendingArena =
        state.containers.zonesByPlayerId[event.data.defendingPlayerId]?.arena ?? [];
      const declaredTarget = event.data.target;
      const declaredTargetDestroyed =
        (declaredTarget.kind === "spectra" || declaredTarget.kind === "permanent") &&
        !defendingArena.includes(declaredTarget.ref.instanceId);
      // A surviving declared target is any hero, or any object still in its
      // controller's arena. The destroyed primary does not count.
      const survivingAdditionalTarget = (event.data.additionalTargets ?? []).some((target) =>
        target.kind === "hero"
          ? true
          : (state.containers.zonesByPlayerId[target.controllerId]?.arena ?? []).includes(
              target.ref.instanceId,
            ),
      );
      const soleDeclaredTargetDestroyed = declaredTargetDestroyed && !survivingAdditionalTarget;
      const attackTargetRef = targetRefForAttack(state, event.data.target);
      const additionalAttackTargetRefs = (event.data.additionalTargets ?? [])
        .map((target) => targetRefForAttack(state, target))
        .filter((target): target is import("../../state.ts").FabAttackTargetRef => target !== null);
      if (
        !attackTargetRef ||
        additionalAttackTargetRefs.length !== (event.data.additionalTargets?.length ?? 0)
      ) {
        return null;
      }
      // Kassai Cintari / In the Swing: count weapon attacks declared this turn.
      // And Again / Hell Hammer: remember the exact weapon instance attacked with.
      if (isWeaponAttackObject(event.data.object)) {
        player.history.turn.weaponAttacks += 1;
        const weaponId = event.data.object.instanceId;
        player.history.turn.weaponAttackCountsByInstanceIdThisTurn[weaponId] =
          (player.history.turn.weaponAttackCountsByInstanceIdThisTurn[weaponId] ?? 0) + 1;
        if (!player.history.turn.weaponAttackInstanceIdsThisTurn.includes(weaponId)) {
          player.history.turn.weaponAttackInstanceIdsThisTurn = [
            ...player.history.turn.weaponAttackInstanceIdsThisTurn,
            weaponId,
          ];
        }
      }
      // Prowess of Agility family: total declarations (weapon + action).
      player.history.turn.attacksThisTurn += 1;
      const attackedHeroIds = [event.data.target, ...(event.data.additionalTargets ?? [])].flatMap(
        (target) => (target.kind === "hero" ? [target.playerId] : []),
      );
      for (const attackedHeroId of new Set(attackedHeroIds)) {
        const attackedPlayer = state.players[attackedHeroId];
        if (attackedPlayer) attackedPlayer.history.turn.timesAttackedThisTurn += 1;
      }
      // Blood Scent: "if you've attacked with a Crouching Tiger this turn".
      if (isCrouchingTigerAttackObject(state, event.data.object.instanceId)) {
        player.history.turn.attackedWithCrouchingTiger = true;
      }
      const previous = state.combat?.activeLink;
      // Stamp the prior link as last-attack-this-turn (by printed name) before the
      // new attack becomes current — Hatchet of Body/Mind and similar "last attack
      // this turn" gates evaluate against this while the new attack is open.
      if (previous) {
        const stamped = attackObjectPrintedNames(state, previous.activeAttack.sourceObjectId);
        if (stamped.length > 0) {
          player.history.turn.lastAttackNames = stamped;
          player.history.combatChain.lastAttackNames = stamped;
        }
        // Push the Point / "if the last attack on this combat chain hit":
        // stamp the prior link's hit before the new attack becomes current.
        player.history.combatChain.lastAttackDidHit = fabCombatDidHit(previous);
      }
      const closedLinks = [...(state.combat?.closedLinks ?? []), ...(previous ? [previous] : [])];
      const chainLinkNumber = (state.combat?.chainLinkNumber ?? 0) + 1;
      if (!state.combat) {
        for (const participant of Object.values(state.players)) {
          participant.history.combatChain.combatNumber =
            (participant.history.combatChain.combatNumber ?? 0) + 1;
          participant.history.combatChain.draconicChainLinks = 0;
          participant.history.combatChain.wagered = false;
          participant.history.combatChain.lastAttackNames = [];
          participant.history.combatChain.lastAttackDidHit = false;
          participant.history.combatChain.boostsThisCombatChain = 0;
          participant.history.combatChain.cardsBanishedFromSoulThisCombatChain = 0;
        }
      }
      for (const participant of Object.values(state.players)) {
        participant.history.chainLink.chainLinkNumber = chainLinkNumber;
        participant.history.chainLink.playedInstant = false;
        participant.history.chainLink.damageDealtByType = {
          arcane: 0,
          physical: 0,
          generic: 0,
        };
        participant.history.chainLink.damageDealtBySource = {};
        participant.history.chainLink.damageDealtBySourceToHero = {};
      }
      const attackProxyId = isAttackCardObject(event.data.object)
        ? null
        : fabAttackProxyId(`attack-proxy:${state.counters.event + 1}`);
      // CR 1.4.3c: proxies exist only for their current chain link. Closed
      // links retain the proxy id as historical identity/LKI, not a live object.
      state.attackProxies = {};
      if (attackProxyId) {
        state.attackProxies[attackProxyId] = {
          id: attackProxyId,
          sourceId: fabObjectInstanceId(event.data.object.instanceId),
          sourceRef: {
            instanceId: fabObjectInstanceId(event.data.object.ref.instanceId),
            incarnation: event.data.object.ref.incarnation,
          },
          controllerId: fabPlayerId(event.data.actorId),
          createdByEventId: `event-${state.counters.event + 1}`,
        };
      }
      state.combat = {
        open: true,
        step: soleDeclaredTargetDestroyed ? "resolution" : "attack",
        activeLink: {
          activeAttack: attackProxyId
            ? {
                kind: "proxy",
                proxyId: attackProxyId,
                sourceObjectId: fabObjectInstanceId(event.data.object.instanceId),
              }
            : {
                kind: "card",
                sourceObjectId: fabObjectInstanceId(event.data.object.instanceId),
              },
          attackingPlayerId: fabPlayerId(event.data.actorId),
          defendingPlayerId: fabPlayerId(event.data.defendingPlayerId),
          attackTargetRef,
          ...(additionalAttackTargetRefs.length > 0 ? { additionalAttackTargetRefs } : {}),
          defendingInstanceIdsByTarget: { [fabAttackTargetKey(attackTargetRef)]: [] },
          defendingOrigins: {},
          damage: {
            status: "pending",
            outcomes: [attackTargetRef, ...additionalAttackTargetRefs].flatMap((target) =>
              target ? [{ target, damageDealtByActiveAttack: 0 }] : [],
            ),
          },
          reactionInstanceIds: [],
          attackReactionPlayedOrActivated: false,
          attackingPlayerPlayedOrActivatedInReaction: false,
          wagers: [],
        },
        defenseDeclarationPending: false,
        chainLinkNumber,
        closedLinks,
      };
      // CR 7.2.2c (C) / 7.7.2b: when the sole declared target was destroyed
      // before the Attack Step, open straight at Resolution so the next pass
      // drives the standard close procedure (no Defend/Damage window against
      // the destroyed aura). Otherwise open the normal Attack step.
      openFabPriority(
        state,
        state.activePlayerId,
        "combat",
        soleDeclaredTargetDestroyed ? "resolution" : "attack",
        { kind: "own-action", sourceInstanceId: event.data.object.instanceId },
      );
      state.lastClosedCombat = null;
      const typeBox = event.data.object.current.typeBox;
      const typeNames = typeBox.types as readonly string[];
      if (typeBox.supertypes.includes("Draconic") || typeNames.includes("Draconic")) {
        player.history.combatChain.draconicChainLinks += 1;
      }
      if (event.data.object.current.typeBox.types.includes("Action")) {
        player.history.turn.attackedOrDefendedWithAttackActionThisTurn = true;
      }
      // CR 7.2.2b: an attack-proxy and its source move onto the combat chain.
      // Allies are permanents; they return on close (CR 7.7.5). Weapons stay
      // seated — their equipped zone is already their arena occupancy.
      moveAttackingAllySourceOntoChain(state, event.data.object);
      if (attackProxyId) {
        const movedSource = state.objects[event.data.object.instanceId];
        if (!movedSource) return null;
        state.attackProxies[attackProxyId] = {
          ...state.attackProxies[attackProxyId]!,
          sourceRef: {
            instanceId: movedSource.instanceId,
            incarnation: movedSource.incarnation,
          },
        };
      }
      return {
        state,
        playerLogFacts: [
          {
            kind: "attack-declared",
            actorId: event.data.actorId,
            card: fabPlayerLogCard(event.data.object),
            ...(() => {
              const causeSource = "source" in event.cause ? event.cause.source : null;
              return causeSource && causeSource.instanceId !== event.data.object.instanceId
                ? { effectSource: fabPlayerLogCard(causeSource) }
                : {};
            })(),
            target: fabPlayerLogTarget(state, event.data.target),
            attack: Math.max(0, event.data.object.current.numeric.power ?? 0),
          },
        ],
      };
    }
    case "defend": {
      const link = state.combat?.activeLink;
      const player = state.players[event.data.actorId];
      if (player && event.data.object.current.typeBox.types.includes("Action")) {
        player.history.turn.attackedOrDefendedWithAttackActionThisTurn = true;
      }
      if (
        !link ||
        !player ||
        link.defendingPlayerId !== event.data.actorId ||
        link.activeAttack.sourceObjectId !== event.data.attack.instanceId ||
        event.data.object.zone !== defendSnapshotZone(event.data.from) ||
        !moveKnownObject(
          state,
          event.data.object,
          event.data.from,
          "combatChain",
          event.data.destinationRef,
        )
      )
        return null;
      if (!link.attackTargetRef) return null;
      const defenders = link.defendingInstanceIdsByTarget[fabAttackTargetKey(link.attackTargetRef)];
      if (!defenders) return null;
      defenders.push(fabObjectInstanceId(event.data.object.instanceId));
      link.defendingOrigins[event.data.object.instanceId] =
        event.data.origin === "arsenal"
          ? { kind: "arsenal" }
          : event.data.origin === "hand"
            ? { kind: "hand" }
            : event.data.origin === "deck"
              ? { kind: "deck" }
              : event.data.origin === "head" ||
                  event.data.origin === "chest" ||
                  event.data.origin === "arms" ||
                  event.data.origin === "legs" ||
                  event.data.origin === "weapon1" ||
                  event.data.origin === "weapon2"
                ? { kind: "equipment", zone: event.data.origin }
                : { kind: "reaction", from: event.data.origin };
      return {
        state,
        playerLogFacts: [
          {
            kind: "card-defended",
            actorId: event.data.actorId,
            card: fabPlayerLogCard(event.data.object),
            defense: Math.max(0, event.data.object.current.numeric.defense ?? 0),
          },
        ],
      };
    }
    case "defense-declaration-complete": {
      const combat = state.combat;
      const link = combat?.activeLink;
      if (
        !combat ||
        combat.step !== "defend" ||
        !combat.defenseDeclarationPending ||
        !link ||
        link.activeAttack.sourceObjectId !== event.data.attack.instanceId ||
        link.defendingPlayerId !== event.data.defendingPlayerId
      ) {
        return null;
      }
      combat.defenseDeclarationPending = false;
      openFabPriority(state, state.activePlayerId, "combat", "defend");
      return { state };
    }
    case "resolve-combat-damage": {
      const link = state.combat?.activeLink;
      if (
        !link ||
        link.activeAttack.sourceObjectId !== event.data.attack.instanceId ||
        fabCombatDamageResolved(link)
      ) {
        return null;
      }
      const playerLogFacts: FabPlayerLogFact[] = event.data.outcomes.map((outcome) => ({
        kind: "combat-resolved",
        card: fabPlayerLogCard(event.data.attack),
        target: fabPlayerLogTarget(state, outcome.target),
        attack: event.data.attackPower,
        defense: outcome.totalDefense,
        damage: fabCombatDamageForTarget(link, outcome.target),
        defended:
          (link.defendingInstanceIdsByTarget[fabAttackTargetKey(outcome.target)] ?? []).length > 0,
      }));
      link.resolvedAttackLki = {
        power: event.data.attackPower,
        basePower: Math.max(0, event.data.attack.baseNumeric.power ?? 0),
        totalDefense: event.data.totalDefense,
        hasGoAgain: event.data.attack.current.keywords.some(
          (keyword) => keyword.name === "go-again",
        ),
      };
      link.damage.status = "resolved";
      if (state.combat) state.combat.step = "damage";
      openFabPriority(state, state.activePlayerId, "combat", "damage");
      return { state, playerLogFacts };
    }
    case "advance-combat-step": {
      const combat = state.combat;
      if (
        !combat?.activeLink ||
        combat.activeLink.activeAttack.sourceObjectId !== event.data.attack.instanceId ||
        combat.step !== event.data.from
      )
        return null;
      if (event.data.to === "resolution" && combat.activeLink.resolvedAttackLki) {
        combat.activeLink.resolvedAttackLki = {
          ...combat.activeLink.resolvedAttackLki,
          power: Math.max(0, event.data.attack.current.numeric.power ?? 0),
          basePower: Math.max(0, event.data.attack.baseNumeric.power ?? 0),
        };
      }
      combat.step = event.data.to;
      if (event.data.to === "defend") {
        combat.defenseDeclarationPending = true;
        closeFabPriority(state);
      } else {
        openFabPriority(state, state.activePlayerId, "combat", event.data.to);
      }
      return { state };
    }
    case "hit": {
      // Combat-chain hits: object is the active attack on the link.
      // Off-chain "the dagger has hit" (Danger Digits / Throw Dagger): object
      // is a weapon that dealt damage via effect, not the chain attack.
      const link = state.combat?.activeLink;
      const isActiveAttack =
        Boolean(link) && link!.activeAttack.sourceObjectId === event.data.object.instanceId;
      if (event.data.damage <= 0) return null;
      if (isActiveAttack) {
        const attacker = state.players[event.data.actorId];
        if (attacker) attacker.history.combatChain.lastAttackDidHit = true;
      }
      // CR 9.3.3: a marked hero loses Marked as part of a hit by an opponent.
      // This is deliberately in the hit reducer, rather than a trigger/state
      // process. `targetWasMarked` preserves the event-time fact for triggers.
      const targetPlayerId =
        "kind" in event.data.target && event.data.target.kind === "hero"
          ? event.data.target.playerId
          : null;
      if (targetPlayerId && targetPlayerId !== event.data.actorId) {
        const targetPlayer = state.players[targetPlayerId];
        if (targetPlayer?.marked) {
          targetPlayer.marked = false;
          const heroId = state.containers.zonesByPlayerId[targetPlayerId]?.heroZone[0];
          const hero = heroId ? state.objects[heroId] : undefined;
          if (hero) {
            state.objects[heroId] = {
              ...hero,
              markers: hero.markers.filter(
                (marker) => !(marker.kind === "status" && marker.value === "marked"),
              ),
            };
          }
        }
      }
      if (!isActiveAttack) {
        // Off-chain hit: still stamp turn/weapon hit history for printed
        // "if a dagger has hit" / "you've hit this turn" readers.
        const attacker = state.players[event.data.actorId];
        if (!attacker) return null;
        const targetRef = targetRefForDamageEvent(state, event.data.target);
        attacker.history.turn.hitOutcomes.push({
          sourceObjectId: event.data.object.instanceId,
          targetObjectId: targetRef ? targetObjectId(state, targetRef) : null,
          sourceWasWeapon: isWeaponAttackObject(event.data.object),
          sourceWasDagger: isDaggerHitSource(state, event.data.object),
          sourceWasSword: isSwordHitSource(state, event.data.object),
          combatNumber: null,
        });
        return { state };
      }
      const attacker = state.players[link!.attackingPlayerId]!;
      // CR 7.5.5b: `event.data.damage` is the pre-replacement combat
      // calculation. A hit only exists if the active attack actually dealt
      // physical damage after prevention/replacement effects resolved.
      const targetRef = targetRefForDamageEvent(state, event.data.target);
      if (!targetRef || fabCombatDamageForTarget(link!, targetRef) <= 0) return null;
      if (attacker.history.combatChain.combatNumber === null) {
        attacker.history.combatChain.combatNumber = 1;
      }
      attacker.history.turn.hitOutcomes.push({
        sourceObjectId: event.data.object.instanceId,
        targetObjectId: targetObjectId(state, targetRef),
        sourceWasWeapon: isWeaponAttackObject(event.data.object),
        sourceWasDagger: isDaggerHitSource(state, event.data.object),
        sourceWasSword: isSwordHitSource(state, event.data.object),
        combatNumber: attacker.history.combatChain.combatNumber,
      });
      return { state };
    }
    case "reaction-step": {
      const combat = state.combat;
      if (
        !combat?.activeLink ||
        combat.activeLink.activeAttack.sourceObjectId !== event.data.attack.instanceId
      ) {
        return null;
      }
      combat.step = "reaction";
      openFabPriority(state, state.activePlayerId, "combat", "reaction");
      return { state };
    }
    case "chain-link-resolve": {
      const combat = state.combat;
      if (
        !combat?.activeLink ||
        combat.activeLink.activeAttack.sourceObjectId !== event.data.attack.instanceId
      ) {
        return null;
      }
      combat.step = "close";
      closeFabPriority(state);
      return { state };
    }
    case "combat-chain-close": {
      if (!state.combat?.open) return null;
      // Preserve the closing link's hit result and player roles before clearing
      // combat, so combat-chain-close triggers (e.g. "if this didn't hit",
      // "defending-hero creates a token") can evaluate after combat is null.
      const closingLink = state.combat.activeLink;
      if (closingLink) {
        const closedLinks = [...(state.combat.closedLinks ?? []), closingLink];
        const closingAttacker = state.players[closingLink.attackingPlayerId];
        if (closingAttacker) {
          closingAttacker.history.combatChain.lastAttackDidHit = fabCombatDidHit(closingLink);
          // Persist last attack identity across chain close so "last attack this
          // turn" conditions (Hatchet of Body/Mind) work on a subsequent chain.
          const stamped = attackObjectPrintedNames(state, closingLink.activeAttack.sourceObjectId);
          if (stamped.length > 0) {
            closingAttacker.history.turn.lastAttackNames = stamped;
            closingAttacker.history.combatChain.lastAttackNames = stamped;
          }
        }
        state.lastClosedCombat = {
          attackingPlayerId: closingLink.attackingPlayerId,
          defendingPlayerId: closingLink.defendingPlayerId,
          // Preserve every link's defenders and exact hit outcome. Source-native
          // close triggers must not inherit the final link's identity or result.
          defendingInstanceIdsByTarget: closedLinks.reduce<Record<string, FabObjectInstanceId[]>>(
            (byTarget, link) => {
              for (const [targetId, defenders] of Object.entries(
                link.defendingInstanceIdsByTarget,
              )) {
                byTarget[targetId] = [...(byTarget[targetId] ?? []), ...defenders];
              }
              return byTarget;
            },
            {},
          ),
          attackDidHitByInstanceId: Object.fromEntries(
            closedLinks.map((link) => [link.activeAttack.sourceObjectId, fabCombatDidHit(link)]),
          ),
          defendedAttackPowersByInstanceId: closedLinks.reduce<Record<string, number[]>>(
            (powersByDefender, link) => {
              if (!link.resolvedAttackLki) return powersByDefender;
              for (const defenderId of fabAllDefenders(link)) {
                powersByDefender[defenderId] = [
                  ...(powersByDefender[defenderId] ?? []),
                  link.resolvedAttackLki.power,
                ];
              }
              return powersByDefender;
            },
            {},
          ),
        };
        // CR 8.5.46a makes the attack, not its reusable physical source,
        // wagered. Weapon attacks resolve through proxies backed by the
        // equipped weapon, so remove the observation marker when this combat
        // chain's attack identities expire.
        for (const sourceObjectId of new Set(
          closedLinks
            .filter((link) => link.wagers.length > 0)
            .map((link) => link.activeAttack.sourceObjectId),
        )) {
          const object = state.objects[sourceObjectId];
          if (!object?.markers.some((marker) => marker.kind === "wagered")) continue;
          state.objects[sourceObjectId] = {
            ...object,
            markers: object.markers.filter((marker) => marker.kind !== "wagered"),
          };
        }
      }
      // A combat chain is over as this event resolves. Even an unused "next"
      // application is bounded by that chain; retaining it turns a printed
      // "this combat chain" effect into a match-long grant between chains.
      state.continuousEffectInstances = state.continuousEffectInstances.filter(
        (continuous) => continuous.expiresAt.kind !== "combat-chain",
      );
      state.delayedTriggers = state.delayedTriggers.filter(
        (delayed) => delayed.policy.expiresAt.kind !== "combat-chain",
      );
      state.combat = null;
      // CR 1.4.3c: an attack-proxy cannot outlive its chain link. The closed
      // chain link retains its regular immutable object LKI independently.
      state.attackProxies = {};
      for (const player of Object.values(state.players)) {
        player.history.combatChain.draconicChainLinks = 0;
        player.history.combatChain.boostsThisCombatChain = 0;
        player.history.combatChain.cardsBanishedFromSoulThisCombatChain = 0;
        player.history.combatChain.wagered = false;
        player.history.combatChain.lastAttackNames = [];
        player.history.chainLink.chainLinkNumber = null;
        player.history.chainLink.playedInstant = false;
        player.history.chainLink.damageDealtByType = { arcane: 0, physical: 0, generic: 0 };
        player.history.chainLink.damageDealtBySource = {};
        player.history.chainLink.damageDealtBySourceToHero = {};
      }
      openFabPriority(state, state.activePlayerId, "action", null);
      return { state };
    }
    case "go-again": {
      const player = state.players[event.data.controllerId];
      if (!player) return null;
      player.actionPoints += 1;
      return { state };
    }
    case "deal-damage": {
      const targetRecord =
        "instanceId" in event.data.target ? state.objects[event.data.target.instanceId] : undefined;
      const targetLife = targetRecord
        ? buildFabRulesView(state).object({
            instanceId: targetRecord.instanceId,
            incarnation: targetRecord.incarnation,
          })?.current.numeric.life
        : undefined;
      if (!reduceDamage(state, event.data)) return null;
      const activeLink = state.combat?.activeLink;
      if (
        activeLink &&
        activeLink.damage.status === "pending" &&
        event.data.damageType === "physical" &&
        event.data.source?.instanceId === activeLink.activeAttack.sourceObjectId
      ) {
        const targetRef = targetRefForDamageEvent(state, event.data.target);
        const outcome = targetRef
          ? activeLink.damage.outcomes.find((candidate) =>
              fabAttackTargetRefsEqual(candidate.target, targetRef),
            )
          : undefined;
        if (outcome) outcome.damageDealtByActiveAttack += event.data.amount;
      }
      const followUpEvents: ProposedEvent[] = [
        {
          ...event,
          name: "dealt-damage",
          cause: event.cause,
          data: event.data,
        },
      ];
      if ("instanceId" in event.data.target) {
        if (targetRecord && targetLife !== undefined && targetLife <= event.data.amount) {
          followUpEvents.push({
            ...event,
            name: "destroy",
            affected: [event.data.target],
            data: {
              object: event.data.target,
              destinationRef: nextFabDestinationRef(state, event.data.target),
              from: event.data.target.zone,
              to: "graveyard",
              reason: "destroy",
            },
          });
        }
      }
      return { state, followUpEvents };
    }
    case "dealt-damage": {
      if (event.data.amount <= 0) return null;
      const sourceIsAlly = event.data.source?.current.typeBox.subtypes.includes("Ally") ?? false;
      // Dealer (controller of the damage source / deal-damage event).
      const dealer = event.controllerId ? state.players[event.controllerId] : undefined;
      if (dealer) {
        // CR 8.2.8e: an Ally is the damage dealer. Its controller and hero are
        // not considered to have dealt that damage, while the chain-link total
        // still records the damage needed by hit and combat resolution.
        if (!sourceIsAlly) {
          dealer.history.turn.dealtDamage = true;
          dealer.history.turn.damageDealtByType[event.data.damageType] += event.data.amount;
        }
        dealer.history.chainLink.damageDealtByType[event.data.damageType] += event.data.amount;
        // Per-source damage (Surge CR 8.4.8 "If this deals N damage"). Keyed by
        // the dealing object's instanceId on both scopes; recorded regardless of
        // the ally-dealer exclusion because the source object itself dealt it.
        const sourceInstanceId = event.data.source?.instanceId;
        if (sourceInstanceId) {
          dealer.history.turn.damageDealtBySource[sourceInstanceId] =
            (dealer.history.turn.damageDealtBySource[sourceInstanceId] ?? 0) + event.data.amount;
          dealer.history.chainLink.damageDealtBySource[sourceInstanceId] =
            (dealer.history.chainLink.damageDealtBySource[sourceInstanceId] ?? 0) +
            event.data.amount;
          // Hero-targeted share (Surge "...to a hero" CR 8.4.8 — Pop the
          // Bubble, Sap). Only damage dealt to a hero counts toward these.
          if ("kind" in event.data.target && event.data.target.kind === "hero") {
            dealer.history.turn.damageDealtBySourceToHero[sourceInstanceId] =
              (dealer.history.turn.damageDealtBySourceToHero[sourceInstanceId] ?? 0) +
              event.data.amount;
            dealer.history.chainLink.damageDealtBySourceToHero[sourceInstanceId] =
              (dealer.history.chainLink.damageDealtBySourceToHero[sourceInstanceId] ?? 0) +
              event.data.amount;
          }
        }
      }
      const targetIsAlly =
        "instanceId" in event.data.target &&
        event.data.target.current.typeBox.subtypes.includes("Ally");
      // Victim hero (or controller of a damaged non-Ally permanent) for
      // "been dealt damage". CR 8.2.8f excludes an Ally's controller and hero.
      const victimId =
        "kind" in event.data.target && event.data.target.kind === "hero"
          ? event.data.target.playerId
          : !targetIsAlly && "controllerId" in event.data.target
            ? event.data.target.controllerId
            : undefined;
      if (victimId) {
        const victim = state.players[victimId];
        if (victim) {
          victim.history.turn.beenDealtDamage = true;
          victim.history.turn.damageTakenByType[event.data.damageType] += event.data.amount;
          const damageSourceId = event.data.source?.instanceId;
          if (damageSourceId) {
            victim.history.turn.damageTakenBySource[damageSourceId] =
              (victim.history.turn.damageTakenBySource[damageSourceId] ?? 0) + event.data.amount;
          }
          // CR 8.2.8e hero attribution: a non-ally source's damage counts as
          // the dealer hero's own (HNT016 "hero ... that has dealt damage").
          if (dealer && !sourceIsAlly) {
            const dealerHeroId = state.containers.zonesByPlayerId[dealer.playerId]?.heroZone[0];
            if (dealerHeroId && dealerHeroId !== damageSourceId) {
              victim.history.turn.damageTakenBySource[dealerHeroId] =
                (victim.history.turn.damageTakenBySource[dealerHeroId] ?? 0) + event.data.amount;
            }
          }
        }
      }
      return { state };
    }
    case "prevent": {
      if (event.data.preventedAmount <= 0) return null;
      // Static continuous preventions with times:1 (Soulbond Resolve "first
      // time each turn") are re-collected every damage event. Stamp the
      // replacementId on the controller's turn history so subsequent damage
      // this turn does not re-offer the same prevention.
      if (
        event.cause.kind === "effect" &&
        event.controllerId &&
        typeof event.cause.abilityId === "string"
      ) {
        const replacementId = event.cause.abilityId;
        const colon = replacementId.indexOf(":");
        if (colon > 0) {
          const instanceId = replacementId.slice(0, colon);
          const abilityId = replacementId.slice(colon + 1);
          const record = state.objects[instanceId];
          const ability = record
            ? state.cardDefinitions[record.canonicalId]?.base.abilities.find(
                (a) => a.id === abilityId,
              )
            : undefined;
          if (
            ability?.kind === "static" &&
            ability.effect?.type === "prevention" &&
            ability.effect.times === 1
          ) {
            const player = state.players[event.controllerId];
            if (
              player &&
              !player.history.turn.consumedStaticReplacementIds.includes(replacementId)
            ) {
              player.history.turn.consumedStaticReplacementIds = [
                ...player.history.turn.consumedStaticReplacementIds,
                replacementId,
              ];
            }
          }
        }
      }
      return { state };
    }
    case "retarget-attack": {
      const combat = state.combat;
      const link = combat?.activeLink;
      if (!combat || !link) return { state };
      if (link.activeAttack.sourceObjectId !== event.data.attackInstanceId) return { state };
      const attackTargetRef = targetRefForAttack(state, event.data.target);
      if (!attackTargetRef) return null;
      if (
        !validAttackTarget(
          state,
          link.attackingPlayerId,
          event.data.target,
          event.data.defendingPlayerId,
        )
      ) {
        return null;
      }
      combat.activeLink = {
        ...link,
        attackTargetRef,
        defendingPlayerId: fabPlayerId(event.data.defendingPlayerId),
        defendingInstanceIdsByTarget: { [fabAttackTargetKey(attackTargetRef)]: [] },
        defendingOrigins: {},
        damage: {
          status: "pending",
          outcomes: [{ target: attackTargetRef, damageDealtByActiveAttack: 0 }],
        },
      };
      return { state };
    }
    default:
      return assertNeverCombat(event);
  }
}

// --- Combat domain helpers ---

/** Printed name for an attacking object (for last-attack-this-turn identity). */
function attackObjectPrintedNames(state: FabMatchState, instanceId: string): readonly string[] {
  const record = state.objects[instanceId];
  if (!record) return [];
  const object = buildFabRulesView(state).object({
    instanceId: record.instanceId,
    incarnation: record.incarnation,
  });
  return object?.current.names ?? [];
}

function normalizePrintedName(value: string | null | undefined): string {
  return (value ?? "").toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
}

/** Crouching Tiger attack identity (Blood Scent activate gate). */
function isCrouchingTigerAttackObject(state: FabMatchState, instanceId: string): boolean {
  const record = state.objects[instanceId];
  if (!record) return false;
  const def = state.cardDefinitions[record.canonicalId];
  if (!def) return false;
  if (def.slug === "crouching-tiger") return true;
  return normalizePrintedName(def.base.names[0]) === "crouchingtiger";
}

/** Weapon type-box membership (catalog puts Weapon in types after normalize). */
function isWeaponAttackObject(object: {
  readonly current: {
    readonly typeBox: {
      readonly types: readonly string[];
      readonly subtypes: readonly string[];
    };
  };
}): boolean {
  return (
    object.current.typeBox.types.includes("Weapon") ||
    object.current.typeBox.subtypes.includes("Weapon")
  );
}

function isSwordHitSource(
  state: FabMatchState,
  object: {
    readonly instanceId: string;
    readonly current: { readonly typeBox: { readonly subtypes: readonly string[] } };
  },
): boolean {
  if (object.current.typeBox.subtypes.includes("Sword")) return true;
  const record = state.objects[object.instanceId];
  const definition = record ? state.cardDefinitions[record.canonicalId] : undefined;
  return definition?.base.typeBox.subtypes.includes("Sword") ?? false;
}

function isDaggerHitSource(
  state: FabMatchState,
  object: {
    readonly instanceId: string;
    readonly current: { readonly typeBox: { readonly subtypes: readonly string[] } };
  },
): boolean {
  if (object.current.typeBox.subtypes.includes("Dagger")) return true;
  const record = state.objects[object.instanceId];
  const definition = record ? state.cardDefinitions[record.canonicalId] : undefined;
  return definition?.base.typeBox.subtypes.includes("Dagger") ?? false;
}

function moveAttackingAllySourceOntoChain(
  state: FabMatchState,
  object: ProposedEvent<"attack">["data"]["object"],
): void {
  if (!object.current.typeBox.subtypes.includes("Ally")) return;
  const controllerId = object.controllerId ?? object.ownerId;
  const seats = state.containers.zonesByPlayerId[controllerId];
  if (!seats) return;
  const from = (["arena", "combatChain"] as const).find((zone) =>
    seats[zone].includes(object.instanceId),
  );
  if (from !== "arena") return;
  moveKnownObject(state, object, "arena", "combatChain", null);
}

function isAttackCardObject(object: {
  readonly current: {
    readonly typeBox: { readonly types: readonly string[]; readonly subtypes: readonly string[] };
  };
}): boolean {
  return (
    object.current.typeBox.types.includes("Action") &&
    object.current.typeBox.subtypes.includes("Attack")
  );
}

function targetRefForAttack(
  state: FabMatchState,
  target: import("../../state.ts").FabAttackTarget,
): import("../../state.ts").FabAttackTargetRef | null {
  if (target.kind !== "hero") {
    return {
      kind: "object",
      ref: target.ref,
      controllerIdAtDeclaration: fabPlayerId(target.controllerId),
    };
  }
  return { kind: "hero", playerId: fabPlayerId(target.playerId) };
}

function targetRefForDamageEvent(
  state: FabMatchState,
  target: ProposedEvent<"dealt-damage" | "hit">["data"]["target"],
): import("../../state.ts").FabAttackTargetRef | null {
  if ("instanceId" in target) {
    const heroPlayerId = state.playerIds.find((playerId) =>
      state.containers.zonesByPlayerId[playerId]?.heroZone.includes(target.instanceId),
    );
    if (heroPlayerId) return { kind: "hero", playerId: fabPlayerId(heroPlayerId) };
    return {
      kind: "object",
      ref: target.ref,
      controllerIdAtDeclaration: fabPlayerId(target.controllerId ?? target.ownerId),
    };
  }
  return { kind: "hero", playerId: fabPlayerId(target.playerId) };
}

function targetObjectId(
  state: FabMatchState,
  target: import("../../state.ts").FabAttackTargetRef,
): import("../../game/identity.ts").FabObjectInstanceId | null {
  if (target.kind === "object")
    return target.ref.instanceId as import("../../game/identity.ts").FabObjectInstanceId;
  return state.containers.zonesByPlayerId[target.playerId]?.heroZone[0]
    ? fabObjectInstanceId(state.containers.zonesByPlayerId[target.playerId]!.heroZone[0]!)
    : null;
}

function defendSnapshotZone(
  from: ProposedEvent<"defend">["data"]["from"],
): ProposedEvent<"defend">["data"]["object"]["zone"] {
  switch (from) {
    case "hand":
    case "arsenal":
    case "stack":
    case "deck":
    case "banished":
      return from;
    case "head":
      return "equipment-head";
    case "chest":
      return "equipment-chest";
    case "arms":
      return "equipment-arms";
    case "legs":
      return "equipment-legs";
    case "weapon1":
    case "weapon2":
      return "weapon";
  }
}

function reduceDamage(
  state: FabMatchState,
  data: {
    readonly target:
      | { readonly kind: "hero"; readonly playerId: string }
      | { readonly instanceId: string };
    readonly amount: number;
  },
): boolean {
  if (data.amount <= 0) return false;
  if ("playerId" in data.target) {
    const player = state.players[data.target.playerId];
    if (!player) return false;
    player.life = Math.max(0, player.life - data.amount);
    if (player.life === 0 && !state.gameEnded) {
      endGameForLoser(state, data.target.playerId, "life");
    }
    return true;
  }
  const object = state.objects[data.target.instanceId];
  if (!object) return false;
  const currentLife = buildFabRulesView(state).object({
    instanceId: object.instanceId,
    incarnation: object.incarnation,
  })?.current.numeric.life;
  if (currentLife === undefined) return false;
  state.objects[data.target.instanceId] = {
    ...object,
    counters: [...object.counters, { kind: "damage", count: Math.min(data.amount, currentLife) }],
  };
  return true;
}

function assertNeverCombat(event: never): never {
  throw new Error(`Unhandled FAB combat event: ${JSON.stringify(event)}`);
}
