/**
 * Fluent Act surface for GundamPlayerActions.
 *
 *   p1.must.deployUnit(card).assignPilot(pilot, unit);
 *   p1.must.attack(unit).into("direct");
 *   const ref = p1.must.deployUnit(card); // CardInstanceRef when unique post-deploy
 */

import type { Card } from "@tcg/gundam-types";
import type { CommandResult } from "../../types/command.ts";
import { expectSuccess } from "./matchers.ts";
import {
  type CardRefFilter,
  type CardInstanceRef,
  type CardRef,
  isCardDefinition,
  isCardInstanceRef,
  listCardRefs,
  makeInstanceRef,
  otherPlayer,
  resolveCardRef,
  resolveCardRefOnEitherPlayer,
} from "./card-ref.ts";
import type { GundamPlayerActions } from "./test-engine.ts";

export type { CardRefFilter };

/** Attack/enter-battle target: card ref, instance id, or the `"direct"` sentinel. */
export type FluentBattleTarget = CardRef | "direct";

export interface FluentAttackBuilder {
  into(target: FluentBattleTarget): GundamPlayerActions;
}

export interface FluentMust {
  deployUnit(
    card: CardRef,
    opts?: { mode?: "normal" | "alternate"; targets?: string[]; paymentResourceIds?: string[] },
  ): CardInstanceRef & { and: FluentMust };
  deployBase(
    card: CardRef,
    opts?: { targets?: string[]; paymentResourceIds?: string[] },
  ): CardInstanceRef & { and: FluentMust };
  playCommand(
    card: CardRef,
    opts?: { mode?: "normal" | "alternate"; targets?: CardRef[]; paymentResourceIds?: string[] },
  ): FluentMust;
  assignPilot(pilot: CardRef, unit: CardRef, opts?: { paymentResourceIds?: string[] }): FluentMust;
  playCommandAsPilot(
    card: CardRef,
    unit: CardRef,
    opts?: { paymentResourceIds?: string[] },
  ): FluentMust;
  attack(attacker: CardRef): FluentAttackBuilder;
  enterBattle(attacker: CardRef, target: FluentBattleTarget): FluentMust;
  declareBlock(blocker: CardRef): FluentMust;
  useSupport(unit: CardRef, target: CardRef): FluentMust;
  activateAbility(
    card: CardRef,
    effectIndex: number,
    opts?: { targets?: CardRef[]; paymentResourceIds?: string[] },
  ): FluentMust;
  resolveTargets(...targets: CardRef[]): FluentMust;
  resolveEffect(opts?: {
    targets?: CardRef[];
    pendingEffectId?: string;
    optionalAnswers?: Record<number, boolean>;
    chooseOneAnswers?: Record<number, number>;
  }): FluentMust;
  acceptOptional(directiveIndex?: number): FluentMust;
  declineOptional(directiveIndex?: number): FluentMust;
  passBlock(): FluentMust;
  passBattleAction(): FluentMust;
  passPhase(): FluentMust;
  passActionStep(): FluentMust;
  /** End-phase hand-step: discard to hand limit (4-8-4 / 7-6-5-1). */
  discardToHandLimit(...cards: CardRef[]): FluentMust;
  concede(): FluentMust;
}

function asAnd(must: FluentMust, ref: CardInstanceRef): CardInstanceRef & { and: FluentMust } {
  return Object.assign(ref, { and: must });
}

function throwOnFail(result: CommandResult, label: string): void {
  expectSuccess(result, label);
}

export function createFluentMust(player: GundamPlayerActions): FluentMust {
  const runtime = player.runtime;
  const playerId = player.playerId;

  const resolve = (ref: CardRef, filter?: CardRefFilter) =>
    resolveCardRef(runtime, playerId, ref, filter ?? {});

  const resolveTarget = (ref: FluentBattleTarget): string => {
    if (ref === "direct") return "direct";
    // Target may be on either player (enemy unit). Fall back to the opponent
    // only on CardRefNotFoundError — never swallow AmbiguousCardRefError.
    return resolveCardRefOnEitherPlayer(runtime, playerId, otherPlayer(playerId), ref).instanceId;
  };

  const must: FluentMust = {
    deployUnit(card, opts = {}) {
      const id =
        typeof card === "string" || isCardInstanceRef(card)
          ? isCardInstanceRef(card)
            ? card.instanceId
            : card
          : resolveCardRef(runtime, playerId, card, { zone: "hand" }).instanceId;
      const handBefore = new Set(player.getHand());
      throwOnFail(player.deployUnit(id, opts), "deployUnit");
      // Prefer the instance that left hand / newest in battleArea
      const battle = player.getCardsInZone("battleArea");
      let deployed = battle.find((zid) => !handBefore.has(zid) && zid === id) ?? battle.at(-1);
      if (!deployed && isCardDefinition(card)) {
        const refs = listCardRefs(runtime, playerId, card.cardNumber, { zone: "battleArea" });
        deployed = refs.at(-1)?.instanceId;
      }
      if (!deployed) {
        throw new Error("deployUnit succeeded but no unit found in battleArea");
      }
      return asAnd(must, makeInstanceRef(runtime, playerId, deployed));
    },

    deployBase(card, opts = {}) {
      const id = resolve(card, { zone: "hand" }).instanceId;
      throwOnFail(player.deployBase(id, opts), "deployBase");
      const zone = player.getCardsInZone("baseSection");
      const deployed = zone.at(-1);
      if (!deployed) throw new Error("deployBase succeeded but baseSection empty");
      return asAnd(must, makeInstanceRef(runtime, playerId, deployed));
    },

    playCommand(card, opts = {}) {
      const id = resolve(card, { zone: "hand" }).instanceId;
      const targets = opts.targets?.map((t) => resolveTarget(t));
      throwOnFail(player.playCommand(id, { ...opts, targets }), "playCommand");
      return must;
    },

    assignPilot(pilot, unit, opts = {}) {
      throwOnFail(
        player.assignPilot(resolve(pilot).instanceId, resolve(unit).instanceId, opts),
        "assignPilot",
      );
      return must;
    },

    playCommandAsPilot(card, unit, opts = {}) {
      throwOnFail(
        player.playCommandAsPilot(
          resolve(card, { zone: "hand" }).instanceId,
          resolve(unit).instanceId,
          opts,
        ),
        "playCommandAsPilot",
      );
      return must;
    },

    attack(attacker) {
      const attackerId = resolve(attacker).instanceId;
      return {
        into(target: FluentBattleTarget) {
          const targetId = target === "direct" ? "direct" : resolveTarget(target);
          throwOnFail(player.enterBattle(attackerId, targetId), "enterBattle");
          return player;
        },
      };
    },

    enterBattle(attacker, target) {
      const attackerId = resolve(attacker).instanceId;
      const targetId = target === "direct" ? "direct" : resolveTarget(target);
      throwOnFail(player.enterBattle(attackerId, targetId), "enterBattle");
      return must;
    },

    declareBlock(blocker) {
      throwOnFail(player.declareBlock(resolve(blocker).instanceId), "declareBlock");
      return must;
    },

    useSupport(unit, target) {
      throwOnFail(player.useSupport(resolve(unit).instanceId, resolveTarget(target)), "useSupport");
      return must;
    },

    activateAbility(card, effectIndex, opts = {}) {
      const targets = opts.targets?.map((t) => resolveTarget(t));
      throwOnFail(
        player.activateAbility(resolve(card).instanceId, effectIndex, {
          targets,
          paymentResourceIds: opts.paymentResourceIds,
        }),
        "activateAbility",
      );
      return must;
    },

    resolveTargets(...targets) {
      const ids = targets.map((t) => resolveTarget(t));
      throwOnFail(player.resolveEffect({ targets: ids }), "resolveTargets");
      return must;
    },

    resolveEffect(opts = {}) {
      const targets = opts.targets?.map((t) => resolveTarget(t));
      throwOnFail(
        player.resolveEffect({
          ...opts,
          targets,
        }),
        "resolveEffect",
      );
      return must;
    },

    acceptOptional(directiveIndex = -1) {
      throwOnFail(
        player.resolveEffect({ optionalAnswers: { [directiveIndex]: true } }),
        "acceptOptional",
      );
      return must;
    },

    declineOptional(directiveIndex = -1) {
      throwOnFail(
        player.resolveEffect({ optionalAnswers: { [directiveIndex]: false } }),
        "declineOptional",
      );
      return must;
    },

    passBlock() {
      throwOnFail(player.passBlock(), "passBlock");
      return must;
    },

    passBattleAction() {
      throwOnFail(player.passBattleAction(), "passBattleAction");
      return must;
    },

    passPhase() {
      throwOnFail(player.passPhase(), "passPhase");
      return must;
    },

    passActionStep() {
      throwOnFail(player.passActionStep(), "passActionStep");
      return must;
    },

    discardToHandLimit(...cards) {
      const ids = cards.map((c) => resolve(c, { zone: "hand" }).instanceId);
      throwOnFail(player.discardToHandLimit(ids), "discardToHandLimit");
      return must;
    },

    concede() {
      throwOnFail(player.concede(), "concede");
      return must;
    },
  };

  return must;
}

/** Query helpers attached to the player for definition→instance resolution. */
export function attachFluentQueries(_player: GundamPlayerActions): void {
  // methods added via Object.defineProperties on the prototype in test-engine
}

export function playerUnit(
  player: GundamPlayerActions,
  card: Card | string,
  filter: CardRefFilter = {},
): CardInstanceRef {
  return resolveCardRef(player.runtime, player.playerId, typeof card === "string" ? card : card, {
    zone: "battleArea",
    ...filter,
  });
}

export function playerCardIn(
  player: GundamPlayerActions,
  zone: string,
  card: Card | string,
  filter: CardRefFilter = {},
): CardInstanceRef {
  return resolveCardRef(player.runtime, player.playerId, typeof card === "string" ? card : card, {
    zone,
    ...filter,
  });
}

export function playerRef(
  player: GundamPlayerActions,
  card: CardRef,
  filter: CardRefFilter = {},
): CardInstanceRef {
  return resolveCardRef(player.runtime, player.playerId, card, filter);
}

export function playerUnits(
  player: GundamPlayerActions,
  card: Card | string,
  filter: CardRefFilter = {},
): CardInstanceRef[] {
  return listCardRefs(player.runtime, player.playerId, typeof card === "string" ? card : card, {
    zone: "battleArea",
    ...filter,
  });
}

/** Resolve card for expect().via(player) style helpers. */
export function resolveViaPlayer(
  player: GundamPlayerActions,
  card: CardRef,
  filter?: CardRefFilter,
): CardInstanceRef {
  return resolveCardRef(player.runtime, player.playerId, card, filter ?? {});
}

export {
  resolveCardRef,
  resolveCardRefOnEitherPlayer,
  listCardRefs,
  makeInstanceRef,
  otherPlayer,
  isCardInstanceRef,
  isCardDefinition,
  cardRefId,
} from "./card-ref.ts";
export type { CardInstanceRef, CardRef } from "./card-ref.ts";
