import {
  AbilityModel,
  isValidAbilityTriggerTarget,
  type MobXRootStore,
  matchesTargetFilters,
} from "@lorcanito/lorcana-engine";
import type { FloatingTriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import { isConditionMet } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import type { IsValidTriggerParams } from "@lorcanito/lorcana-engine/store/resolvers/triggerResolver";
import { makeAutoObservable } from "mobx";

export class FloatingTriggeredAbilityModel {
  cardSource: CardModel;
  // cardTrigger: CardModel;
  id: string;

  // DelayedTriggeredAbility
  readonly type = "floating-triggered" as const;
  duration: number;
  layer: FloatingTriggeredAbility["layer"];
  trigger: FloatingTriggeredAbility["trigger"];
  optional: FloatingTriggeredAbility["optional"];
  responder?: FloatingTriggeredAbility["responder"];
  text?: FloatingTriggeredAbility["text"];
  name?: FloatingTriggeredAbility["name"];
  cost?: FloatingTriggeredAbility["costs"];
  conditions?: FloatingTriggeredAbility["conditions"];

  private readonly rootStore: MobXRootStore;
  private readonly observable: boolean;

  constructor(
    id: string,
    ability: FloatingTriggeredAbility,
    source: CardModel,
    // cardTrigger: CardModel,
    duration: number,
    rootStore: MobXRootStore,
    observable: boolean,
  ) {
    if (observable) {
      makeAutoObservable<FloatingTriggeredAbilityModel, "rootStore">(this, {
        rootStore: false,
      });
    }

    this.observable = observable;
    this.rootStore = rootStore;

    this.cardSource = source;
    this.id = id;

    // We gotta make sure changes to the type DelayedTriggeredAbility are reflected in the constructor
    this.duration = duration;
    this.trigger = ability.trigger;
    this.optional = ability.optional;
    this.layer = ability.layer;
    this.responder = ability.responder;
    this.text = ability.text;
    this.name = ability.name;
    this.cost = ability.costs;
    this.conditions = ability.conditions;
  }

  sync(ability: FloatingTriggeredAbility) {
    // We don't sync abilities, we just create new ones
  }

  replaceTriggerSourceAndTarget() {
    console.warn("NOT IMPLEMENTED replaceTriggerSourceAndTarget");
  }

  activate(
    target: CardModel,
    params: IsValidTriggerParams & {
      playerId?: string;
      dynamicAmount?: number;
      skipAutoResolve?: boolean;
    } = {},
  ) {
    if (this.isValidTrigger(target)) {
      this.rootStore.stackLayerStore.addAbilityToStack(
        new AbilityModel(
          this.layer,
          this.cardSource,
          this.rootStore,
          this.observable,
        ),
        this.cardSource,
        {
          addToTheBottomOfStack: true,
          skipAutoResolve: params.skipAutoResolve,
        },
      );
    }
  }

  isValidTrigger(target?: CardModel, params: IsValidTriggerParams = {}) {
    console.warn("NOT IMPLEMENTED isValidTrigger");
    return true;
  }

  isValidTarget(target: CardModel) {
    console.warn("NOT IMPLEMENTED isValidTarget");
    return false;
  }

  replaceDynamicTargets(params: IsValidTriggerParams) {
    console.warn("NOT IMPLEMENTED replaceDynamicTargets");
  }

  meetTriggerConditions() {
    if (!this.trigger.conditions) {
      return true;
    }

    return isConditionMet(
      this.rootStore,
      this.cardSource,
      this.trigger.conditions,
    );
  }

  isValidTriggerTarget(target?: CardModel, params?: unknown, debug = false) {
    if (!target) {
      debug && console.log("[isValidTriggerTarget] Target is undefined");
      return false;
    }

    return isValidAbilityTriggerTarget(
      this.rootStore,
      this,
      target,
      this.cardSource,
      debug,
    );
  }

  toJSON(): FloatingTriggeredAbility {
    return {
      type: "floating-triggered",
      trigger: this.trigger,
      optional: this.optional,
      layer: this.layer,
      responder: this.responder,
      text: this.text,
      name: this.name,
      costs: this.cost,
      duration: this.duration,
    };
  }
}
