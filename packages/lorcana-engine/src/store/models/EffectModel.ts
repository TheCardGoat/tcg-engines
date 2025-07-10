import { notEmptyPredicate } from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import {
  cardEffectTargetPredicate,
  type EffectTargets,
  type PlayerEffectTarget,
  playerEffectTargetPredicate,
} from "@lorcanito/lorcana-engine/effects/effectTargets";
import {
  costEffectPredicate,
  costReplacementEffectPredicate,
  costReplacementShiftEffectPredicate,
  discardEffectPredicate,
  type Effect,
  isDynamicAmount,
  loreEffectPredicate,
  moveCostEffectPredicate,
  scryEffectPredicate,
  singCostEffectPredicate,
  strengthEffectPredicate,
  targetConditionalEffectPredicate,
  willPowerEffectPredicate,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import {
  calculateDynamicAmount,
  resolveAmount,
} from "@lorcanito/lorcana-engine/store/resolvers/dynamicAmount";
import { resolveEffect } from "@lorcanito/lorcana-engine/store/resolvers/effectResolver";
import { isSelfReferencingFilter } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
import type { TargetFilter } from "@lorcanito/lorcana-engine/store/resolvers/filters";
import {
  canCardBeTargeted,
  doesItRequireTarget,
  resolveCardTargets,
  resolvePlayerTargets,
} from "@lorcanito/lorcana-engine/store/resolvers/targetsResolver";
import type { ResolvingParam } from "@lorcanito/lorcana-engine/types/types";
import { makeAutoObservable } from "mobx";

export type EffectOutput = {
  source: string;
  responder: "self" | "opponent" | string;
  effects: Effect;
};

// TODO: This should receive Ability model
export class EffectModel {
  effect: Effect;
  source: CardModel;
  responder: "self" | "opponent" | string;
  private readonly rootStore: MobXRootStore;
  private readonly observable: boolean;

  constructor(
    effects: Effect,
    source: CardModel,
    responder: "self" | "opponent" | string,
    rootStore: MobXRootStore,
    observable: boolean,
  ) {
    if (observable) {
      makeAutoObservable<EffectModel, "rootStore" | "observable">(this, {
        rootStore: false,
        observable: false,
      });
    }

    this.effect = JSON.parse(JSON.stringify(effects));
    this.source = source;
    this.responder = responder;
    this.rootStore = rootStore;
    this.observable = observable;

    this?.replaceDynamicTargetFilters();
  }

  sync(effect: EffectOutput) {
    this.effect = effect.effects;
    this.responder = effect.responder;
    this.source = this.rootStore.cardStore.getCard(effect.source) as CardModel; // TODO: CardNotFound issue;
  }

  toJSON(): EffectOutput {
    return {
      source: this.source.instanceId,
      effects: this.effect,
      responder: this.responder,
    };
  }

  isScryEffect() {
    return scryEffectPredicate(this.effect);
  }

  get type() {
    return this.effect.type;
  }

  requiresTarget() {
    return doesItRequireTarget(this);
  }

  requiresPlayerTarget() {
    return (
      this.effect.target?.type === "player" &&
      this.effect.target.value === "target"
    );
  }

  get potentialTargets() {
    let filters: TargetFilter[] = [];
    let excludeSelf = false;

    if (this.target && "filters" in this.target) {
      filters = this.target.filters;
    }

    if (this.target && "excludeSelf" in this.target) {
      excludeSelf = this.target.excludeSelf ?? false;
    }

    return this.rootStore.cardStore.getCardsByTargetFilter(
      filters,
      this.responder,
      this.source,
      excludeSelf,
    );
  }

  get isModal() {
    return this.effect.type === "modal";
  }

  get getSpecificCardFilter() {
    if (this.effect.target?.type === "player") {
      return undefined;
    }

    const find = this.effect.target.filters?.find(
      (filter) => filter.filter === "instanceId",
    );

    if (find && !Array.isArray(find.value)) {
      return this.rootStore.cardStore.getCard(find.value);
    }

    if (find && Array.isArray(find.value)) {
      return find.value
        .map((card) => this.rootStore.cardStore.getCard(card))
        .filter(notEmptyPredicate);
    }

    if (find && !find.value) {
      console.error("No value found for filter", find);
    }

    return undefined;
  }

  hasRandomTarget() {
    if (this.effect.target?.type === "player") {
      return false;
    }

    return this.effect.target?.random;
  }

  calculateAmount(targets: CardModel[] = []): number {
    return resolveAmount(this, this.rootStore, targets);
  }

  replaceDynamicTargets({ targetPlayer }: { targetPlayer?: string } = {}) {
    if (targetPlayer && this.requiresPlayerTarget()) {
      if (playerEffectTargetPredicate(this.effect.target)) {
        const replacement: PlayerEffectTarget = {
          ...this.effect.target,
          value: "player_id",
          id: targetPlayer,
        };
        this.effect.target = replacement;
      }
    }
  }

  // TODO: this should also work for conditional effects
  replaceDynamicTargetFilters({ nameACard }: { nameACard?: string } = {}) {
    if (
      playerEffectTargetPredicate(this.effect.target) ||
      !this.effect.target
    ) {
      return;
    }

    if (
      cardEffectTargetPredicate(this.effect.target) &&
      !("filters" in this.effect.target)
    ) {
      return;
    }

    if (this.effect.target.filters && this.effect.target.filters.length > 0) {
      // I was having mutation issues here
      const filtersClone: TargetFilter[] = JSON.parse(
        JSON.stringify(this.effect.target.filters),
      );

      this.effect.target = {
        ...this.effect.target,
        filters: filtersClone.map((filter) => {
          if (nameACard && filter.filter === "name-a-card") {
            console.log({ operator: "eq", value: nameACard });
            return {
              filter: "name-a-card",
              value: "name",
              comparison: { operator: "eq", value: nameACard },
            };
          }

          if (filter.filter === "source" && filter.value === "self") {
            return {
              filter: "instanceId",
              value: this.source.instanceId,
            };
          }

          return filter;
        }),
      };
    } else {
      // TODO: self target is throwing error here
    }
  }

  changeTarget(target: CardModel) {
    if (
      playerEffectTargetPredicate(this.effect.target) ||
      !this.effect.target ||
      (cardEffectTargetPredicate(this.effect.target) &&
        !("filters" in this.effect.target))
    ) {
      return;
    }

    if (this.effect.target.filters && this.effect.target.filters.length > 0) {
      this.effect.target = {
        ...this.effect.target,
        filters: this.effect.target.filters.map((filter) => {
          if (
            filter.filter === "instanceId" ||
            (filter.filter === "source" && filter.value === "self")
          ) {
            return {
              filter: "instanceId",
              value: target.instanceId,
            };
          }

          return filter;
        }),
      };
    } else {
      // TODO: self target is throwing error here
    }
  }

  get targets() {
    return this.target;
  }

  get target() {
    const effect = this.effect;
    const conditionalEffect = targetConditionalEffectPredicate(effect);

    if (conditionalEffect) {
      return effect.fallback?.map((effect) => effect.target)[0];
    }

    return this.effect.target;
  }

  // See engine/store/resolver/README.md
  get hasSelfReferencingTarget() {
    const target = this.target;

    if (target && "filters" in target) {
      return target.filters.some(isSelfReferencingFilter);
    }

    return false;
  }

  get conditions(): Condition[] {
    return this.effect.conditions || [];
  }

  get areConditionsMet() {
    if (this.conditions.length === 0) {
      return true;
    }

    return this.rootStore.effectStore.metCondition(
      this.source,
      this.conditions,
    );
  }

  canTargetCard(
    cardTarget: CardModel,
    responder: string,
    skipNotification?: boolean,
    params?: ResolvingParam,
  ) {
    return canCardBeTargeted(
      this,
      this.rootStore,
      cardTarget,
      responder,
      this.effect.target,
      skipNotification,
      params,
    );
  }

  resolvePlayerTargets(
    targets?: EffectTargets,
    layerParams: ResolvingParam = {},
  ): string[] {
    return resolvePlayerTargets(this, this.rootStore, targets, layerParams);
  }

  resolveCardTargets(
    target?: EffectTargets,
    params: {
      targets?: CardModel[];
    } = {},
  ): CardModel[] {
    let cardTargets = resolveCardTargets(this, this.rootStore, target, params);

    if (!!target && "filters" in target) {
      cardTargets = cardTargets
        .filter((card) =>
          card.matchesTargetFilter(
            target.filters,
            this.responder,
            this.source,
            params,
          ),
        )
        .filter((card) =>
          this.canTargetCard(card, this.responder, true, params),
        )
        .filter(notEmptyPredicate);

      // TODO: need to think better about that, it could duplicate targets
      // The problem here is that autoResolve doesn't have a ResolvingParam, so effects won't target anything
      const specificCard = this.getSpecificCardFilter;

      if (
        specificCard &&
        !Array.isArray(specificCard) &&
        !cardTargets.find(
          (card: CardModel) => card.instanceId === specificCard.instanceId,
        )
      ) {
        cardTargets.push(specificCard);
      }

      if (specificCard && Array.isArray(specificCard)) {
        for (const card of specificCard) {
          if (
            !cardTargets.find(
              (existingCard: CardModel) =>
                existingCard.instanceId === card.instanceId,
            )
          ) {
            cardTargets.push(card);
          }
        }
      }
    }

    return cardTargets;
  }

  resolve(params: ResolvingParam = {}) {
    if (!this.areConditionsMet) {
      this.rootStore.trace(
        "Effect conditions not met",
        JSON.stringify(this.effect),
      );
      return;
    }

    return this.resolveEffect(this.effect, params);
  }

  resolveEffect(effect: Effect, params: ResolvingParam = {}) {
    resolveEffect(effect, this, this.rootStore, params);
  }

  get isLoreEffect() {
    return loreEffectPredicate(this.effect);
  }

  get isCostReplacementEffect() {
    return costReplacementEffectPredicate(this.effect);
  }

  get isShiftReplacementEffect() {
    return costReplacementShiftEffectPredicate(this.effect);
  }

  get isCostEffect() {
    return costEffectPredicate(this.effect);
  }

  get isStrengthEffect() {
    return strengthEffectPredicate(this.effect);
  }
  get isMoveCostEffect() {
    return moveCostEffectPredicate(this.effect);
  }
  get isWillPowerEffect() {
    return willPowerEffectPredicate(this.effect);
  }

  get isSingCostEffect() {
    return singCostEffectPredicate(this.effect);
  }

  resolveAmount(params: ResolvingParam | undefined) {
    const amount = "amount" in this.effect ? this.effect.amount : undefined;

    if (!amount) {
      this.rootStore.trace("No amount to resolve");
      return;
    }

    if ("amount" in this.effect && isDynamicAmount(this.effect.amount)) {
      const resolvedAmount = calculateDynamicAmount(
        amount,
        this.rootStore,
        params?.targets || [],
        this.source,
      );

      this.effect = {
        ...this.effect,
        amount: resolvedAmount,
      };

      if (discardEffectPredicate(this.effect)) {
        this.effect = {
          ...this.effect,
          target: {
            ...this.effect.target,
            value: resolvedAmount,
          },
        };
      }
    }
  }

  isNonAccumulative() {
    return "nonAccumulative" in this.effect && this.effect.nonAccumulative;
  }
}
