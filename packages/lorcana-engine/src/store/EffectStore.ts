import {
  type Abilities,
  type AbilityModel,
  type EffectModel,
  keywordToAbilityPredicate,
  matchesTargetFilters,
  type ResistAbility,
  type Trigger,
} from "@lorcanito/lorcana-engine";
import {
  notEmptyPredicate,
  resistAbilityPredicate,
  staticAbilityPredicate,
  staticTriggeredAbilityPredicate,
} from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import { magicaDeSpellCruelSorceress } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { kronkRelaxed } from "@lorcanito/lorcana-engine/cards/007";
import {
  challengeCharactersRestrictionEffectPredicate,
  challengeRestrictionEffectPredicate,
  damageProtectionEffectPredicate,
  gainLoreRestrictionEffectPredicate,
  playActionCardsRestrictionEffectPredicate,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
import type {
  AbilityFilter,
  CardModel,
} from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { ContinuousEffectModel } from "@lorcanito/lorcana-engine/store/models/ContinuousEffectModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import {
  isConditionMet,
  type WhileCondition,
} from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import {
  calculateCostModifier,
  calculateShiftCostModifier,
} from "@lorcanito/lorcana-engine/store/resolvers/costResolver";
import {
  calculateDynamicAmount,
  resolveAmount,
} from "@lorcanito/lorcana-engine/store/resolvers/dynamicAmount";
import { isValidPlayerTarget } from "@lorcanito/lorcana-engine/store/resolvers/targetsResolver";
import {
  action,
  computed,
  makeAutoObservable,
  observable as observableProperty,
  runInAction,
} from "mobx";

let callStackDepth = 0;
const MAX_DEPTH = 10;

// This store holds convoluted logic that handles effects
// It's a bit of a mess, but it's a mess that works
// I'll be refactoring this later
export class EffectStore {
  private readonly rootStore: MobXRootStore;
  private readonly observable: boolean;
  evaluatedAbilities: AbilityModel[] = [];
  nonEvaluatedAbilities: AbilityModel[] = [];
  private evaluatedForHash = "";
  private isInitialising = false;

  constructor(rootStore: MobXRootStore, observable: boolean) {
    if (observable) {
      makeAutoObservable<EffectStore, "dependencies" | "rootStore">(this, {
        rootStore: false,
        dependencies: false,
        reEvaluateAbilities: action,
        getAllNativeAbilities: computed,
      });
    }

    this.rootStore = rootStore;
    this.observable = observable;
  }

  hasRestrictionToPlayActionCard(card: CardModel) {
    const playerEffects = this.getPlayerEffects(card.ownerId);

    return playerEffects.some((effect) =>
      playActionCardsRestrictionEffectPredicate(effect?.effect),
    );
  }

  hasGainLoreRestriction(playerId: string) {
    const playerEffects = this.getPlayerEffects(playerId, true);
    return playerEffects.find((effect) =>
      gainLoreRestrictionEffectPredicate(effect?.effect),
    );
  }

  // TODO: this is incomplete, it's working only for:
  // Tiana Celebrating Princess
  getPlayerAbilities(playerId: string, convertGainedAbilities?: boolean) {
    return this.rootStore.cardStore.cardsInPlay
      .map((card) => {
        const nativeAbilities = card
          .nativeAbilities([], convertGainedAbilities)
          .filter((ability) => ability.areConditionsMet)
          .filter((ability) => ability.isStaticAbility);

        return [...nativeAbilities].filter((ability: AbilityModel) =>
          isValidPlayerTarget(card, ability.ability, playerId),
        );
      })
      .filter(notEmptyPredicate)
      .flat();
  }

  getPlayerEffects(playerId: string, convertGainedAbilities?: boolean) {
    const playerContinuousEffects = this.rootStore.continuousEffectStore
      .getPlayerEffects(playerId)
      .map((model: ContinuousEffectModel) => model.effect)
      .filter(notEmptyPredicate);

    const abilityEffects = this.getPlayerAbilities(
      playerId,
      convertGainedAbilities,
    ).map((model) => model.effects);

    return [...abilityEffects, ...playerContinuousEffects].flat();
  }

  hasDiscardRestriction(cardModel: CardModel) {
    const kronkInPlay = this.rootStore.cardStore.characterCardsInPlay.find(
      (card) => {
        return (
          card.publicId === kronkRelaxed.id &&
          card.ownerId === cardModel.ownerId
        );
      },
    );

    if (kronkInPlay) {
      return true;
    }

    if (cardModel.ownerId === this.rootStore.turnPlayer) {
      return false;
    }

    return !!this.rootStore.cardStore.cardsInPlay.find(
      (card) =>
        card.publicId === magicaDeSpellCruelSorceress.id &&
        card.ownerId === cardModel.ownerId,
    );
  }

  // TODO: Similar pattern is repeated all over the codebase
  // Create a function that return all abilities on board by a given filter
  damageRemovalRestrictionEffect(targetCard: CardModel) {
    const abilityFilter = [
      (model: AbilityModel) => model.hasDamageRemovalRestrictionEffect,
    ];

    const cardsWithDamageRemovalRestriction =
      this.rootStore.cardStore.getCardsByAbilityFilter(abilityFilter);

    const getDamageRemovalRestrictionAbilities = (sourceCard: CardModel) => {
      return this.getAbilitiesForCard(sourceCard, abilityFilter).filter(
        (model) =>
          model.hasDamageRemovalRestrictionEffect &&
          model.canTargetCard(targetCard),
      );
    };

    return cardsWithDamageRemovalRestriction
      .filter((sourceCard) => getDamageRemovalRestrictionAbilities(sourceCard))
      .flatMap((card) => getDamageRemovalRestrictionAbilities(card));
  }

  damageDealtRestrictionEffect(targetCard: CardModel) {
    const abilityFilter = [
      (model: AbilityModel) => model.hasDamageDealtRestrictionEffect,
    ];

    const cardsWithDamageDealtRestriction =
      this.rootStore.cardStore.getCardsByAbilityFilter(abilityFilter);

    const getDamageDealtRestrictionAbilities = (sourceCard: CardModel) => {
      return this.getAbilitiesForCard(sourceCard, abilityFilter).filter(
        (model) =>
          model.hasDamageDealtRestrictionEffect &&
          model.canTargetCard(targetCard),
      );
    };

    return cardsWithDamageDealtRestriction
      .filter((sourceCard) => getDamageDealtRestrictionAbilities(sourceCard))
      .flatMap((card) => getDamageDealtRestrictionAbilities(card));
  }

  hasQuestRestriction(targetCard: CardModel): boolean {
    const abilityFilter = [
      (model: AbilityModel) => model.hasQuestRestrictionEffect,
    ];

    const abilitiesWithQuestRestriction =
      this.rootStore.cardStore.getCardsByAbilityFilter(abilityFilter);

    return !!abilitiesWithQuestRestriction.find((sourceCard) => {
      return this.getAbilitiesForCard(sourceCard, abilityFilter)
        .find((model) => model.hasQuestRestrictionEffect)
        ?.canTargetCard(targetCard);
    });
  }

  hasChallengeRestriction(cardModel: CardModel) {
    const challengeRestriction =
      this.rootStore.continuousEffectStore.getChallengeRestriction(cardModel);

    if (challengeRestriction.length > 0) {
      return true;
    }

    const abilityFilter: Array<(model: AbilityModel) => boolean> = [
      (model) =>
        model.isStaticAbility &&
        !!model.ability.effects?.find(challengeRestrictionEffectPredicate),
      (model) => {
        const ability = model.ability;
        if (!staticAbilityPredicate(ability)) {
          return false;
        }

        return !!ability.effects
          ?.filter(challengeRestrictionEffectPredicate)
          .find((effect) => {
            return matchesTargetFilters(
              this.rootStore,
              cardModel,
              effect.target,
              model.source.ownerId,
              model.source,
            );
          });
      },
    ];

    return (
      this.rootStore.cardStore.getCardsByAbilityFilter(abilityFilter).length > 0
    );
  }

  hasChallengeCharactersRestriction(cardModel: CardModel) {
    const challengeCharactersRestriction =
      this.rootStore.continuousEffectStore.getChallengeCharactersRestriction(
        cardModel,
      );

    if (challengeCharactersRestriction.length > 0) {
      return true;
    }

    const abilityFilter: Array<(model: AbilityModel) => boolean> = [
      (model) =>
        model.isStaticAbility &&
        !!model.ability.effects?.find(
          challengeCharactersRestrictionEffectPredicate,
        ),
      (model) => {
        const ability = model.ability;
        if (!staticAbilityPredicate(ability)) {
          return false;
        }

        return !!ability.effects
          ?.filter(challengeCharactersRestrictionEffectPredicate)
          .find((effect) => {
            return matchesTargetFilters(
              this.rootStore,
              cardModel,
              effect.target,
              model.source.ownerId,
              model.source,
            );
          });
      },
    ];

    return (
      this.rootStore.cardStore.getCardsByAbilityFilter(abilityFilter).length > 0
    );
  }

  getShiftModifier(cardModel: CardModel) {
    return calculateShiftCostModifier(this.rootStore, cardModel);
  }

  getCostModifier(cardModel: CardModel) {
    return calculateCostModifier(this.rootStore, cardModel);
  }

  getCostAttributeModifier(cardModel: CardModel) {
    const filters = [
      (model: AbilityModel) =>
        !(
          model.isResolutionAbility ||
          model.isStaticTriggeredAbility ||
          model.isActivatedAbility
        ) &&
        model.hasCostAttributeEffect &&
        (model.canEffectsTargetCard(cardModel) ||
          model.canTargetCard(cardModel)),
    ];

    const activeEffects = this.getCardEffects(cardModel, filters).filter(
      (effect) => effect.isCostEffect,
    );

    return activeEffects.reduce((acc: number, effectModel: EffectModel) => {
      const amount = effectModel.calculateAmount([cardModel]);
      return acc + amount;
    }, 0);
  }

  getWillPowerModifier(cardModel: CardModel) {
    const filters = [
      (model: AbilityModel) =>
        !(
          model.isResolutionAbility ||
          model.isStaticTriggeredAbility ||
          model.isActivatedAbility
        ) &&
        model.hasWillPowerAttributeEffect &&
        (model.canEffectsTargetCard(cardModel) ||
          model.canTargetCard(cardModel)),
    ];

    const activeEffects = this.getCardEffects(cardModel, filters).filter(
      (effect) => effect.isWillPowerEffect,
    );

    return activeEffects.reduce((acc: number, effectModel: EffectModel) => {
      const amount = effectModel.calculateAmount([cardModel]);
      return acc + amount;
    }, 0);
  }

  getSingCostModifier(cardModel: CardModel) {
    const filters = [
      (model: AbilityModel) =>
        !(
          model.isResolutionAbility ||
          model.isStaticTriggeredAbility ||
          model.isActivatedAbility
        ) &&
        model.hasSingCostAttributeEffect &&
        (model.canEffectsTargetCard(cardModel) ||
          model.canTargetCard(cardModel)),
    ];

    const activeEffects = this.getCardEffects(cardModel, filters).filter(
      (effect) => effect.isSingCostEffect,
    );

    return activeEffects.reduce((acc: number, effectModel: EffectModel) => {
      const amount = effectModel.calculateAmount([cardModel]);
      return acc + amount;
    }, 0);
  }

  getLoreModifier(cardModel: CardModel) {
    const filters = [
      (model: AbilityModel) =>
        !(
          model.isResolutionAbility ||
          model.isStaticTriggeredAbility ||
          model.isActivatedAbility
        ) &&
        model.hasLoreAttributeEffect &&
        (model.canEffectsTargetCard(cardModel) ||
          model.canTargetCard(cardModel)),
    ];

    const activeEffects = this.getCardEffects(cardModel, filters).filter(
      (effect) => effect.isLoreEffect,
    );

    return activeEffects.reduce((acc: number, effectModel: EffectModel) => {
      const amount = effectModel.calculateAmount([cardModel]);
      return acc + amount;
    }, 0);
  }

  getStrengthModifier(cardModel: CardModel) {
    const filters = [
      (model: AbilityModel) =>
        !(
          model.isResolutionAbility ||
          model.isStaticTriggeredAbility ||
          model.isActivatedAbility
        ) &&
        model.hasStrengthAttributeEffect &&
        (model.canEffectsTargetCard(cardModel) ||
          model.canTargetCard(cardModel)),
    ];

    const activeEffects = this.getCardEffects(cardModel, filters).filter(
      (effect) => effect.isStrengthEffect,
    );

    return activeEffects.reduce((acc: number, effectModel: EffectModel) => {
      const amount = effectModel.calculateAmount([cardModel]);
      return acc + amount;
    }, 0);
  }

  getMoveCostModifier(cardModel: CardModel) {
    const filters = [
      (model: AbilityModel) =>
        !(
          model.isResolutionAbility ||
          model.isStaticTriggeredAbility ||
          model.isActivatedAbility
        ) &&
        model.hasMoveCostAttributeEffect &&
        (model.canEffectsTargetCard(cardModel) ||
          model.canTargetCard(cardModel)),
    ];

    const activeEffects = this.getCardEffects(cardModel, filters).filter(
      (effect) => effect.isMoveCostEffect,
    );

    return activeEffects.reduce((acc: number, effectModel: EffectModel) => {
      const amount = effectModel.calculateAmount([cardModel]);
      return acc + amount;
    }, 0);
  }

  private getStaticGainedAbilities(
    targetCard: CardModel,
    filters: Array<(ability: AbilityModel) => boolean | undefined>,
  ): AbilityModel[] {
    const abilityModels: AbilityModel[] = this.allAbilitiesByFilters(filters);

    return abilityModels
      .filter((model) => model.isGainStaticAbility)
      .filter((model) => model.canTargetCard(targetCard))
      .map((abilityModel) => abilityModel.convert(targetCard))
      .filter(notEmptyPredicate);
  }

  metCondition(sourceCard: CardModel, conditions: WhileCondition[] = []) {
    return isConditionMet(this.rootStore, sourceCard, conditions);
  }

  calculateDynamicEffectAmount(effect: EffectModel, target: CardModel): number {
    return resolveAmount(effect, this.rootStore, [target]);
  }

  get getAllNativeAbilities() {
    return this.rootStore.cardStore.cardsInPlay.flatMap(
      (card) => card.getNativeAbilities,
    );
  }

  // See engine/store/resolver/README.md
  private evaluateAllAbilities() {
    try {
      callStackDepth++;

      if (callStackDepth >= MAX_DEPTH) {
        console.log("Max call stack depth reached. Returning fallback.");
        callStackDepth--;
        return {
          evaluated: this.evaluatedAbilities,
          nonEvaluated: this.nonEvaluatedAbilities,
        };
      }

      runInAction(() => {
        // This is the maximum amount of times we're going to loop
        const fixedPointThreshold = 3;
        for (let i = 0; i <= fixedPointThreshold; i++) {
          // This is used to break the loop if we're not making any progress
          let hasChanged = false;

          for (let j = this.nonEvaluatedAbilities.length - 1; j >= 0; j--) {
            const evaluating: AbilityModel | undefined =
              this.nonEvaluatedAbilities.pop();

            if (!evaluating) {
              console.log("No more abilities to evaluate");
              break;
            }

            try {
              // this.rootStore.trace(
              //   `Evaluating ${evaluating.ability.name || evaluating.name}`,
              // );

              if (evaluating.evaluate) {
                hasChanged = true;
                this.evaluatedAbilities.push(evaluating);
              } else {
                this.nonEvaluatedAbilities.unshift(evaluating);
              }
            } catch (e) {
              this.rootStore.trace(
                `Failed to evaluate ${evaluating.ability.name}`,
              );
              // Adding it to the array again so it can be later evaluated
              this.nonEvaluatedAbilities.unshift(evaluating);
            }
          }

          if (!hasChanged) {
            break;
          }

          // this.rootStore.trace(
          //   `Loop ${i}: non evaluated ${this.nonEvaluatedAbilities.length} (${this.nonEvaluatedAbilities.map((model) => model.name)}), evaluated: ${this.evaluatedAbilities.length} (${this.evaluatedAbilities.map((model) => model.name)}).`,
          // );
        }
      });
    } finally {
      callStackDepth--;
      // this.rootStore.trace(
      //   `Abilities Initialized:
      // evaluated ${this.evaluatedAbilities.length} (${this.evaluatedAbilities.map((model) => model.name)}),
      // non evaluated: ${this.nonEvaluatedAbilities.length} (${this.nonEvaluatedAbilities.map((model) => model.name)}).`,
      // );
    }
  }

  getDamageReductionForCard(params: {
    cardModel: CardModel;
    isChallenge?: boolean;
    damageSource?: CardModel;
    isAttacker?: boolean;
    isDefender?: boolean;
  }) {
    const { cardModel, isChallenge, damageSource, isDefender, isAttacker } =
      params;
    // Get all abilities that match the resist ability and map out the values
    const abilitiesForCard =
      this.rootStore.effectStore.getAbilitiesForCard(cardModel);

    const resistEffects = abilitiesForCard
      .filter((model) => {
        const rawAbility = model.ability;
        if (!resistAbilityPredicate(rawAbility)) {
          return false;
        }

        if (rawAbility.onlyWhileChallenge && !isChallenge) {
          return false;
        }

        return true;
      })
      .map((model) => (model.ability as ResistAbility).value)
      .map((value) =>
        calculateDynamicAmount(value, this.rootStore, [cardModel], cardModel),
      );

    const protectionEffects = damageSource
      ? abilitiesForCard.filter((model) => {
          const effects = model.effects.filter((effectModel) =>
            damageProtectionEffectPredicate(effectModel.effect),
          );

          if (effects.length === 0) {
            return false;
          }

          return effects.some((effectModel) => {
            const effect = effectModel.effect;

            if (damageProtectionEffectPredicate(effect)) {
              const { as } = effect;

              if (as === "attacker" && !isAttacker) {
                return false;
              }

              if (as === "defender" && !isDefender) {
                return false;
              }
            }

            return effectModel.canTargetCard(
              damageSource,
              cardModel.ownerId,
              true,
            );
          });
        })
      : [];

    if (protectionEffects.length > 0) {
      this.rootStore.trace(
        `Protection effects: ${JSON.stringify(protectionEffects)}`,
      );
      return 99;
    }

    // If there are no resist effects damage reduction is 0
    if (resistEffects.length === 0) {
      return 0;
    }

    // Otherwise return the summed (stacked) resist values.
    return resistEffects.reduce((sum, value) => sum + value, 0);
  }

  getCardEffects(
    cardModel: CardModel,
    filters: AbilityFilter[] = [],
    targetCard?: CardModel,
  ): EffectModel[] {
    const expectedTarget = targetCard || cardModel;

    const activeContinuousEffects: EffectModel[] =
      this.rootStore.continuousEffectStore
        .findContinuousEffectsByCard(cardModel)
        .map((effect) => effect.effect);

    const selfEffects: EffectModel[] = this.getAbilitiesForCard(
      cardModel,
      filters,
    )
      .filter((ability) => ability.canEffectsTargetCard(cardModel))
      .flatMap((model) => model.effects);

    const gainedEffects = this.getAbilitiesEffectsForCard(cardModel, filters);

    return [
      ...activeContinuousEffects,
      ...selfEffects,
      ...gainedEffects,
    ].filter((effect) => {
      // TODO: isValidTarget is not the best as it would false positive when char has ward or is not in play
      return effect.canTargetCard(
        expectedTarget,
        effect?.source.ownerId || expectedTarget.ownerId,
        true,
      );
    });
  }

  getAbilitiesEffectsForCard(
    card: CardModel,
    filters: AbilityFilter[] = [],
  ): EffectModel[] {
    return this.allAbilitiesByFilters(filters)
      .filter((model) => !model.source.isCard(card))
      .flatMap((model) => model.effects);
  }

  getResolutionAbilitiesForCard(card: CardModel) {
    const gainedResolutionAbility = this.getStaticGainedAbilities(
      card,
      // Using the params to filter causes the filter to be evaluated before the gainedAbility is converted to Resolution ability, which fails the filter
      [],
    ).filter((ability) => ability.isResolutionAbility);

    const nativeResolutionAbilities = card.nativeAbilities([
      (model) => model.isResolutionAbility,
    ]);

    return [
      ...nativeResolutionAbilities,
      ...gainedResolutionAbility.filter(
        (ability, index, self) =>
          self.findIndex((a) => a.name === ability.name) === index,
      ),
    ];
  }

  getActivatedAbilityForCard(card: CardModel, abilityName?: string) {
    const activatedAbilities = this.getAbilitiesForCard(card, [
      (ability: AbilityModel) => {
        return ability.isActivatedAbility;
      },
    ]);

    if (!abilityName) {
      return activatedAbilities[0];
    }

    return activatedAbilities.find(
      (ability) => ability.name?.toLowerCase() === abilityName.toLowerCase(),
    );
  }

  getStaticAbilitiesForCard(card: CardModel, keyword: Abilities) {
    return this.rootStore.effectStore
      .getAbilitiesForCard(card, [
        (ability: AbilityModel) => {
          return ability.hasAbility(keywordToAbilityPredicate(keyword));
        },
      ])
      .filter((ability) => keywordToAbilityPredicate(keyword)(ability.ability));
  }

  // TODO: Add delayed trigger also
  getTriggeredAbilitiesForCard(
    card: CardModel,
    filter: (ability: { trigger: Trigger }) => boolean,
  ) {
    return this.getAbilitiesForCard(card).filter(
      (model) =>
        model.isStaticTriggeredAbility &&
        staticTriggeredAbilityPredicate(model.ability) &&
        filter(model.ability),
    );
  }

  getAbilitiesForCard(card: CardModel, filters: AbilityFilter[] = []) {
    const nativeAbilities = card.nativeAbilities(filters).filter(
      // Activated abilities are still able to activate even if the conditions are not met
      (ability) => ability.isActivatedAbility || ability.areConditionsMet,
    );
    const staticGainedAbilities = this.getStaticGainedAbilities(card, filters);
    const gainedAbilities =
      this.rootStore.continuousEffectStore.getGainedAbilitiesFromContinuousEffects(
        card,
        filters,
      );

    return [
      ...nativeAbilities,
      ...gainedAbilities,
      ...staticGainedAbilities,
    ].filter(notEmptyPredicate);
  }

  reEvaluateAbilities(hash: string) {
    if (this.evaluatedForHash && this.evaluatedForHash === hash) {
      return;
      // We sometimes call this function with empty hash to force re-evaluate
    }

    // this.rootStore.trace(
    //   `Re-evaluating abilities for hash: ${hash}, previous hash: ${this.evaluatedForHash}`,
    // );

    this.setEvaluatedForHash(hash);
    this.initializeAbilities();
  }

  setEvaluatedForHash(hash: string) {
    if (!hash) {
      return;
    }

    this.evaluatedForHash = hash;
  }

  // See engine/store/resolver/README.md
  private initializeAbilities() {
    if (this.isInitialising) {
      // this.rootStore.trace("Already initialising");
      return;
    }

    runInAction(() => {
      this.evaluatedAbilities = [];
      this.nonEvaluatedAbilities = [];
      this.isInitialising = true;
    });

    try {
      const cardsInPlay = this.rootStore.cardStore.getCardsByTargetFilter([
        { filter: "zone", value: ["play"] },
        { filter: "type", value: ["character", "item", "location"] },
      ]);

      const allNativeAbilities = cardsInPlay.flatMap((card) =>
        card.nativeAbilities([]),
      );

      if (allNativeAbilities.length === 0) {
        return;
      }

      const abilityModels = allNativeAbilities.filter(
        (model) => !(model.isResolutionAbility || model.isRawActivatedAbility),
      );

      runInAction(() => {
        const nonEvaluated = abilityModels.filter(
          (model) => model.shouldDelayEvaluation,
        );
        const abilitiesToEvaluate = abilityModels.filter(
          (model) => !model.shouldDelayEvaluation,
        );

        // Make this to ensure that 'easy' abilities are evaluated first
        this.nonEvaluatedAbilities = [...abilitiesToEvaluate, ...nonEvaluated];
      });

      this.evaluateAllAbilities();
    } finally {
      runInAction(() => {
        this.isInitialising = false;
      });
    }
  }

  // See engine/store/resolver/README.md
  allAbilitiesByFilters(filters: AbilityFilter[] = []) {
    // if (
    //   !this.isInitialising &&
    //   this.evaluatedAbilities.length === 0 &&
    //   this.nonEvaluatedAbilities.length === 0
    // ) {
    //   this.initializeAbilities();
    // }

    return this.evaluatedAbilities.filter((ability) =>
      filters.every((filter) => filter(ability)),
    );
  }
}
