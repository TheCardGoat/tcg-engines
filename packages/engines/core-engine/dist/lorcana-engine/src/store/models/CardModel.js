import { AbilityModel, activatedAbilityPredicate, allCardsById, CardMetaModel, challengerAbilityPredicate, gainStaticAbilityPredicate, notEmptyPredicate, protectionEffectPredicate, resistAbilityPredicate, shiftAbilityPredicate, singerAbilityPredicate, } from "@lorcanito/lorcana-engine";
import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { alternateCostAbilityPredicate, reverseChallengerAbilityPredicate, } from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import { gantuExperiencedEnforcer } from "@lorcanito/lorcana-engine/cards/007";
import { beChallengedRestrictionEffectPredicate } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { canPayCosts, payCosts, } from "@lorcanito/lorcana-engine/store/resolvers/costResolver";
import { createTargetFiltersPredicate } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
import { computed, makeAutoObservable } from "mobx";
import { isConditionMet } from "../resolvers/conditionResolver";
import { extraSafeJSONStringify } from "../utils";
export class CardModel {
    instanceId;
    publicId;
    meta;
    ownerId;
    // For now, you should use getAbilities
    abilities;
    rootStore;
    observable;
    constructor(instanceId, cardId, meta, ownerId, rootStore, observable) {
        this.rootStore = rootStore;
        this.observable = observable;
        if (observable) {
            makeAutoObservable(this, {
                rootStore: false,
                getNativeAbilities: computed,
            });
        }
        this.instanceId = instanceId;
        this.publicId = cardId;
        this.meta = new CardMetaModel(meta, observable, this.rootStore);
        this.ownerId = ownerId;
        this.abilities =
            this.lorcanitoCard.abilities
                ?.map((ability) => {
                if (!(ability && "type" in ability)) {
                    return undefined;
                }
                return new AbilityModel(ability, this, rootStore, observable);
            })
                .filter(notEmptyPredicate) || [];
    }
    isCard(card) {
        return card?.instanceId === this.instanceId;
    }
    get isDead() {
        if (this.zone === "discard") {
            return true;
        }
        if (this.zone !== "play") {
            return false;
        }
        if (this.type !== "character" && this.type !== "location") {
            return false;
        }
        return this.damage >= this.willpower;
    }
    get inkwell() {
        const hiddenInkCastersInPlay = this.rootStore.tableStore
            .getTable(this.ownerId)
            .zones.play.cards.filter((card) => card.fullName.toLowerCase() === "hidden inkcaster").length;
        if (hiddenInkCastersInPlay) {
            return true;
        }
        return !!this.lorcanitoCard?.inkwell;
    }
    get isSong() {
        return !!this.lorcanitoCard?.characteristics.includes("song");
    }
    get name() {
        const card = this.lorcanitoCard;
        return card?.name || "";
    }
    get title() {
        const card = this.lorcanitoCard;
        return card?.title || "";
    }
    get fullName() {
        const card = this.lorcanitoCard;
        return `${card?.name}${card?.title ? ` - ${card.title}` : ""}`;
    }
    get color() {
        const card = this.lorcanitoCard;
        return card?.colors[0];
    }
    discard() {
        this.moveTo("discard", { discard: true });
    }
    banish(params = {}) {
        this.moveTo("discard", params);
    }
    // Move will ignore restrictions
    moveTo(zone, opts = {}) {
        this.rootStore.tableStore.move(this, zone, opts);
        return this.rootStore.moveResponse(true);
    }
    matchesTargetFilter(filters, expectedOwner = "", effectSource, params) {
        const predicate = createTargetFiltersPredicate(this.rootStore, expectedOwner, filters, effectSource, undefined, // TODO: This is probably wrong
        params);
        return predicate(this);
    }
    get canPutIntoInkwell() {
        return this.inkwell;
    }
    addToInkwell() {
        return this.rootStore.tableStore.addToInkwell(this.instanceId);
    }
    get isRevealed() {
        return !!this.meta.revealed;
    }
    get isDry() {
        return !this.meta.playedThisTurn;
    }
    revealCard() {
        this.updateCardMeta({ revealed: true });
        this.rootStore.log({
            type: "REVEAL_CARD",
            card: this.instanceId,
            from: this.zone,
            player: this.ownerId,
        });
        return this.rootStore.moveResponse(true);
    }
    reveal() {
        this.updateCardMeta({ revealed: true });
        this.rootStore.log({
            type: "REVEAL_CARD",
            player: this.ownerId,
            card: this.instanceId,
            from: this.zone,
        });
    }
    hide(opts = {}) {
        this.updateCardMeta({ revealed: undefined });
        if (!opts.skipLog) {
            this.rootStore.log({
                type: "HIDE_CARD",
                player: this.ownerId,
                cards: [this.instanceId],
                from: this.zone,
            });
        }
    }
    get zone() {
        // This potentially returns undefined
        return this.rootStore.tableStore.findCardZone(this);
    }
    applyShiftCostModifiers(initialCost = 0) {
        const modifier = this.rootStore.effectStore.getShiftModifier(this);
        const costAttributeModifier = this.rootStore.effectStore.getCostAttributeModifier(this);
        const shiftCost = (initialCost || 0) - modifier + costAttributeModifier;
        return shiftCost <= 0 ? 0 : shiftCost;
    }
    applyCostModifier(initialCost = 0) {
        const modifier = this.rootStore.effectStore.getCostModifier(this);
        const costAttributeModifier = this.rootStore.effectStore.getCostAttributeModifier(this);
        const cost = (initialCost || 0) - modifier + costAttributeModifier;
        return cost <= 0 ? 0 : cost;
    }
    canPayShiftCosts(cardCosts = []) {
        return canPayCosts(this.shiftCosts, cardCosts, this, this.rootStore);
    }
    canPayCosts(costs, targets = [], payingPlayer) {
        return canPayCosts(costs, targets, this, this.rootStore, payingPlayer);
    }
    get cost() {
        return this.applyCostModifier(this.lorcanitoCard.cost);
    }
    get singerCost() {
        const singerAbility = this.rootStore.effectStore.getAbilitiesForCard(this, [
            (ability) => ability.isSingAbility,
        ])[0];
        let cardSingCost = this.lorcanitoCard?.cost || 0;
        const ability = singerAbility?.ability;
        if (singerAbilityPredicate(ability)) {
            cardSingCost = ability.value;
        }
        const singCostModifier = this.rootStore.effectStore.getSingCostModifier(this);
        const finalValue = cardSingCost + singCostModifier;
        if (finalValue <= 0) {
            return 0;
        }
        return finalValue;
    }
    // There are effects that modify sing cost, without modifying the card cost
    get singCost() {
        return this.lorcanitoCard.cost;
    }
    get shiftInkCost() {
        return this.shiftCosts.find((cost) => cost.type === "ink")?.amount || 0;
    }
    get shiftCosts() {
        const card = this.lorcanitoCard;
        const shiftAbility = card?.abilities?.find(shiftAbilityPredicate);
        if (shiftAbilityPredicate(shiftAbility)) {
            const inkCost = shiftAbility.costs.find((cost) => cost.type === "ink");
            return inkCost
                ? [
                    {
                        type: "ink",
                        amount: this.applyShiftCostModifiers(inkCost.amount),
                    },
                ]
                : shiftAbility.costs;
        }
        return [];
    }
    get shiftCostAsText() {
        // @ts-expect-error TODO: fix this, this is pure lazy work
        return this.applyCostModifier(this.shiftCosts[0]?.amount || 0);
    }
    get lorcanitoCard() {
        const card = allCardsById[this.publicId];
        if (!card) {
            console.error("Card not found", this.publicId);
            throw Error("Card not found");
        }
        return card;
    }
    get resolutionAbilities() {
        return this.rootStore.effectStore.getResolutionAbilitiesForCard(this);
    }
    get lore() {
        const cardLore = this.lorcanitoCard?.lore || 0;
        const loreModifier = this.rootStore.effectStore.getLoreModifier(this);
        const finalValue = cardLore + loreModifier;
        if (finalValue <= 0) {
            return 0;
        }
        if (Number.isNaN(finalValue)) {
            return 0;
        }
        return finalValue;
    }
    get moveCost() {
        const cardMoveCost = this.lorcanitoCard?.moveCost || 0;
        const cardMoveCostModifier = this.rootStore.effectStore.getMoveCostModifier(this);
        const finalValue = cardMoveCost + cardMoveCostModifier;
        if (finalValue <= 0) {
            return 0;
        }
        return finalValue;
    }
    get challengerBonus() {
        return this.getStaticAbility("challenger")
            .map((model) => model.ability)
            .reduce((acc, ability) => {
            if (challengerAbilityPredicate(ability)) {
                return acc + ability.value;
            }
            return acc;
        }, 0);
    }
    temporaryStrength(evaluatedAbilities = []) {
        if (this.type !== "character") {
            return 0;
        }
        const original = this.lorcanitoCard?.strength || 0;
        const strengthModifier = this.rootStore.effectStore.getStrengthModifier(this);
        const finalValue = original + strengthModifier;
        if (finalValue <= 0) {
            return 0;
        }
        return finalValue;
    }
    get strength() {
        if (this.type !== "character") {
            return 0;
        }
        const original = this.lorcanitoCard?.strength || 0;
        const strengthModifier = this.rootStore.effectStore.getStrengthModifier(this);
        const finalValue = original + strengthModifier;
        if (finalValue <= 0) {
            return 0;
        }
        return finalValue;
    }
    get challengeTimeAttackerStrength() {
        if (this.type !== "character") {
            return 0;
        }
        const original = this.lorcanitoCard?.strength || 0;
        const strengthModifier = this.rootStore.effectStore.getStrengthModifier(this);
        const totalWithModifiersAndChallenger = original + strengthModifier + this.challengerBonus;
        const finalValue = Math.max(0, totalWithModifiersAndChallenger);
        return finalValue;
    }
    get challengeTimeDefenderStrength() {
        if (this.type !== "character") {
            return 0;
        }
        const original = this.lorcanitoCard?.strength || 0;
        const strengthModifier = this.rootStore.effectStore.getStrengthModifier(this);
        let totalWithModifiers = original + strengthModifier;
        const reverseChallengerAbility = this.rootStore.effectStore.getAbilitiesForCard(this, [
            (ability) => ability.isReverseChallengerAbility,
        ])[0]?.ability;
        if (reverseChallengerAbilityPredicate(reverseChallengerAbility)) {
            totalWithModifiers += reverseChallengerAbility.value;
        }
        const finalValue = Math.max(0, totalWithModifiers);
        return finalValue;
    }
    get willpower() {
        const original = this.lorcanitoCard?.willpower || 0;
        const modifier = this.rootStore.effectStore.getWillPowerModifier(this);
        const finalValue = original + modifier;
        if (finalValue <= 0) {
            return 0;
        }
        return finalValue;
    }
    get characteristics() {
        return this.lorcanitoCard.characteristics;
    }
    updateCardMeta(meta) {
        if (this.meta.exerted === true && meta.exerted === false) {
            this.rootStore.triggeredStore.onReady(this);
        }
        this.meta.update(meta);
    }
    get getNativeAbilities() {
        return this.nativeAbilities([]);
    }
    get alternativeCosts() {
        const find = this.getNativeAbilities.find((model) => alternateCostAbilityPredicate(model.ability));
        if (alternateCostAbilityPredicate(find?.ability)) {
            return find?.ability?.alternativeCosts;
        }
        return undefined;
    }
    nativeAbilities(filters = [], convertGainedAbilities = false) {
        return this.abilities
            .filter((ability) => filters.every((filter) => filter(ability)))
            .map((model) => {
            const ability = model.ability;
            if (convertGainedAbilities && gainStaticAbilityPredicate(ability)) {
                return new AbilityModel({ ...ability.gainedAbility, conditions: ability.conditions }, model.source, this.rootStore, this.observable);
            }
            return model;
        });
    }
    getActivatedAbility(abilityName) {
        return this.rootStore.effectStore.getActivatedAbilityForCard(this, abilityName);
    }
    get activatedAbilities() {
        return this.rootStore.effectStore.getAbilitiesForCard(this, [
            (ability) => ability.isActivatedAbility,
        ]);
    }
    get hasActivatedAbility() {
        return !!this.getActivatedAbility();
    }
    getOwnEffects(filters = []) {
        return this.rootStore.effectStore
            .getAbilitiesForCard(this, filters)
            .flatMap((model) => model.effects);
    }
    getStaticAbility(keyword) {
        return this.rootStore.effectStore.getStaticAbilitiesForCard(this, keyword);
    }
    hasAbility(keyword) {
        return !!this.getStaticAbility(keyword)[0];
    }
    get hasShift() {
        return this.hasAbility("shift");
    }
    get hasBodyguard() {
        return this.hasAbility("bodyguard");
    }
    get hasSupport() {
        return this.hasAbility("support");
    }
    get hasReckless() {
        return this.hasAbility("reckless");
    }
    get hasSingTogether() {
        return this.hasAbility("sing-together");
    }
    get hasProtector() {
        return this.hasAbility("protector");
    }
    get hasRush() {
        return this.hasAbility("rush");
    }
    get hasResist() {
        return (this.getStaticAbility("resist").filter((ability) => resistAbilityPredicate(ability.ability) &&
            !ability.ability.onlyWhileChallenge).length > 0);
    }
    get hasEvasive() {
        return this.hasAbility("evasive");
    }
    get hasWard() {
        return this.hasAbility("ward");
    }
    get hasVanish() {
        return this.hasAbility("vanish");
    }
    get hasChallenger() {
        return this.hasAbility("challenger");
    }
    get hasSinger() {
        return this.hasAbility("singer");
    }
    get hasVoiceless() {
        return this.hasAbility("voiceless");
    }
    get exerted() {
        return !!this.meta.exerted;
    }
    get playConditions() {
        return this.abilities.filter((ability) => ability.type === "play-condition");
    }
    get hasPlayConditions() {
        return this.playConditions.length > 0;
    }
    exert({ skipTriggers } = {}) {
        const wasExerted = this.exerted;
        this.updateCardMeta({ exerted: true });
        if (!skipTriggers && wasExerted !== this.exerted) {
            this.rootStore.triggeredStore.onExert(this);
        }
    }
    get ready() {
        return !this.exerted;
    }
    // TODO: I must move onReady to this function, it's currenty inside updateMeta
    readyCharacter() {
        this.updateCardMeta({ exerted: false });
        // this.rootStore.triggeredStore.onReady(this);
    }
    get hasAtStartOfTurnReadyRestriction() {
        const opponent = this.rootStore.opponentPlayer(this.ownerId);
        const genieMainAttraction = this.rootStore
            .getPlayerZone(opponent, "play")
            ?.cards.find((card) => card.fullName.toLowerCase() ===
            "Genie - Main Attraction".toLowerCase());
        const geniePreventing = genieMainAttraction && !genieMainAttraction.ready;
        const cardEffects = this.rootStore.effectStore.getAbilitiesForCard(this, [
            (ability) => ability.hasReadyAtStartOfTurnPreventionEffect &&
                ability.canTargetCard(this),
        ]);
        return geniePreventing || cardEffects.length > 0;
    }
    get hasQuestRestriction() {
        if (this.hasReckless) {
            return true;
        }
        const questRestriction = this.rootStore.continuousEffectStore.getQuestRestriction(this);
        const staticQuestRestriction = this.rootStore.effectStore.hasQuestRestriction(this);
        return questRestriction.length > 0 || !!staticQuestRestriction;
    }
    get hasDamageRemovalRestriction() {
        return !!this.damageRemovalRestrictionAbilitySource;
    }
    get hasDamageDealtRestriction() {
        return !!this.damageDealtRestrictionAbilitySource;
    }
    get damageRemovalRestrictionAbilitySource() {
        const continuousRestrictions = this.rootStore.continuousEffectStore.getDamageRemovalRestriction(this);
        if (continuousRestrictions?.[0]) {
            return continuousRestrictions[0].source;
        }
        const staticRestrictions = this.rootStore.effectStore.damageRemovalRestrictionEffect(this);
        if (staticRestrictions?.[0]) {
            return staticRestrictions[0].source;
        }
        return undefined;
    }
    get damageDealtRestrictionAbilitySource() {
        const continuousRestrictions = this.rootStore.continuousEffectStore.getDamageDealtRestriction(this);
        if (continuousRestrictions?.[0]) {
            return continuousRestrictions[0].source;
        }
        const staticRestrictions = this.rootStore.effectStore.damageDealtRestrictionEffect(this);
        if (staticRestrictions?.[0]) {
            return staticRestrictions[0].source;
        }
        return undefined;
    }
    quest() {
        const table = this.rootStore.tableStore.getTable(this.ownerId);
        if (!this.ready || this.type !== "character") {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Glimmer can't quest",
                message: `Glimmer's exerted, you can use manual mode to simulate a quest`,
                icon: "warning",
                autoClear: true,
            });
        }
        if (this.hasQuestRestriction || this.meta.playedThisTurn) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Glimmer can't quest",
                message: "You can use manual mode to simulate a quest",
                icon: "warning",
                autoClear: true,
            });
        }
        if (table) {
            table.updateLore(table.lore + this.lore);
            this.exert();
        }
        this.rootStore.tableStore.getTable(this.ownerId).onQuest(this);
        this.rootStore.triggeredStore.onQuest(this);
        if (this.hasSupport) {
            const supportEffect = getSupportEffect(this.strength);
            this.rootStore.stackLayerStore.addAbilityToStack(new AbilityModel(supportEffect, this, this.rootStore, this.observable), this);
        }
        return this.rootStore.moveResponse(true);
    }
    gainLocationLore() {
        if (this.zone !== "play" || this.type !== "location") {
            return;
        }
        const table = this.rootStore.tableStore.getTable(this.ownerId);
        if (table) {
            table.updateLore(table.lore + this.lore);
        }
        return this.rootStore.log({
            type: "GAIN_LOCATION_LORE",
            player: this.ownerId,
            location: this.instanceId,
            lore: this.lore,
        });
    }
    // TODO: This check should return whether the card is the shifted card, not if it is the shifter
    get isShiftedCharacter() {
        return !!this.meta.shifter;
    }
    get shiftedCharacter() {
        return this.meta.shifted
            ? this.rootStore.cardStore.getCard(this.meta.shifted)
            : undefined;
    }
    canShiftInto(shifted) {
        if (!shifted) {
            return false;
        }
        const shiftCost = this.shiftCosts;
        const isAlreadyShifted = shifted.meta?.shifter;
        if (isAlreadyShifted || !shiftCost) {
            return false;
        }
        if (shifted.fullName.toLowerCase() === "morph - space goo") {
            return true;
        }
        if (this.fullName.toLowerCase() === "baymax - giant robot") {
            return true;
        }
        if (shifted.fullName.toLowerCase() === "turbo - royal hack" &&
            this.name.toLowerCase() === "king candy") {
            return true;
        }
        if (this.fullName.toLowerCase() === "thunderbolt - wonder dog" &&
            shifted.characteristics.some((char) => char.toLowerCase() === "puppy")) {
            return true;
        }
        const shiftAbility = this.getStaticAbility("shift");
        if (shiftAbility.some((model) => shiftAbilityPredicate(model.ability) &&
            model.ability.additionalNames?.some((name) => extraSafeJSONStringify(name.toLowerCase()) ===
                extraSafeJSONStringify(shifted.name.toLowerCase())))) {
            return true;
        }
        return (extraSafeJSONStringify(this?.lorcanitoCard.name.toLowerCase()) ===
            extraSafeJSONStringify(shifted?.lorcanitoCard.name.toLowerCase()));
    }
    shift(target, costs) {
        if (!target) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Can't shift",
                message: "You must select a target to shift into",
                icon: "warning",
                autoClear: true,
            });
        }
        return this.rootStore.cardStore.shiftCard(this, target, costs);
    }
    play(params) {
        return this.rootStore.stateMachineStore.startPlayCard(this.instanceId, this.ownerId, {
            ...params,
            alternativeCosts: params?.alternativeCosts?.map((card) => card.instanceId),
            singers: params?.singers?.map((card) => card.instanceId),
            song: params?.song?.instanceId,
        });
    }
    onPlay(params) {
        this.rootStore.stateMachineStore.setPlayCardStep("RESOLVE_EFFECTS", this.instanceId, this.ownerId, params);
        return this.rootStore.stateMachineStore.progressPlayCard();
    }
    playingCardRestrictions(params = {}) {
        const hasBodyGuard = this.hasBodyguard;
        const alternativeCosts = params?.alternativeCosts
            ?.map((id) => this.rootStore.cardStore.getCard(id))
            .filter(notEmptyPredicate) || [];
        // if (hasBodyGuard && params?.bodyguard === undefined) {
        //   const notification: NotificationType = {
        //     type: "icon",
        //     title: "You must choose bodyguard option",
        //     message: "This character has bodyguard, you must choose an option",
        //     icon: "warning",
        //     autoClear: true,
        //   };
        //   return this.rootStore.sendNotification(notification);
        // }
        const ownerTable = this.rootStore.tableStore.getTable(this.ownerId);
        if (!params?.forFree) {
            if (this.alternativeCosts && params.alternativeCosts) {
                if (!this.canPayCosts(this.alternativeCosts, alternativeCosts, this.ownerId)) {
                    const notification = {
                        type: "icon",
                        title: "Unable to pay alternative costs",
                        message: `If you think this is a mistake, right click the card and select "Move to Play Area"`,
                        icon: "warning",
                        autoClear: true,
                    };
                    return this.rootStore.sendNotification(notification);
                }
            }
            else if (!ownerTable?.canPayInkCost(this)) {
                const notification = {
                    type: "icon",
                    title: "Not enough ink",
                    message: `If you think this is a mistake, right click the card and select "Move to Play Area"`,
                    icon: "warning",
                    autoClear: true,
                };
                return this.rootStore.sendNotification(notification);
            }
        }
        if (this.hasPlayConditions) {
            const unmetConditions = this.playConditions.filter((ability) => !isConditionMet(this.rootStore, this, ability.conditions));
            if (unmetConditions.length > 0) {
                const unmetConditionsText = unmetConditions
                    .map((condition) => condition.text)
                    .join("\n");
                const notification = {
                    type: "icon",
                    title: "Can't play this card",
                    message: `You must meet the play conditions. Unmet conditions:\n${unmetConditionsText}`,
                    icon: "warning",
                    autoClear: true,
                };
                return this.rootStore.sendNotification(notification);
            }
        }
        const isPlayerRestricted = this.rootStore.effectStore.hasRestrictionToPlayActionCard(this);
        if (!!isPlayerRestricted && this.type === "action") {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "You can't play this card",
                message: "there's a restriction that prevents you from playing this card",
                icon: "warning",
                autoClear: true,
            });
        }
    }
    playFromHand(params) {
        if (this.zone !== "hand" && !params?.forFree) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Can't play this card",
                message: "This card is not in your hand",
                icon: "warning",
                autoClear: true,
            });
        }
        return this.play(params);
    }
    get hasSingRestriction() {
        return this.hasVoiceless;
    }
    get canSing() {
        if (this.type !== "character") {
            return false;
        }
        if (this.meta.playedThisTurn || !this.ready || this.hasSingRestriction) {
            return false;
        }
        return true;
    }
    canSingASong(song) {
        if (!this.canSing) {
            return false;
        }
        if (!song?.lorcanitoCard.characteristics?.includes("song")) {
            return false;
        }
        const singer = this.singerCost;
        let finalCost = song?.cost;
        // TODO: This is a hacky way to check if Gantu is in play
        // Gantu doesn't increase sing cost, so we're offsetting the increase here
        const gantus = this.rootStore.cardStore.cardsInPlay.filter((card) => card.publicId === gantuExperiencedEnforcer.id);
        if (gantus.length) {
            finalCost = finalCost - gantus.length * 2;
        }
        if (singer) {
            return singer >= finalCost;
        }
        return this.cost >= finalCost;
    }
    sing(song) {
        if (!song) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Can't sing",
                message: "You must select a song to sing",
                icon: "warning",
                autoClear: true,
            });
        }
        if (this.type !== "character") {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Can't sing",
                message: "Only characters can sing",
                icon: "warning",
                autoClear: true,
            });
        }
        if (!this.ready) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Can't sing when exerted",
                message: `You can instead right click the card and select "Play Card" option and then exert the singer, if you want to skip this check.`,
                icon: "warning",
                autoClear: true,
            });
        }
        if (this.meta.playedThisTurn) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Fresh ink can't sing",
                message: `You can instead right click the card and select "Play Card" option and then exert the singer, if you want to skip this check.`,
                icon: "warning",
                autoClear: true,
            });
        }
        if (this.hasVoiceless) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Voiceless character can't sing",
                message: `You can instead right click the card and select "Play Card" option and then exert the singer, if you want to skip this check.`,
                icon: "warning",
                autoClear: true,
            });
        }
        const isPlayerRestricted = this.rootStore.effectStore.hasRestrictionToPlayActionCard(song);
        if (isPlayerRestricted) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Can't sing",
                message: "Player has restrictions",
                icon: "warning",
                autoClear: true,
            });
        }
        const singValue = this.singerCost || this.cost;
        if (song.singCost > singValue) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: `Not enough ink, you need ${song.singCost} ink and only have ${singValue}`,
                message: `You can instead right click the card and select "Play Card" option and then exert the singer, if you want to skip this check.`,
                icon: "warning",
                autoClear: true,
            });
        }
        this.exert();
        this.rootStore.log({
            type: "SING",
            song: song.instanceId,
            singer: this.instanceId,
        });
        const moveResponse = song.play({
            forFree: true,
            singing: true,
            singers: [this],
        });
        if (moveResponse.success) {
            this.rootStore.triggeredStore.onSing(this, song);
        }
        return moveResponse;
    }
    payCosts(costs = [], cardsToExert = [], payingPlayer) {
        return payCosts(costs, cardsToExert, this, this.rootStore, payingPlayer);
    }
    activate(abilityName, params = {}) {
        const ability = this.getActivatedAbility(abilityName);
        if (!(ability && activatedAbilityPredicate(ability.ability))) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Can't activate this card",
                message: "Ability not found",
                icon: "warning",
                autoClear: true,
            });
        }
        if (!ability.areConditionsMet) {
            this.rootStore.debug(`Resolution ability condition not met: ${ability.name}`);
            this.rootStore.debugCondition(ability.conditions, this);
            return this.rootStore.sendNotification({
                type: "icon",
                icon: "warning",
                title: "Ability's condition are not met",
                message: `Card effect's is being skipped`,
                autoClear: true,
            });
        }
        this.rootStore.debug("Activating ability ", ability.name, ability.costs);
        let skipPayingCosts = false;
        // TODO: Hacky but effective
        if (this.ready &&
            this.fullName.toLowerCase() === "Maui's Fish Hook".toLowerCase()) {
            const isMauiInPlay = this.rootStore.cardStore.cardsInPlay.find((card) => {
                return (card.type === "character" &&
                    card.ownerId === this.ownerId &&
                    card.name.toLowerCase() === "Maui".toLowerCase());
            });
            skipPayingCosts = !!isMauiInPlay;
            // It should not skip exerting
            if (skipPayingCosts) {
                this.exert();
            }
        }
        if (!skipPayingCosts) {
            const canPay = this.canPayCosts(ability.costs || [], params.costs);
            if (!canPay) {
                return this.rootStore.sendNotification({
                    type: "icon",
                    title: "Can't activate this card",
                    message: `You can't pay activation costs, if you think this is a mistake you can enable manual mode and adjust the game state.`,
                    icon: "warning",
                    autoClear: true,
                });
            }
            const payed = this.payCosts(ability.costs, params.costs);
            if (!payed) {
                return this.rootStore.sendNotification({
                    type: "icon",
                    title: "Can't activate this card",
                    message: `You can't pay activation costs, if you think this is a mistake you can enable manual mode and adjust the game state.`,
                    icon: "warning",
                    autoClear: true,
                });
            }
        }
        this.rootStore.stackLayerStore.addAbilityToStack(ability, this);
        return this.rootStore.moveResponse(true);
    }
    get canQuest() {
        return (this.type === "character" &&
            this.zone === "play" &&
            !this.hasQuestRestriction &&
            !this.meta.playedThisTurn &&
            !this.isShiftedCharacter &&
            this.ready);
    }
    get hasChallengedThisTurn() {
        return this.rootStore.tableStore.hasChallengedThisTurn(this);
    }
    canChallenge(opponent) {
        if (this.type !== "character" || !this.ready) {
            return false;
        }
        if (this.meta.playedThisTurn && !this.hasRush) {
            return false;
        }
        if (this.hasChallengeRestriction) {
            return false;
        }
        if (opponent.type === "character" &&
            this.hasChallengeCharactersRestriction) {
            return false;
        }
        if (opponent) {
            return opponent.canBeChallenged(this);
        }
        return true;
    }
    canBeChallenged(challenger) {
        if (this.type !== "character" && this.type !== "location") {
            return false;
        }
        if (this.hasEvasive && !challenger.hasEvasive) {
            return false;
        }
        if (this.type === "character" &&
            this.ready &&
            !(challenger.canChallengeReadyCharacters ||
                (this.damage >= 1 && challenger.canChallengeReadyDamagedCharacters))) {
            return false;
        }
        if (this.isBodyGuarded(challenger)) {
            return false;
        }
        if (this.hasCannotBeChallengedEffect(challenger)) {
            return false;
        }
        let result = true;
        for (const model of this.rootStore.effectStore.getAbilitiesForCard(this)) {
            const ability = model.ability;
            for (const effect of ability.effects || []) {
                if (protectionEffectPredicate(effect) && effect.from === "challenge") {
                    if (protectionEffectPredicate(effect) &&
                        effect.from === "challenge") {
                        const matchesFilter = challenger.matchesTargetFilter(effect.target.filters, this.ownerId);
                        result = !matchesFilter;
                    }
                }
            }
        }
        return result;
    }
    isBodyGuarded(opponent) {
        if (this.type !== "character") {
            return false;
        }
        if (this.hasBodyguard) {
            return false;
        }
        const defenderPlayer = this.ownerId;
        const filters = [
            { filter: "owner", value: defenderPlayer },
            { filter: "zone", value: "play" },
            { filter: "status", value: "exerted" },
            { filter: "ability", value: "bodyguard" },
        ];
        const defenderBodyGuards = this.rootStore.cardStore.getCardsByTargetFilter(filters);
        // It can't bodyguard itself
        if (defenderBodyGuards.filter((bodyguard) => bodyguard.instanceId !== this.instanceId).length === 0) {
            return false;
        }
        // If the attacker doesn't have evasive, the bodyguard must NOT have evasive
        if (!opponent?.hasEvasive &&
            defenderBodyGuards.filter((guard) => !guard.hasEvasive).length === 0) {
            return false;
        }
        return defenderBodyGuards.length > 0;
    }
    damageReduction(params = {}) {
        const { isChallenge, damageSource, isDefender, isAttacker } = params;
        return this.rootStore.effectStore.getDamageReductionForCard({
            cardModel: this,
            isChallenge,
            damageSource,
            isDefender: isDefender,
            isAttacker: isAttacker,
        });
    }
    // TODO: We should be checking if the effect can target the challenger
    hasCannotBeChallengedEffect(challenger) {
        const cannotBeChallengedEffects = this.rootStore.effectStore
            // For some reason passing the filter directly doesn't work
            .getCardEffects(this, [])
            .filter((effect) => {
            const rawEffect = effect.effect;
            const beChallengedRestriction = beChallengedRestrictionEffectPredicate(rawEffect);
            if (!beChallengedRestriction) {
                return false;
            }
            if (rawEffect.challengerFilters) {
                return challenger.matchesTargetFilter(rawEffect.challengerFilters, this.ownerId, effect.source);
            }
            return beChallengedRestriction;
        });
        return cannotBeChallengedEffects.length > 0;
    }
    // Challenge restriction is only true when they're unable to challenge at all
    get hasChallengeRestriction() {
        return this.rootStore.effectStore.hasChallengeRestriction(this);
    }
    get hasChallengeCharactersRestriction() {
        return this.rootStore.effectStore.hasChallengeCharactersRestriction(this);
    }
    get canChallengeReadyCharacters() {
        return this.rootStore.effectStore
            .getAbilitiesForCard(this, [])
            .some((model) => {
            const ability = model.ability;
            return (ability.type === "static" &&
                ability.ability === "challenge-ready-chars");
        });
    }
    get canChallengeReadyDamagedCharacters() {
        return this.rootStore.effectStore
            .getAbilitiesForCard(this, [])
            .some((model) => {
            const ability = model.ability;
            return (ability.type === "static" &&
                ability.ability === "challenge-ready-damaged-chars");
        });
    }
    challenge(defender) {
        return this.rootStore.stateMachineStore.startChallenge(this.instanceId, defender.instanceId);
    }
    get type() {
        return this.lorcanitoCard.type;
    }
    get damage() {
        return this.meta.damage || 0;
    }
    // This function skips resist, please use updateCardDamage instead
    set damage(value) {
        this.updateCardMeta({
            damage: value,
        });
    }
    updateCardDamage(amountParam, type = "add", damageSource, params = {}) {
        let amount = amountParam;
        const characterCardsInPlay = this.rootStore.cardStore.characterCardsInPlay;
        // TODO: If many characters have protector, this will only trigger the first one
        const protector = characterCardsInPlay.find((card) => card.ownerId === this.ownerId &&
            card.instanceId !== this.instanceId &&
            card.hasProtector);
        if (protector && type === "add") {
            const moveResponse = protector.updateCardDamage(amount, type, damageSource, {
                isChallenge: params.isChallenge,
                isAttacker: params.isAttacker,
                isDefender: params.isDefender,
            });
            return moveResponse;
        }
        if (this.hasDamageRemovalRestriction && type === "remove") {
            return this.rootStore.log({
                type: "EFFECT_PREVENTION",
                effect: "REMOVE_DAMAGE",
                amount: amount,
                source: this.damageRemovalRestrictionAbilitySource?.instanceId,
                target: this.instanceId,
            });
        }
        const currentDamage = this?.meta?.damage || 0;
        if (!params.skipResist && type === "add") {
            amount = Math.max(0, amount -
                this.damageReduction({
                    isChallenge: params.isChallenge,
                    damageSource,
                    isAttacker: params.isAttacker,
                    isDefender: params.isDefender,
                }));
        }
        let damage = type === "add" ? currentDamage + amount : currentDamage - amount;
        if (type === "set") {
            damage = amount;
        }
        if (damage < 0) {
            this.rootStore.debug("Damage can't be negative");
            damage = 0;
        }
        this.updateCardMeta({
            damage,
        });
        const damageDealt = damage - currentDamage;
        if (damage > currentDamage) {
            this.rootStore.tableStore
                .getTable(this.ownerId)
                .onDamage(this, damageDealt);
            if (!params.skipTrigger) {
                this.rootStore.triggeredStore.onDamage(this, {
                    amount: damageDealt,
                    damageSource: damageSource,
                    isChallenge: params.isChallenge,
                    attacker: params.attacker,
                    defender: params.defender,
                });
            }
        }
        if (!params.skipTrigger && damage < currentDamage) {
            this.rootStore.triggeredStore.onHeal({
                target: this,
                amount: currentDamage - damage,
                triggeredBy: damageSource,
            });
        }
        return this.rootStore.log({
            type: "DAMAGE_CHANGE",
            instanceId: this.instanceId,
            // amount,
            to: damage,
            from: currentDamage,
        });
    }
    tapCard(opts) {
        const { exerted, toggle } = opts;
        if (toggle) {
            this.updateCardMeta({ exerted: !this.meta?.exerted });
        }
        else {
            this.updateCardMeta({ exerted: true });
        }
        this.rootStore.log({
            type: "TAP",
            instanceId: this.instanceId,
            value: this.meta?.exerted ?? false,
            inkwell: this.rootStore.tableStore
                .getTable(this.ownerId)
                ?.zones.inkwell.hasCard(this),
        });
        return this.rootStore.moveResponse(true);
    }
    get hasExertRestriction() {
        const exertRestriction = this.rootStore.continuousEffectStore.getExertRestriction(this);
        return exertRestriction.length > 0;
    }
    canEnterLocation(location) {
        if (location.zone !== "play" || location.type !== "location") {
            return false;
        }
        if (this.zone !== "play" || this.type !== "character") {
            return false;
        }
        if (this.isAtLocation(location)) {
            return false;
        }
        const moveCost = location.moveCostToEnterLocation(this);
        if (!this.canPayCosts([{ type: "ink", amount: moveCost }])) {
            return false;
        }
        return true;
    }
    //Once a character enters a location, they cannot leave the location, unless it is to enter another location.
    leaveLocation(opts = {}) {
        if (this.type !== "character") {
            this.rootStore.debug("Card is not a character: ", this.fullName);
            return;
        }
        const locationInstanceId = this.meta.location;
        if (!locationInstanceId) {
            return;
        }
        this.updateCardMeta({ location: undefined });
        const currentLocation = this.rootStore.cardStore.getCard(locationInstanceId);
        const locationChars = currentLocation?.meta.characters;
        currentLocation?.updateCardMeta({
            characters: locationChars?.filter((card) => card !== this.instanceId),
        });
    }
    moveCostToEnterLocation(card) {
        const moveCost = this.moveCost;
        if (this.type !== "location" || moveCost === undefined) {
            return 0;
        }
        const movementDiscounts = this.lorcanitoCard.movementDiscounts || [];
        for (const discount of movementDiscounts) {
            if (card.matchesTargetFilter(discount.filters, card.ownerId, this)) {
                return discount.amount;
            }
        }
        return moveCost;
    }
    enterLocation(location, opts = {}) {
        const skipPayingCosts = opts.shifting || opts.forFree;
        if (!(this.canEnterLocation(location) || skipPayingCosts)) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Can't enter location",
                message: "This card can't enter this location",
                icon: "warning",
                autoClear: true,
            });
        }
        const moveCost = location.moveCostToEnterLocation(this);
        const costs = [{ type: "ink", amount: moveCost }];
        if (!(this.canPayCosts(costs) || skipPayingCosts)) {
            this.rootStore.log({
                type: "CANT_PAY_COSTS",
                // character: this.instanceId,
                // location: location.instanceId,
            });
            return this.rootStore.moveResponse(false);
        }
        if (!skipPayingCosts) {
            this.payCosts(costs);
        }
        const previousLocation = this.getLocation;
        if (this.meta.location) {
            this.leaveLocation();
        }
        this.updateCardMeta({ location: location.instanceId });
        if (location.meta.characters) {
            // TODO: This is breaking encapsulation
            location.meta.characters.push(this.instanceId);
        }
        else {
            location.updateCardMeta({ characters: [this.instanceId] });
        }
        if (opts.shifting) {
            return this.rootStore.moveResponse(true);
        }
        this.rootStore.tableStore
            .getTable(this.ownerId)
            .onEnterLocation(this, location, previousLocation);
        this.rootStore.triggeredStore.onEnterLocation(this, location, previousLocation);
        return this.rootStore.log({
            type: "ENTER_LOCATION",
            character: this.instanceId,
            location: location.instanceId,
        });
    }
    isAtAnyLocation() {
        return !!this.meta.location;
    }
    isAtLocation(location) {
        if (this.type !== "character" || location?.type !== "location") {
            return false;
        }
        return (location.instanceId === this.meta.location &&
            location.containsCharacter(this));
    }
    get charactersAtLocation() {
        if (this.zone !== "play" || this.type !== "location") {
            return [];
        }
        return (this.meta?.characters
            ?.map((instanceId) => this.rootStore.cardStore.getCard(instanceId))
            .filter(notEmptyPredicate) || []);
    }
    containsCharacter(character) {
        const characters = this.meta.characters;
        if (!characters ||
            this.type !== "location" ||
            character.type !== "character") {
            return false;
        }
        return characters.some((card) => card === character.instanceId);
    }
    get getLocation() {
        const locationInstanceId = this.meta.location;
        if (locationInstanceId && this.isAtAnyLocation()) {
            return this.rootStore.cardStore.getCard(locationInstanceId);
        }
        return undefined;
    }
    get getCardsAtLocation() {
        if (this.zone !== "play" || this.type !== "location") {
            return [];
        }
        return (this.meta?.characters
            ?.map((instanceId) => this.rootStore.cardStore.getCard(instanceId))
            .filter(notEmptyPredicate)
            .filter((card) => card.isAtLocation(this)) || []);
    }
    get getDamagedCardsAtLocation() {
        return (this.getCardsAtLocation.filter((card) => (card.meta.damage || 0) > 0) ||
            []);
    }
    // From upstream to Model
    sync(meta) {
        if (meta) {
            this.meta.sync(meta);
        }
        else {
            this.meta.resetMeta();
        }
    }
    // From model to upstream
    toJSON() {
        const json = {
            instanceId: this.instanceId,
            publicId: this.publicId,
            ownerId: this.ownerId,
            meta: this.meta.toJSON(),
        };
        if (!json.meta) {
            json.meta = undefined;
        }
        return json;
    }
}
function getSupportEffect(strength) {
    return {
        type: "resolution",
        name: supportAbility.name,
        text: supportAbility.text,
        optional: true,
        effects: [
            {
                type: "attribute",
                attribute: "strength",
                amount: strength,
                modifier: "add",
                duration: "turn",
                target: {
                    type: "card",
                    value: 1,
                    filters: [
                        { filter: "type", value: "character" },
                        { filter: "zone", value: "play" },
                    ],
                },
            },
        ],
    };
}
//# sourceMappingURL=CardModel.js.map