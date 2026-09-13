import type { FabMatchState } from "../../state.ts";
import type { FabObjectSnapshot } from "../../rules/events.ts";
import type { ProposedEvent } from "../../rules/events.ts";
import { executeFabEventTransaction } from "../../kernel/transaction/index.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import {
  heroPlayerForAttackTarget,
  snapshotDeclaredAttackTarget,
} from "../../rules/combat-target.ts";
import { fabAllDefenders, fabCombatDamageResolved } from "../../game/combat.ts";
import { exactAttackBinding } from "../../rules/exact-attack.ts";

export type FabCombatDamageResult =
  | { readonly accepted: true; readonly state: FabMatchState }
  | {
      readonly accepted: false;
      readonly state: FabMatchState;
      readonly error: string;
      readonly errorCode: string;
    };

/** Resolves one combat damage step through canonical events. */
export function resolveFabCombatDamage(
  current: FabMatchState,
  options: FabEventTransactionOptions,
): FabCombatDamageResult {
  const link = current.combat?.activeLink;
  if (!link)
    return {
      accepted: false,
      state: current,
      error: "There is no active combat link.",
      errorCode: "no_combat",
    };
  if (fabCombatDamageResolved(link)) {
    return {
      accepted: false,
      state: current,
      error: "Combat damage is already resolved.",
      errorCode: "damage_already_resolved",
    };
  }
  const attack = snapshotObject(
    current,
    link.activeAttack.sourceObjectId,
    link.attackingPlayerId,
    "combatChain",
  );
  const attackBinding = exactAttackBinding(link.activeAttack, attack);
  const view = buildFabRulesView(current);
  const combat = view.combat();
  if (!combat)
    return {
      accepted: false,
      state: current,
      error: "The active combat link is not evaluable.",
      errorCode: "combat_not_evaluable",
    };
  const damage = Math.max(0, combat.attackPower - combat.defense);
  const defendedBy = [...fabAllDefenders(link)];
  const defenders = defendedBy.map((instanceId) => {
    const object = snapshotObject(current, instanceId, link.defendingPlayerId, "combatChain");
    return {
      object,
      defense: Math.max(0, view.object(object.ref)?.current.numeric.defense ?? 0),
    };
  });
  const declaredTarget = attackTargetForDamage(current, link);
  // A non-hero target that ceased to exist after declaration is not redirected
  // to its controller. This covers Spectra/Usurp and any other attacked object
  // through the declared object reference (CR 1.4.5, 7.2.2c).
  if (declaredTarget === null) {
    const result = executeFabEventTransaction(
      current,
      (processId) => {
        const base = {
          processId,
          cause: {
            kind: "rule" as const,
            rule: "combat-damage",
            controllerId: link.attackingPlayerId,
          },
          controllerId: link.attackingPlayerId,
          source: attack,
          bindings: { attack: attackBinding },
        };
        const events: ProposedEvent[] = [
          {
            ...base,
            name: "resolve-combat-damage",
            affected: [attack],
            data: {
              attack,
              target: link.attackTargetRef,
              attackingPlayerId: link.attackingPlayerId,
              defendingPlayerId: link.defendingPlayerId,
              attackPower: Math.max(0, combat.attackPower),
              totalDefense: Math.max(0, combat.defense),
              damage: 0,
              outcomes: [
                {
                  target: link.attackTargetRef,
                  damage: 0,
                  totalDefense: Math.max(0, combat.defense),
                },
              ],
              defendedBy,
              defenders,
            },
          },
        ];
        return events;
      },
      options,
    );
    return { accepted: true, state: result.state };
  }
  const target = declaredTarget;
  for (const wager of link.wagers) {
    if (wager.prize?.kind === "create-token") {
      for (const canonicalId of wager.prize.canonicalIds) {
        if (!current.cardDefinitions[canonicalId]) {
          return {
            accepted: false,
            state: current,
            error: `Wager prize ${canonicalId} is absent from the immutable match program.`,
            errorCode: "match_program_missing_definition",
          };
        }
      }
    }
  }
  const result = executeFabEventTransaction(
    current,
    (processId) => {
      const base = {
        processId,
        cause: {
          kind: "rule" as const,
          rule: "combat-damage",
          controllerId: link.attackingPlayerId,
        },
        controllerId: link.attackingPlayerId,
        source: attack,
        bindings: { attack: attackBinding },
      };
      const events: ProposedEvent[] = [];
      const targetWasMarked =
        "kind" in target &&
        target.kind === "hero" &&
        current.players[target.playerId]?.marked === true;
      if (damage > 0) {
        events.push({
          ...base,
          name: "deal-damage",
          affected: "instanceId" in target ? [target] : [],
          data: { source: attack, target, amount: damage, damageType: "physical" },
        });
      }
      // Additional heroes (Bolfar multi-target): full attack power, no shared
      // primary defense. Each is a concurrent attack-target for damage/hit.
      const attackPower = Math.max(0, combat.attackPower);
      const additionalOutcomes: Array<{
        target: (typeof link)["attackTargetRef"];
        damage: number;
        totalDefense: number;
      }> = [];
      for (const additional of link.additionalAttackTargetRefs ?? []) {
        const additionalPlayerId = heroPlayerForAttackTarget(current, additional);
        if (!additionalPlayerId) continue;
        if (attackPower <= 0) continue;
        const additionalTarget = {
          kind: "hero" as const,
          playerId: additionalPlayerId,
        };
        events.push({
          ...base,
          name: "deal-damage",
          affected: [],
          data: {
            source: attack,
            target: additionalTarget,
            amount: attackPower,
            damageType: "physical",
          },
        });
        additionalOutcomes.push({ target: additional, damage: attackPower, totalDefense: 0 });
      }
      events.push({
        ...base,
        name: "resolve-combat-damage",
        affected: [attack],
        data: {
          attack,
          target: link.attackTargetRef,
          attackingPlayerId: link.attackingPlayerId,
          defendingPlayerId: link.defendingPlayerId,
          attackPower,
          totalDefense: Math.max(0, combat.defense),
          damage,
          outcomes: [
            {
              target: link.attackTargetRef,
              damage,
              totalDefense: Math.max(0, combat.defense),
            },
            ...additionalOutcomes,
          ],
          defendedBy,
          defenders,
        },
      });
      if (damage > 0) {
        events.push({
          ...base,
          name: "hit",
          affected: [attack],
          data: {
            actorId: link.attackingPlayerId,
            object: attack,
            target,
            damage,
            attackingPlayerId: link.attackingPlayerId,
            defendingPlayerId: link.defendingPlayerId,
            ...(targetWasMarked ? { targetWasMarked } : {}),
          },
        });
      }
      // CR 8.5.46: determine every wager's provisional winner as the chain
      // link resolves. Publish the loser's outcome before winner/prize effects
      // so CR 6.5 outcome replacements can replace it atomically.
      for (const wager of link.wagers) {
        const winnerId = damage > 0 ? link.attackingPlayerId : link.defendingPlayerId;
        const loserId =
          winnerId === link.attackingPlayerId ? link.defendingPlayerId : link.attackingPlayerId;
        events.push({
          ...base,
          name: "wager-loss",
          controllerId: loserId,
          affected: [attack],
          bindings: {
            attack: attackBinding,
            wagerId: wager.wagerId,
            winner: winnerId,
            loser: loserId,
          },
          data: {
            wagerId: wager.wagerId,
            attack,
            attackingPlayerId: wager.attackingPlayerId,
            defendingPlayerId: wager.defendingPlayerId,
            winnerId,
            loserId,
            prize: wager.prize,
          },
        });
      }
      // Hit events for additional heroes that took damage.
      if (attackPower > 0) {
        for (const additional of link.additionalAttackTargetRefs ?? []) {
          const additionalPlayerId = heroPlayerForAttackTarget(current, additional);
          if (!additionalPlayerId) continue;
          events.push({
            ...base,
            name: "hit",
            affected: [attack],
            data: {
              actorId: link.attackingPlayerId,
              object: attack,
              target: { kind: "hero", playerId: additionalPlayerId },
              damage: attackPower,
              attackingPlayerId: link.attackingPlayerId,
              defendingPlayerId: additionalPlayerId,
              ...(current.players[additionalPlayerId]?.marked === true
                ? { targetWasMarked: true }
                : {}),
            },
          });
        }
      }
      return events;
    },
    options,
  );
  return { accepted: true, state: result.state };
}

function attackTargetForDamage(
  state: FabMatchState,
  link: NonNullable<FabMatchState["combat"]>["activeLink"] & {},
): FabObjectSnapshot | { readonly kind: "hero"; readonly playerId: string } | null {
  const declared = snapshotDeclaredAttackTarget(state, link.attackTargetRef);
  return declared;
}
