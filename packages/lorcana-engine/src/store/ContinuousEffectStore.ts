import { AbilityModel } from "@lorcanito/lorcana-engine";
import { notEmptyPredicate } from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import {
  type ContinuousEffect,
  damageDealtRestrictionEffectPredicate,
  damageRemovalRestrictionEffectPredicate,
  replacementEffectPredicate,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import { ContinuousEffectModel } from "@lorcanito/lorcana-engine/store/models/ContinuousEffectModel";
import { EffectModel } from "@lorcanito/lorcana-engine/store/models/EffectModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import {
  doesEffectTargetPlayer,
  isValidPlayerEffectTarget,
} from "@lorcanito/lorcana-engine/store/resolvers/targetsResolver";
import { mapContinuousEffectToAbility } from "@lorcanito/lorcana-engine/store/utils";
import { makeAutoObservable, toJS } from "mobx";

export class ContinuousEffectStore {
  continuousEffects: ContinuousEffectModel[];

  private readonly rootStore: MobXRootStore;
  private readonly observable: boolean;

  constructor(
    initialState: ContinuousEffect[] = [],
    rootStore: MobXRootStore,
    observable: boolean,
  ) {
    if (observable) {
      makeAutoObservable<ContinuousEffectStore, "dependencies" | "rootStore">(
        this,
        {
          rootStore: false,
          dependencies: false,
        },
      );
    }
    this.observable = observable;
    this.rootStore = rootStore;

    this.continuousEffects = [];
    this.sync(initialState);
  }

  sync(effects: ContinuousEffect[] = []) {
    if (!effects) {
      this.continuousEffects = [];
      return;
    }

    const rootStore = this.rootStore;
    this.continuousEffects = effects.map((effect) => {
      const { id, source, target, duration } = effect;

      const cardSource = rootStore.cardStore.getCard(source);
      const cardTarget = target ? rootStore.cardStore.getCard(target) : null;
      const playerTarget = effect.playerTarget;
      const responder = "self";

      const effectModel = new EffectModel(
        effect.effect,
        cardSource as CardModel, // TODO: CardNotFound issue,
        responder,
        rootStore,
        this.observable,
      );
      return new ContinuousEffectModel({
        id,
        source: cardSource as CardModel, // TODO: CardNotFound issue
        target: cardTarget || null, // TODO: CardNotFound issue
        playerTarget,
        duration,
        effect: effectModel,
        filters: effect.filters || [],
        rootStore,
        observable: this.observable,
      });
    });
  }

  // Doing like this to leverage computed properties while not breaking expect toJSON behaviour
  // https://mobx.js.org/computeds.html
  toJSON(): ContinuousEffect[] | undefined {
    if (this.continuousEffects.length === 0) {
      return undefined;
    }

    return toJS(this.continuousEffects.map((effect) => effect.toJSON()));
  }

  startContinuousEffect(effect: ContinuousEffectModel) {
    if (effect.isNonAccumulative()) {
      const equivalentEffect = this.continuousEffects.find((existingEffect) =>
        existingEffect.isEquivalent(effect),
      );

      if (equivalentEffect) {
        this.rootStore.trace(`Continuous effect already exists: ${effect.id}`);

        return;
      }
    }

    this.rootStore.trace(
      `Starting continuous effect ${effect.source?.name} on ${effect.target?.name} for ${JSON.stringify(effect.duration)} (current turn: ${this.rootStore.turnCount}): ${JSON.stringify(effect)}`,
    );
    this.continuousEffects.push(effect);
  }

  stopContinuousEffect(effect: ContinuousEffectModel) {
    const effects = this.continuousEffects || [];
    const index = effects.findIndex((element) => element.id === effect.id);
    if (index !== -1) {
      effects.splice(index, 1);
    }
  }

  get length() {
    return this.continuousEffects.length;
  }

  findContinuousEffect(id: string): ContinuousEffectModel | undefined {
    return this.continuousEffects.find((effect) => effect.id === id);
  }

  onPlay(card: CardModel) {
    this.continuousEffects
      .filter((continuous) =>
        replacementEffectPredicate(continuous.effect.effect),
      )
      .forEach((continuous) => continuous.cardPlayed(card));
  }

  onLeave(card: CardModel) {
    const continuousEffectModels = this.continuousEffects.filter(
      (continuous) => continuous.target?.instanceId === card.instanceId,
    );

    // iterate the array in reverse order
    // so we can remove items without breaking the loop
    for (let i = continuousEffectModels.length - 1; i >= 0; i--) {
      const effect = continuousEffectModels[i];
      if (effect?.target?.instanceId === card?.instanceId) {
        this.rootStore.trace(
          `Continuous effect expired: ${effect.id} ${JSON.stringify(effect.duration)}`,
        );
        this.stopContinuousEffect(effect);
      }
    }
  }

  onTurnPassed(turn: number) {
    // iterate the array in reverse order
    // so we can remove items without breaking the loop
    for (let i = this.continuousEffects.length - 1; i >= 0; i--) {
      const effect = this.continuousEffects[i];
      if (
        // turn can be 0
        effect?.duration?.turn !== undefined &&
        effect?.duration?.turn < turn
      ) {
        this.rootStore.trace(
          `Continuous effect expired: ${effect.id} ${JSON.stringify(effect.duration)}`,
        );
        this.stopContinuousEffect(effect);
      }
    }
  }

  onChallenge(attacker: CardModel, defender: CardModel) {}

  onChallengeFinished() {
    // iterate the array in reverse order
    // so we can remove items without breaking the loop
    for (let i = this.continuousEffects.length - 1; i >= 0; i--) {
      const effect = this.continuousEffects[i];
      if (effect?.duration?.challenge) {
        console.log(
          `During Challenge Continuous effect expired: ${effect.id} ${JSON.stringify(effect.duration)}`,
        );
        this.stopContinuousEffect(effect);
      }
    }
  }

  findContinuousEffectsByCard(card: CardModel): ContinuousEffectModel[] {
    return this.continuousEffects
      .filter((effect) => effect.target?.instanceId === card.instanceId)
      .filter((effect) => effect.isValid(card));
  }

  // TODO: Untangle this
  getGainedAbilitiesFromContinuousEffects(
    card: CardModel,
    filters: Array<(ability: AbilityModel) => boolean | undefined>,
  ) {
    return this.findContinuousEffectsByCard(card)
      .filter((effect) => effect.effect.type === "ability")
      .map((effect) => {
        const ability = mapContinuousEffectToAbility(effect);
        if (ability) {
          const abilityModel = new AbilityModel(
            ability,
            card,
            this.rootStore,
            this.observable,
          );

          abilityModel.comingFrom = effect.source;

          return abilityModel;
        }
      })
      .filter(notEmptyPredicate)
      .filter((ability) => filters.every((filter) => filter(ability)));
  }

  getQuestRestriction(card: CardModel) {
    return this.rootStore.continuousEffectStore.continuousEffects
      .filter((continuous) => {
        const effect = continuous.effect.effect;
        return effect.type === "restriction" && effect.restriction === "quest";
      })
      .filter((continuous) => {
        return continuous.target?.instanceId === card.instanceId;
      });
  }

  getDamageRemovalRestriction(card: CardModel) {
    return this.rootStore.continuousEffectStore.continuousEffects
      .filter((continuous) => {
        const effect = continuous.effect.effect;
        return damageRemovalRestrictionEffectPredicate(effect);
      })
      .filter((continuous) => {
        return continuous.target?.instanceId === card.instanceId;
      });
  }

  getDamageDealtRestriction(card: CardModel) {
    return this.rootStore.continuousEffectStore.continuousEffects
      .filter((continuous) => {
        const effect = continuous.effect.effect;
        return damageDealtRestrictionEffectPredicate(effect);
      })
      .filter((continuous) => {
        return continuous.target?.instanceId === card.instanceId;
      });
  }

  getChallengeRestriction(card: CardModel) {
    return this.rootStore.continuousEffectStore.continuousEffects
      .filter((continuous) => {
        const effect = continuous.effect.effect;
        return (
          effect.type === "restriction" && effect.restriction === "challenge"
        );
      })
      .filter((continuous) => {
        return continuous.target?.instanceId === card.instanceId;
      });
  }

  getChallengeCharactersRestriction(card: CardModel) {
    return this.rootStore.continuousEffectStore.continuousEffects
      .filter((continuous) => {
        const effect = continuous.effect.effect;
        return (
          effect.type === "restriction" &&
          effect.restriction === "challenge-characters"
        );
      })
      .filter((continuous) => {
        return continuous.target?.instanceId === card.instanceId;
      });
  }

  getExertRestriction(card: CardModel) {
    return this.rootStore.continuousEffectStore.continuousEffects
      .filter((continuous: ContinuousEffectModel) => {
        const effect = continuous.effect.effect;
        return (
          effect.type === "restriction" &&
          effect.restriction === "ready-at-start-of-turn"
        );
      })
      .filter((continuous) => {
        return continuous.target?.instanceId === card.instanceId;
      });
  }

  getPlayerEffects(playerId: string) {
    return this.rootStore.continuousEffectStore.continuousEffects
      .filter((continuous) => doesEffectTargetPlayer(continuous.effect.effect))
      .filter((continuous: ContinuousEffectModel) =>
        isValidPlayerEffectTarget(
          continuous.source,
          continuous.effect.effect,
          playerId,
        ),
      );
  }

  moveEffectsToCard(param: { from: CardModel; to: CardModel }) {
    this.findContinuousEffectsByCard(param.from).forEach((effect) => {
      effect.changeTarget(param.to);
    });
  }
}
