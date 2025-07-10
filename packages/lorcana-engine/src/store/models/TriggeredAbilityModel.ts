import {
  AbilityModel,
  type CardModel,
  cardEffectTargetPredicate,
  challengeFilterPredicate,
  type Effect,
  isValidAbilityTriggerTarget,
  type MobXRootStore,
  matchesTargetFilters,
  notEmptyPredicate,
  staticTriggeredAbilityPredicate,
  type TargetFilter,
  type TriggeredAbility,
} from "@lorcanito/lorcana-engine";
import {
  singFilterPredicate,
  triggerFilterPredicate,
} from "@lorcanito/lorcana-engine/effects/effectTargets";
import { isDynamicAmount } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { isConditionMet } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import { calculateDynamicAmount } from "@lorcanito/lorcana-engine/store/resolvers/dynamicAmount";
import {
  type IsValidTriggerParams,
  isValidTrigger,
} from "@lorcanito/lorcana-engine/store/resolvers/triggerResolver";
import { logger } from "@lorcanito/shared/libs/logger";
import { makeAutoObservable, toJS } from "mobx";

export class TriggeredAbilityModel {
  type = "static-triggered" as const;
  cardSource: CardModel;
  cardThatTriggered: CardModel;

  layer: TriggeredAbility["layer"];
  trigger: TriggeredAbility["trigger"];
  effects: TriggeredAbility["effects"];
  optional: TriggeredAbility["optional"];
  conditions: TriggeredAbility["conditions"];
  secondaryConditions: TriggeredAbility["secondaryConditions"];
  model: AbilityModel;

  private readonly rootStore: MobXRootStore;
  private readonly observable: boolean;

  constructor(
    abilityModel: AbilityModel,
    source: CardModel,
    cardThatTriggered: CardModel,
    rootStore: MobXRootStore,
    observable: boolean,
  ) {
    if (observable) {
      makeAutoObservable<TriggeredAbilityModel, "rootStore">(this, {
        rootStore: false,
      });
    }

    this.observable = observable;
    this.rootStore = rootStore;

    const ability = abilityModel.ability;
    this.model = abilityModel;
    if (!staticTriggeredAbilityPredicate(ability)) {
      throw new Error("Invalid ability");
    }

    // TODO: FIx properly
    // We're cloning the ability because we don't want to modify the original
    // THere's a mutation when the we replace target "itself" or other relative targets with the actual card that triggered the effect
    const abilityClone = JSON.parse(JSON.stringify(ability));

    this.cardSource = source;
    this.cardThatTriggered = cardThatTriggered;
    // We gotta make sure changes to the type StaticTriggeredAbility are reflected in the constructor
    this.effects = abilityClone.effects;
    this.trigger = abilityClone.trigger;
    this.optional = abilityClone.optional;
    this.conditions = abilityClone.conditions;
    this.secondaryConditions = abilityClone.secondaryConditions;
    this.layer = abilityClone.layer;
    this.replaceMoveToLocationTriggerTarget(source, cardThatTriggered);
    this.replaceTriggerTarget(source, cardThatTriggered);
  }

  // TODO: MAKE IT CONSIStent
  get filters(): TargetFilter[] {
    if ("filters" in this.trigger) {
      return this.trigger.filters || [];
    }

    if (
      this.trigger &&
      "target" in this.trigger &&
      this.trigger.target &&
      "filters" in this.trigger.target
    ) {
      return this.trigger.target.filters || [];
    }

    return [];
  }

  // TODO: MAKE IT CONSIStent
  replaceTriggerTarget(source: CardModel, trigger: CardModel) {
    const layer = this.layer;

    for (const effect of layer.effects) {
      const effectTarget = effect.target;

      // TODO: THis was a hot fix target.filters somehow was not available
      if (cardEffectTargetPredicate(effectTarget) && effectTarget.filters) {
        const sourceSelf = effectTarget.filters.findIndex(
          (item) => item.filter === "source" && item.value === "self",
        );
        if (sourceSelf !== -1) {
          effectTarget.filters.splice(sourceSelf, 1, {
            filter: "instanceId",
            value: source.instanceId,
          });
        }

        // TODO: THis was a hot fix target.filters somehow was not available
        const sourceTrigger = effectTarget.filters.findIndex(
          (item) => item.filter === "source" && item.value === "trigger",
        );
        if (sourceTrigger !== -1) {
          effectTarget.filters.splice(sourceTrigger, 1, {
            filter: "instanceId",
            value: trigger.instanceId,
          });
        }
      }
    }
  }

  replaceDynamicTargets(params: IsValidTriggerParams) {
    const { attacker, defender } = params;
    const layer = this.layer;

    if (!(attacker && defender)) {
      return;
    }

    for (const effect of layer.effects) {
      const target = effect.target;

      if (cardEffectTargetPredicate(target) && target.filters) {
        target.filters = target.filters.map((filter) => {
          if (challengeFilterPredicate(filter)) {
            console.log(
              "found a challenge filter: ",
              filter.value === "attacker"
                ? attacker?.instanceId
                : defender?.instanceId,
            );

            return {
              filter: "instanceId",
              value:
                filter.value === "attacker"
                  ? attacker?.instanceId
                  : defender?.instanceId,
            };
          }

          return filter;
        });
      }
    }
  }

  replaceMoveToLocationTriggerTarget(source: CardModel, trigger: CardModel) {
    const layer = this.layer;

    for (const effect of layer.effects) {
      if (effect.type !== "move-to-location") {
        continue;
      }
      const effectTarget = effect.to;

      // TODO: THis was a hot fix target.filters somehow was not available
      if (cardEffectTargetPredicate(effectTarget) && effectTarget.filters) {
        const sourceSelf = effectTarget.filters.findIndex(
          (item) => item.filter === "source" && item.value === "self",
        );
        if (sourceSelf !== -1) {
          effectTarget.filters.splice(sourceSelf, 1, {
            filter: "instanceId",
            value: source.instanceId,
          });
        }

        // TODO: THis was a hot fix target.filters somehow was not available
        const sourceTrigger = effectTarget.filters.findIndex(
          (item) => item.filter === "source" && item.value === "trigger",
        );
        if (sourceTrigger !== -1) {
          effectTarget.filters.splice(sourceTrigger, 1, {
            filter: "instanceId",
            value: trigger.instanceId,
          });
        }
      }
    }
  }

  // TODO: find a better way to do this
  // When we receive the JSON representation of the layer, they contain "static" values that are only known during runtime
  // So when we instantiate the model, we replace those values by the actual targets that are in play
  replaceChallengeTarget(
    params: { attacker?: CardModel; defender?: CardModel } = {},
  ) {
    const { attacker, defender } = params;
    const layer = this.layer;

    if (!(attacker && defender)) {
      return;
    }

    for (const effect of layer.effects) {
      const target = effect.target;

      if (cardEffectTargetPredicate(target) && target.filters) {
        const challengeFilter = target.filters.findIndex(
          challengeFilterPredicate,
        );
        const filter = target.filters[challengeFilter];

        if (challengeFilterPredicate(filter)) {
          target.filters.splice(challengeFilter, 1, {
            filter: "instanceId",
            value:
              filter.value === "attacker"
                ? attacker?.instanceId
                : defender?.instanceId,
          });
        }
      }
    }
  }

  // TODO: find a better way to do this
  // When we receive the JSON representation of the layer, they contain "static" values that are only known during runtime
  // So when we instantiate the model, we replace those values by the actual targets that are in play
  replaceSingTarget(
    params: {
      singer?: CardModel;
      song?: CardModel;
      singers?: CardModel[];
    } = {},
  ) {
    const { singer, song, singers } = params;
    const layer = this.layer;

    if (!(song && (singers || singer))) {
      return;
    }

    for (const effect of layer.effects) {
      const target = effect.target;

      // TODO: THis was a hot fix target.filters somehow was not available
      if (cardEffectTargetPredicate(target) && target.filters) {
        const singFilter = target.filters.findIndex(singFilterPredicate);
        const filter = target.filters[singFilter];

        if (singFilterPredicate(filter) && filter.value === "song") {
          target.filters.splice(singFilter, 1, {
            filter: "instanceId",
            value: song?.instanceId,
          });
        }

        if (singFilterPredicate(filter) && filter.value === "singer") {
          if (singers) {
            target.filters.splice(singFilter, 1, {
              filter: "instanceId",
              value: singers
                ?.map((singer) => singer.instanceId)
                ?.filter(notEmptyPredicate),
            });
          }

          if (singer) {
            target.filters.splice(singFilter, 1, {
              filter: "instanceId",
              value: singer.instanceId,
            });
          }
        }
      }
    }
  }

  // TODO: find a better way to do this
  // When we receive the JSON representation of the layer, they contain "static" values that are only known during runtime
  // So when we instantiate the model, we replace those values by the actual targets that are in play
  replaceTriggerSourceAndTarget(
    params: { triggerSource?: CardModel; triggerTarget?: CardModel } = {},
  ) {
    const { triggerSource, triggerTarget } = params;
    const layer = this.layer;

    if (!(triggerSource && triggerTarget)) {
      // TODO: THis happens whenever the trigger is at the end / beginning of a turn
      logger.error(
        `[replaceTriggerSourceAndTarget] Invalid trigger source or target: ${layer.name} - ${JSON.stringify(layer)}`,
      );
      return;
    }

    for (const effect of layer.effects) {
      const target = effect.target;

      // TODO: THis was a hot fix target.filters somehow was not available
      if (cardEffectTargetPredicate(target) && target.filters) {
        const triggerFilter = target.filters.findIndex(triggerFilterPredicate);
        const filter = target.filters[triggerFilter];

        if (triggerFilterPredicate(filter)) {
          target.filters.splice(triggerFilter, 1, {
            filter: "instanceId",
            value:
              filter.value === "source"
                ? triggerSource?.instanceId
                : triggerTarget?.instanceId,
          });
        }
      }
    }
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

  isValidTarget(target: CardModel, debug = false) {
    return isValidAbilityTriggerTarget(
      this.rootStore,
      this,
      target,
      this.cardSource,
      debug,
    );
  }

  // TODO: This function is sort of duplicated by triggerResolver.ts@isValidTrigger
  // DelayedTriggeredAbilityModel is also incomplete
  isValidTriggerTarget(
    targetParam?: CardModel,
    params: IsValidTriggerParams = {},
    debug = false,
  ) {
    let target = targetParam;
    if (debug)
      console.log(
        "[isValidTriggerTarget] Starting evaluation",
        JSON.stringify({
          triggerOn: this.trigger.on,
          target: target?.fullName,
          params,
          source: this.cardSource.fullName,
          cardThatTriggered: this.cardThatTriggered?.fullName,
        }),
      );

    const on = this.trigger.on;

    if (["start_turn", "end_turn"].includes(on)) {
      const isValid = !!params.playerId;
      if (debug)
        console.log(`[isValidTriggerTarget] Turn trigger check: ${isValid}`, {
          on,
          playerId: params.playerId,
        });
      return isValid;
    }

    // This logic is being silently duplicated many times
    // What happens here is that we need to apply a filter to the trigger source, not the source of the ability
    // E.g. When you enter a location, we may want to validate: The character that entered the location, the location itself, the source of the ability that triggers whenever a character enters the location.
    const trigger = this.trigger;
    if (trigger && "source" in trigger && trigger.source) {
      const triggerSource = params.location;

      if (triggerSource) {
        const matchesTarget = matchesTargetFilters(
          this.rootStore,
          triggerSource,
          trigger.source,
          this.cardSource.ownerId,
          this.cardSource,
        );

        if (debug)
          console.log(
            `[isValidTriggerTarget] Trigger source check: ${JSON.stringify(matchesTarget)}`,
            JSON.stringify({
              triggerSource: triggerSource.fullName,
              sourceFilters: trigger.source,
            }),
          );

        if (!matchesTarget) {
          return false;
        }
      }
    }

    if (trigger.on === "moves-to-a-location" && trigger.movingFrom) {
      if (!params.previousLocation) {
        if (debug)
          console.log(
            "[isValidTriggerTarget] No previous location for move trigger",
          );
        return false;
      }

      const matchesTarget = params.previousLocation.matchesTargetFilter(
        trigger.movingFrom,
        this.cardSource.ownerId,
        this.cardSource,
      );

      if (debug)
        console.log(
          `[isValidTriggerTarget] Moving from location check: ${JSON.stringify(matchesTarget)}`,
          JSON.stringify({
            previousLocation: params.previousLocation.name,
            movingFromFilter: trigger.movingFrom,
          }),
        );

      if (!matchesTarget) {
        return false;
      }
    }

    if (this.trigger.on === "damage" && this.trigger.dealt) {
      const isValid = isValidAbilityTriggerTarget(
        this.rootStore,
        this,
        params.damageSource,
        this.cardSource,
      );
      if (debug)
        console.log(`[isValidTriggerTarget] Damage trigger check: ${isValid}`, {
          damageSource: params.damageSource?.fullName,
        });
      return isValid;
    }

    if (on === "challenge") {
      target =
        this.trigger.as === "attacker" ? params.attacker : params.defender;
      if (debug)
        console.log(
          "[isValidTriggerTarget] Challenge target selected",
          JSON.stringify({
            as: this.trigger.as,
            target: target?.fullName,
          }),
        );
    }

    if (!target) {
      console.log("[isValidTriggerTarget] No target for static trigger");
      return false;
    }

    if (this.trigger.on === "leave") {
      if (
        // If destination is empty, if means any destination
        this.trigger.destination &&
        this.trigger.destination !== params.destination
      ) {
        if (debug) {
          console.log(
            "[isValidTriggerTarget] Leave destination mismatch",
            JSON.stringify({
              expectedDestination: this.trigger.destination,
              actualDestination: params.destination,
              expectedFrom: this.trigger.from,
              actualFrom: params.from,
            }),
          );
        }

        return false;
      }

      if (this.trigger.from && this.trigger.from !== params.from) {
        if (debug) {
          console.log(
            "[isValidTriggerTarget] Leave origin mismatch",
            JSON.stringify({
              expectedFrom: this.trigger.from,
              actualFrom: params.from,
            }),
          );
        }

        return false;
      }
    }

    if (this.trigger.on === "play" && this.trigger.hasShifted) {
      if (!params.hasShifted) {
        if (debug) {
          console.log(
            "[isValidTriggerTarget] Play with shift required but not shifted",
          );
        }
        return false;
      }
    }

    if (this.trigger.on === "play" && this.trigger.hasSang) {
      if (!params.singing) {
        if (debug) {
          console.log(
            "[isValidTriggerTarget] Sing a song required but not singing",
          );
        }
        return false;
      }
    }

    const result = isValidAbilityTriggerTarget(
      this.rootStore,
      this,
      target,
      this.cardSource,
      debug,
    );

    if (debug) {
      console.log(`[isValidTriggerTarget] Final validation result: ${result}`);
    }
    return result;
  }

  isValidTrigger(
    target?: CardModel,
    params: IsValidTriggerParams = {},
  ): boolean {
    if (!target) {
      return false;
    }

    return !!isValidTrigger(this, this.rootStore, target, params);
  }

  activate(
    target: CardModel,
    params: IsValidTriggerParams & {
      playerId?: string;
      dynamicAmount?: number;
      skipAutoResolve?: boolean;
    } = {},
  ) {
    //Target has been  validated in the trigger method
    if (!this.isValidTrigger(target, params)) {
      this.rootStore.debug("Invalid target trigger for effect");
      return;
    }

    // this.rootStore.trace(
    //   `Activating ability: ${JSON.stringify(this.toJSON(), null, 2)}`,
    // );

    // const { singer, song } = params;
    // if (singer && song) {
    //   this.replaceSingTarget({ singer, song });
    // }

    // Ugly but it's an immutable way of doing this
    this.layer = {
      ...this.layer,
      // TODO: conditions belong to trigger, but they should also be looked at during resolution
      resolutionConditions:
        this.layer.resolutionConditions || this.secondaryConditions,
      // TODO: This is a hot fix, we should be able to remove this
      // target: this.layer.effects.find((effect) => effect.target)?.target,
      effects: this.layer.effects.map((effect: Effect) => {
        const effectAmount = "amount" in effect ? effect.amount : 0;
        if (isDynamicAmount(effectAmount)) {
          // This dynamic amount is only used for Damage triggers at the moment.
          // TODO: IMPROVE THIS
          const dynamicAmount = params.dynamicAmount;
          if (dynamicAmount) {
            return { ...effect, amount: dynamicAmount };
          }

          if (
            "resolveAmountBeforeCreatingLayer" in effect &&
            effect.resolveAmountBeforeCreatingLayer
          ) {
            const resolvedAmount = calculateDynamicAmount(
              effectAmount,
              this.rootStore,
              [target],
              this.cardSource,
            );
            this.rootStore.trace(
              `Resolving amount before creating triggered layer,
              amount: ${JSON.stringify(effectAmount)}
              resolved amount: ${resolvedAmount}`,
            );
            return {
              ...effect,
              amount: resolvedAmount,
            };
          }

          return effect;
        }

        return effect;
      }),
    };

    const abilityModel = new AbilityModel(
      this.layer,
      this.cardSource,
      this.rootStore,
      this.observable,
    );

    if (abilityModel.isInvalidResolution) {
      this.rootStore.debug(
        "Invalid resolution for triggered effect, skipping it.",
      );
      return;
    }

    if (
      !(abilityModel.areConditionsMet && abilityModel.areSecondaryConditionsMet)
    ) {
      this.rootStore.debug(
        "Trigger resolution conditions don't match, skipping it.",
      );
      return;
    }

    if (!abilityModel.hasValidTarget) {
      this.rootStore.debug("Trigger doesn't have valid target, skipping it.");
      return;
    }

    if (abilityModel.allEffectsHaveZeroAmount && !this.layer.unless) {
      console.log(JSON.stringify(abilityModel.toJSON()));
      this.rootStore.debug(
        "Trigger resolution has no effects with amount, skipping it.",
      );
      return;
    }

    this.rootStore.stackLayerStore.addAbilityToStack(
      abilityModel,
      this.cardSource,
      {
        addToTheBottomOfStack: true,
        skipAutoResolve: params.skipAutoResolve,
      },
    );
  }

  toJSON() {
    return {
      source: this.cardSource.fullName,
      effects: toJS(this.effects),
      trigger: this.trigger,
      optional: this.optional,
      layer: this.layer,
    };
  }
}
