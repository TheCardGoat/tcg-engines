import { delayedTriggeredAbilityPredicate, notEmptyPredicate, } from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import { liloEscapeArtist } from "@lorcanito/lorcana-engine/cards/006";
import { stitchExperiment_626 } from "@lorcanito/lorcana-engine/cards/008";
import { FloatingTriggeredAbilityModel } from "@lorcanito/lorcana-engine/store/models/FloatingTriggeredAbilityModel";
import { TriggeredAbilityModel } from "@lorcanito/lorcana-engine/store/models/TriggeredAbilityModel";
import { getTriggerPredicate, } from "@lorcanito/lorcana-engine/store/resolvers/triggerResolver";
import { makeAutoObservable, toJS } from "mobx";
export class StaticTriggeredStore {
    rootStore;
    observable;
    delayedTriggeredAbilities = [];
    constructor(rootStore, observable) {
        if (observable) {
            makeAutoObservable(this, {
                rootStore: false,
            });
        }
        this.observable = observable;
        this.rootStore = rootStore;
    }
    sync(triggeredAbilities) { }
    // Doing like this to leverage computed properties while not breaking expect toJSON behaviour
    // https://mobx.js.org/computeds.html
    toJSON() {
        if (this.delayedTriggeredAbilities.length === 0) {
            return undefined;
        }
        return toJS(this.delayedTriggeredAbilities.map((effect) => effect.toJSON()));
    }
    getTriggers(trigger, cardTriggered) {
        const predicate = getTriggerPredicate(trigger);
        const delayedTriggers = this.delayedTriggeredAbilities.filter(predicate);
        const triggers = [];
        const cardsByFilter = this.rootStore.cardStore.cardsInPlay
            .concat(
        // Temporary cards are cards that are moving zone during the turn
        this.rootStore.cardStore.getTemporaryCards(this.rootStore.moveCount))
            .filter((card, index, self) => index === self.findIndex((c) => c.instanceId === card.instanceId));
        if (trigger === "start_turn") {
            // TODO: Implement this properly, this is a temporary fix
            const lilosInDiscard = this.rootStore.cardStore
                .getCardsByTargetFilter([
                { filter: "owner", value: this.rootStore.turnPlayer },
                { filter: "zone", value: ["discard"] },
                { filter: "type", value: ["character"] },
                {
                    filter: "attribute",
                    value: "name",
                    comparison: {
                        operator: "eq",
                        value: "Lilo",
                    },
                },
                {
                    filter: "attribute",
                    value: "title",
                    comparison: {
                        operator: "eq",
                        value: "Escape Artist",
                    },
                },
            ])
                .filter((card) => card.ownerId === this.rootStore.turnPlayer);
            if (lilosInDiscard.length > 0) {
                cardsByFilter.push(...lilosInDiscard);
            }
            const stichInDiscard = this.rootStore.cardStore
                .getCardsByTargetFilter([
                { filter: "owner", value: this.rootStore.turnPlayer },
                { filter: "zone", value: ["discard"] },
                { filter: "type", value: ["character"] },
                {
                    filter: "attribute",
                    value: "name",
                    comparison: {
                        operator: "eq",
                        value: "Stitch",
                    },
                },
                {
                    filter: "attribute",
                    value: "title",
                    comparison: {
                        operator: "eq",
                        value: "Experiment 626",
                    },
                },
            ])
                .filter((card) => card.ownerId === this.rootStore.turnPlayer);
            if (stichInDiscard.length > 0) {
                cardsByFilter.push(...stichInDiscard);
            }
        }
        cardsByFilter
            // TODO: This is a temporary fix to avoid triggering abilities for cards that are not in play
            // There shouldnt be any here, but IDK what's going on
            .filter((card) => card.zone === "play" ||
            trigger === "banish" ||
            card.lorcanitoCard.id === liloEscapeArtist.id ||
            card.lorcanitoCard.id === stitchExperiment_626.id)
            .map((card) => {
            for (const model of this.rootStore.effectStore.getTriggeredAbilitiesForCard(card, predicate)) {
                const staticTriggeredAbilityModel = new TriggeredAbilityModel(model, card, 
                // Some triggers happen due to events, like start and ending turn.
                cardTriggered || card, this.rootStore, this.observable);
                triggers.push(staticTriggeredAbilityModel);
            }
        });
        const staticTriggers = triggers.filter(predicate);
        return [...staticTriggers, ...delayedTriggers];
    }
    trigger(trigger, target, params = {}) {
        // This is required to revalidate abilities that depend on the card being exerted
        this.rootStore.effectStore.reEvaluateAbilities("");
        const allTriggers = this.getTriggers(trigger, target);
        const validTriggers = allTriggers.filter((ability) => {
            ability.replaceDynamicTargets(params);
            const debug = false;
            const isValidTarget = ability.isValidTriggerTarget(target, params, debug);
            const meetsConditions = ability.meetTriggerConditions();
            if (debug) {
                this.rootStore.debug(`Ability from ${ability.cardSource?.name}: ` +
                    `isValidTarget: ${isValidTarget}, ` +
                    `meetsConditions: ${meetsConditions}, ` +
                    `target: ${target?.name}, ` +
                    `params: ${JSON.stringify(params)}, ` +
                    `trigger: ${JSON.stringify(ability.trigger)}`);
            }
            return isValidTarget && meetsConditions;
        });
        this.rootStore.debug(`Triggering: ${trigger} for target: ${target?.name}, Found ${allTriggers.length} triggers, Filtered to ${validTriggers.length} triggers`);
        for (const ability of validTriggers) {
            ability.replaceTriggerSourceAndTarget({
                ...params,
                triggerSource: ability.cardSource,
                triggerTarget: target,
            });
            // Some triggers happen due to events, like start and ending turn. So they don't have a target
            ability.activate(target || ability.cardSource, {
                ...params,
                skipAutoResolve: validTriggers.length > 1,
                // We should skip auto resolve if there's something on the stack
                // this.rootStore.stackLayerStore.length > 0,
            });
        }
    }
    onBanish(banishedCard, params = {}) {
        this.trigger("banish", banishedCard, params);
        this.trigger("banish-another", banishedCard, params);
    }
    onChallenge(attacker, defender) {
        this.trigger("challenge", defender, { attacker, defender });
    }
    onEnterLocation(character, location, previousLocation) {
        this.trigger("moves-to-a-location", character, {
            location,
            previousLocation,
        });
    }
    onQuest(card) {
        this.trigger("quest", card);
    }
    onDamage(trigger, params) {
        this.trigger("damage", trigger, {
            dynamicAmount: params.amount,
            damageSource: params.damageSource,
            isChallenge: params.isChallenge,
            attacker: params.attacker,
            defender: params.defender,
        });
    }
    onHeal({ target, amount, triggeredBy, }) {
        this.trigger("heal", target, { dynamicAmount: amount, triggeredBy });
    }
    onDiscard(discarded) {
        this.trigger("discard", discarded);
    }
    onPutIntoInkwell(card) {
        this.trigger("inkwell", card);
    }
    onDraw(cardDraw, source) {
        this.trigger("draw", cardDraw);
    }
    onReady(card) {
        this.trigger("ready", card);
    }
    onLeavePlay(trigger, destination, from) {
        this.trigger("leave", trigger, { destination, from });
    }
    onPlay(card, params) {
        this.trigger("play", card, {
            hasShifted: params?.hasShifted,
            singing: params?.singing,
            song: params?.song
                ? this.rootStore.cardStore.getCard(params.song)
                : undefined,
            singers: params?.singers
                ? params.singers
                    .map((card) => this.rootStore.cardStore.getCard(card))
                    .filter(notEmptyPredicate)
                : undefined,
        });
    }
    onShift(card, params) {
        this.trigger("shift", card, params);
    }
    onExert(card) {
        this.trigger("exert", card);
    }
    onSing(singer, song) {
        this.trigger("sing", song, { song, singer });
    }
    onEndOfTurn(playerId) {
        this.trigger("end_turn", undefined, { playerId });
    }
    onStartOfTurn(playerId) {
        this.trigger("start_turn", undefined, { playerId });
    }
    startDelayedAbility(model) {
        const ability = model.ability;
        const source = model.source;
        if (!delayedTriggeredAbilityPredicate(ability)) {
            console.log("Invalid DelayedTriggeredAbility");
            return;
        }
        let duration = ability.duration;
        if (typeof duration === "string") {
            duration =
                ability.duration === "turn"
                    ? this.rootStore.turnCount
                    : this.rootStore.turnCount + 1;
        }
        this.delayedTriggeredAbilities.push(new FloatingTriggeredAbilityModel(`${this.delayedTriggeredAbilities.length + 1}-${source.instanceId}-${ability.name}`, ability, source, duration, this.rootStore, this.observable));
    }
    stopDelayedEffect(abilityModel) {
        const effects = this.delayedTriggeredAbilities || [];
        const index = effects.findIndex((element) => element.id === abilityModel.id);
        if (index !== -1) {
            effects.splice(index, 1);
        }
    }
    onTurnPassed(turn) {
        for (const effect of this.delayedTriggeredAbilities) {
            if (effect.duration !== undefined && effect.duration < turn) {
                this.stopDelayedEffect(effect);
            }
        }
    }
}
//# sourceMappingURL=StaticTriggeredStore.js.map