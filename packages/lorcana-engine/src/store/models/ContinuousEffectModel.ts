import {
  costReplacementShiftEffectPredicate,
  type TargetFilter,
} from "@lorcanito/lorcana-engine";
import {
  type ContinuousEffect,
  costReplacementEffectPredicate,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { EffectModel } from "@lorcanito/lorcana-engine/store/models/EffectModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import { makeAutoObservable, toJS } from "mobx";

// Continuous effects are effects that last for a duration of time.
// They don't exist in the JSON structure that we call LorcanitoCard
// but they are saved in Firebase
export class ContinuousEffectModel
  implements Omit<ContinuousEffect, "source" | "target" | "effect">
{
  type = "continuous" as const;
  id: string;
  source: CardModel;
  target?: CardModel | null;
  playerTarget?: string;
  filters: TargetFilter[];
  duration: ContinuousEffect["duration"];
  effect: EffectModel;
  private rootStore: MobXRootStore;

  constructor({
    id,
    source,
    target,
    playerTarget,
    duration,
    effect,
    filters,
    rootStore,
    observable,
  }: {
    id: string;
    source: CardModel;
    target?: CardModel | null;
    playerTarget?: string;
    duration: ContinuousEffect["duration"];
    effect: EffectModel;
    filters: TargetFilter[];
    rootStore: MobXRootStore;
    observable: boolean;
  }) {
    if (observable) {
      makeAutoObservable<ContinuousEffectModel, "rootStore">(this, {
        rootStore: false,
      });
    }

    this.id = id;
    this.source = source;
    this.target = target;
    this.duration = duration;

    // For some reason it's always set as false, and this increases the payload
    if (
      typeof this.duration?.challenge === "boolean" &&
      !this.duration.challenge
    ) {
      this.duration.challenge = undefined;
    }

    this.effect = effect;
    this.filters = filters;
    this.playerTarget = playerTarget;

    this.rootStore = rootStore;
  }

  isValid(card: CardModel) {
    if (this.target?.instanceId !== card.instanceId) {
      return false;
    }

    if (this.duration?.until && this.duration?.turn) {
      return this.rootStore.turnCount <= this.duration?.turn;
    }

    if (this.duration?.challenge) {
      return this.rootStore.stateMachineStore.challengeInProgress;
    }

    return this.duration?.turn === this.rootStore.turnCount;
  }

  isCostReplacementEffect(card: CardModel): boolean {
    const effect = this.effect.effect;

    return (
      costReplacementEffectPredicate(effect) &&
      card.matchesTargetFilter(effect.target.filters || [])
    );
  }

  isShiftReplacementEffect(card: CardModel): boolean {
    const effect = this.effect.effect;

    return (
      costReplacementShiftEffectPredicate(effect) &&
      card.matchesTargetFilter(effect.target.filters || [])
    );
  }

  cardPlayed(card: CardModel) {
    const effect = this.effect.effect;
    if (
      (this.isCostReplacementEffect(card) ||
        this.isShiftReplacementEffect(card)) &&
      effect.type === "replacement" &&
      effect.duration === "next"
    ) {
      this.rootStore.trace(
        `Continuous effect ${this.id} was used and it's over`,
      );
      this.rootStore.continuousEffectStore.stopContinuousEffect(this);
    }
  }

  changeTarget(target: CardModel) {
    this.target = target;
    this.effect.changeTarget(target);
  }

  sync(effect: ContinuousEffect) {
    throw new Error("We don't sync them, we just create them");
  }

  toJSON(): ContinuousEffect {
    return {
      type: this.type,
      id: this.id,
      source: this.source?.instanceId,
      target: this.target?.instanceId,
      playerTarget: this.playerTarget,
      filters: toJS(this.filters),
      duration: toJS(this.duration),
      // TODO: This is not correct, it doesn't expose responder.
      effect: toJS(this.effect.effect),
    };
  }

  isNonAccumulative() {
    return this.effect.isNonAccumulative();
  }

  isEquivalent(effect: ContinuousEffectModel) {
    if (
      this.source.instanceId !== effect.source.instanceId ||
      this.target?.instanceId !== effect.target?.instanceId
    ) {
      return false;
    }

    function replacer(key: string, value: unknown) {
      if (key.toLowerCase() === "ID".toLowerCase()) {
        return undefined;
      }

      return value;
    }

    return JSON.stringify(this, replacer) === JSON.stringify(effect, replacer);
  }
}
