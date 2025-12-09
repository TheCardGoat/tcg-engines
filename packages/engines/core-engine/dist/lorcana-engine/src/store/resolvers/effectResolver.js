import { AbilityModel, cardEffectTargetPredicate, EffectModel, exhaustiveCheck, matchesTargetFilters, scryEffectPredicate, targetConditionalEffectPredicate, } from "@lorcanito/lorcana-engine";
import { playerEffectTargetPredicate, } from "@lorcanito/lorcana-engine/effects/effectTargets";
import { ContinuousEffectModel } from "@lorcanito/lorcana-engine/store/models/ContinuousEffectModel";
import { isConditionMet } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import { calculateDynamicAmount } from "@lorcanito/lorcana-engine/store/resolvers/dynamicAmount";
import { computeNumericOperator } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
export function createEffectId(count, effect, source, target) {
    return `${count}-${target || ""}-${source.instanceId}-${effect.type}`;
}
export function resolveEffect(effect, effectModel, rootStore, params = {}) {
    if (!(effect && effectModel)) {
        console.error("Invalid effect or effect model", effect, effectModel);
        return;
    }
    let skipAfterEffect = false;
    const target = effect.target;
    const cardTargets = effectModel.resolveCardTargets(target, params);
    const turn = rootStore.turnCount;
    const continuousEffectCount = rootStore.continuousEffectStore.length;
    // TODO: We should probably do something about this
    // should we let the stack resolve and then send a notification?
    // or should we prevent the stack from resolving?
    if (
    // Target conditional effects have their own way of handling invalid targets
    !["target-conditional", "modal"].includes(effect.type) &&
        effectModel.resolveCardTargets(target, params).length > cardTargets.length) {
        rootStore.sendNotification({
            type: "icon",
            title: `Invalid target: ${effect.type}`,
            message: "an effect tried to target a card that was not valid, in effect resolver",
            icon: "warning",
            autoClear: true,
        });
    }
    if (target?.type === "card" && "filters" in target) {
        const typeFilter = target.filters.find((f) => f.filter === "type");
        const targetsACharacter = typeFilter &&
            (Array.isArray(typeFilter.value)
                ? typeFilter.value.includes("character")
                : typeFilter.value === "character");
        if (typeFilter &&
            targetsACharacter &&
            target.value !== "all" &&
            effectModel.source.type === "action") {
            const vanishedCards = cardTargets
                .filter((card) => card.hasVanish)
                .filter((card) => card.ownerId !== effectModel.source.ownerId);
            for (const card of vanishedCards) {
                const ability = {
                    type: "resolution",
                    effects: [
                        {
                            type: "banish",
                            target: {
                                type: "card",
                                value: "all",
                                filters: [{ filter: "instanceId", value: card.instanceId }],
                            },
                        },
                    ],
                };
                const model = new AbilityModel(ability, card, rootStore);
                rootStore.stackLayerStore.addAbilityToStack(model, card);
            }
        }
    }
    switch (effect.type) {
        case "restriction":
        case "ability": {
            rootStore.trace(`${effect.type} effect is targeting ${cardTargets.length} cards: ${cardTargets.map((card) => card.fullName).join(", ")}`);
            for (const target1 of cardTargets) {
                startCardContinuousEffect(target1, effect);
            }
            break;
        }
        case "replacement": {
            const id = createEffectId(continuousEffectCount, effect, effectModel.source);
            const duration = {
                turn: turn,
                times: effect.duration === "next" ? 1 : 0,
                challenge: effect.duration === "challenge",
            };
            rootStore.continuousEffectStore.startContinuousEffect(new ContinuousEffectModel({
                id,
                source: effectModel.source,
                duration,
                effect: effectModel,
                filters: effect.target?.filters || [],
                rootStore,
                observable: rootStore.observable,
            }));
            break;
        }
        case "additional-inkwell": {
            const playerId = rootStore.convertPlayerTargetToPlayerId(effect.target);
            const id = createEffectId(continuousEffectCount, effect, effectModel.source, playerId);
            const duration = {
                turn: effect.duration === "turn" ? turn : turn + 1,
                until: effect.until,
                challenge: effect.duration === "challenge",
            };
            const continuousEffectModel = new ContinuousEffectModel({
                id,
                source: effectModel.source,
                duration,
                effect: effectModel,
                playerTarget: playerId,
                filters: [],
                rootStore,
                observable: rootStore.observable,
            });
            rootStore.continuousEffectStore.startContinuousEffect(continuousEffectModel);
            break;
        }
        case "player-restriction": {
            const attributeEffect = {
                ...effect,
                target: {
                    type: "player",
                    value: "player_id",
                    id: rootStore.convertPlayerTargetToPlayerId(effect.target),
                },
            };
            const model = new EffectModel(attributeEffect, effectModel.source, effectModel.responder, rootStore, rootStore.observable);
            const id = createEffectId(continuousEffectCount, attributeEffect, effectModel.source);
            const duration = {
                turn: effect.duration === "next_turn" ? turn + 1 : turn,
                until: effect.until,
                challenge: effect.duration === "challenge",
            };
            const continuousEffectModel = new ContinuousEffectModel({
                id,
                source: effectModel.source,
                duration,
                effect: model,
                filters: [],
                rootStore,
                observable: rootStore.observable,
            });
            rootStore.continuousEffectStore.startContinuousEffect(continuousEffectModel);
            break;
        }
        case "attribute": {
            const amount = effect.amount || 0;
            const attribute = effect.attribute;
            cardTargets.forEach((target) => {
                const attributeEffect = {
                    type: "attribute",
                    modifier: effect.modifier,
                    attribute,
                    amount,
                    duration: effect.duration,
                    until: effect.until,
                    target: {
                        type: "card",
                        value: "all", // All is to skip selecting a target
                        filters: [
                            {
                                filter: "instanceId",
                                value: target.instanceId,
                            },
                        ],
                    },
                };
                const model = new EffectModel(attributeEffect, effectModel.source, effectModel.responder, rootStore, rootStore.observable);
                const id = createEffectId(continuousEffectCount, effect, effectModel.source, target.instanceId);
                const duration = {
                    turn: effect.duration === "next_turn" ? turn + 1 : turn,
                    until: effect.until,
                    challenge: effect.duration === "challenge",
                };
                rootStore.continuousEffectStore.startContinuousEffect(new ContinuousEffectModel({
                    id,
                    source: effectModel.source,
                    target,
                    duration,
                    effect: model,
                    filters: [],
                    rootStore,
                    observable: rootStore.observable,
                }));
            });
            break;
        }
        case "shuffle": {
            cardTargets.forEach((target) => {
                rootStore.cardStore.shuffleCardIntoDeck(target.instanceId);
            });
            break;
        }
        case "heal": {
            const healAmount = effectModel.calculateAmount();
            cardTargets.forEach((card) => {
                const damageBefore = card.meta.damage || 0;
                card.updateCardDamage(healAmount, "remove", effectModel.source);
                const damageAfter = card.meta.damage || 0;
                const damageRemoved = damageBefore - damageAfter;
                if (effect?.subEffect?.type === "draw") {
                    // THIS IS HACKY TO SUPPORT DYNAMIC AND HARD CODED DRAW AMOUNTS
                    const selectedDrawAmount = effect.subEffect.amount === -1
                        ? undefined
                        : effect.subEffect.amount;
                    const unvalidatedDrawAmount = typeof selectedDrawAmount === "number"
                        ? selectedDrawAmount
                        : damageRemoved;
                    // ensure cards with a hard coded draw amount only draws when damage healed > 0
                    const validatedDrawAmount = damageRemoved > 0 ? unvalidatedDrawAmount : 0;
                    rootStore.tableStore.drawCards(effectModel.source.ownerId, validatedDrawAmount);
                }
                // very hacky way to handle lore gain from healing - fixes Baymax - Armoured Companion
                if (effect?.subEffect && effect.subEffect.type === "lore") {
                    effectModel
                        .resolvePlayerTargets(effect.subEffect.target)
                        .forEach((playerId) => {
                        rootStore.tableStore
                            .getTable(playerId)
                            .updateLore(rootStore.tableStore.getTable(playerId).lore +
                            (damageBefore - damageAfter));
                    });
                }
            });
            break;
        }
        case "damage": {
            const damage = effectModel.calculateAmount();
            cardTargets.forEach((card) => {
                if (card.hasDamageDealtRestriction) {
                    return rootStore.log({
                        type: "EFFECT_PREVENTION",
                        effect: "DEAL_DAMAGE",
                        amount: damage,
                        source: card.damageDealtRestrictionAbilitySource?.instanceId,
                        target: card.instanceId,
                    });
                }
                card.updateCardDamage(damage, "add", effectModel.source);
            });
            break;
        }
        case "put-damage": {
            const damage = effectModel.calculateAmount();
            cardTargets.forEach((card) => {
                card.updateCardDamage(damage, "add", effectModel.source, {
                    skipResist: true,
                    skipTrigger: true,
                });
            });
            break;
        }
        case "lore": {
            effectModel
                .resolvePlayerTargets(effect.target, params)
                .forEach((playerId) => {
                const table = rootStore.tableStore.getTable(playerId);
                const amount = effectModel.calculateAmount(params.targets ? params.targets : []);
                table.updateLore(table.lore + amount);
            });
            break;
        }
        case "create-layer-for-player": {
            effectModel
                .resolvePlayerTargets(effect.target, params)
                // We should have used the player id here to create the layer
                .forEach((playerId) => {
                const { layer } = effect;
                createNewLayer({
                    layer,
                    // params,
                });
            });
            break;
        }
        case "create-layer-targeting-player": {
            const { layer } = effect;
            layer.effects = layer.effects.map((subEffect) => {
                const subEffectModel = { ...subEffect };
                if (scryEffectPredicate(subEffectModel) &&
                    playerEffectTargetPredicate(effectModel.target)) {
                    subEffectModel.target = effectModel.target;
                }
                if (effectModel.target) {
                    subEffectModel.target = effectModel.target;
                }
                else {
                    console.error("No target found for sub effect");
                }
                return subEffectModel;
            });
            createNewLayer({
                layer,
                // params,
            });
            break;
        }
        case "play": {
            rootStore.trace(`Resolving 'play' effect from: ${effectModel.source.name}`);
            cardTargets.forEach((card, index) => {
                const { bottomCardAfterPlaying, exerted, forFree } = effect;
                rootStore.trace(`Playing card: ${card.fullName}`);
                card.play({
                    forFree,
                    bodyguard: false,
                    bottomCardAfterPlaying,
                    exerted,
                });
            });
            break;
        }
        case "move-to-location": {
            const { to, afterEffect } = effect;
            const characterMovingToLocation = {
                type: "character-moving-to-location",
                characters: cardTargets.map((card) => card.instanceId),
                target: to,
            };
            // move-to-location after effect runs after moving to the location, which is a two-step effect
            if (afterEffect) {
                characterMovingToLocation.afterEffect = afterEffect.map((afterEffect) => {
                    afterEffect.target = {
                        type: "card",
                        value: "all",
                        filters: cardTargets.map((card) => ({
                            filter: "instanceId",
                            value: card.instanceId,
                        })),
                    };
                    return afterEffect;
                });
                effect.afterEffect = undefined;
            }
            createNewLayer({
                responder: effectModel.responder,
                effects: [characterMovingToLocation],
                // params,
            });
            break;
        }
        case "character-moving-to-location": {
            const { characters } = effect;
            const location = cardTargets[0];
            const characterCards = characters.map((instanceId) => rootStore.cardStore.getCard(instanceId));
            if (!location) {
                rootStore.sendNotification({
                    type: "icon",
                    title: "Invalid target",
                    message: "an effect tried to target a card that was not valid",
                    icon: "warning",
                    autoClear: true,
                });
                return rootStore.moveResponse(false);
            }
            characterCards.forEach((card) => {
                card?.enterLocation(location, { forFree: true });
            });
            break;
        }
        case "discard": {
            rootStore.tableStore.discardCards(cardTargets);
            break;
        }
        case "shuffle-deck": {
            effectModel
                .resolvePlayerTargets(effect.target, params)
                .forEach((playerId) => {
                rootStore.tableStore.shuffleDeck(playerId);
            });
            break;
        }
        case "draw": {
            effectModel
                .resolvePlayerTargets(effect.target, params)
                .forEach((playerId) => {
                const amount = effectModel.calculateAmount([effectModel.source]);
                if (amount <= 0) {
                    rootStore.debug("Invalid amount to draw: ", amount);
                    return;
                }
                rootStore.tableStore.drawCards(playerId, amount, {
                    effectSource: effectModel.source,
                });
            });
            break;
        }
        case "mill": {
            effectModel
                .resolvePlayerTargets(effect.target, params)
                .forEach((playerId) => {
                const amount = effectModel.calculateAmount([effectModel.source]);
                Array.from({ length: amount }, () => {
                    const topCard = rootStore.tableStore.getTopDeckCard(playerId);
                    topCard?.moveTo("discard", {
                        discard: false,
                    });
                });
            });
            break;
        }
        case "move": {
            const { shouldRevealMoved, exerted, bottom, isPrivate } = effect;
            for (const card of cardTargets) {
                console.log("moving card", card.name);
                // We need to manually handle the shifted cards for exert
                const cardsInStack = [card];
                let current = card;
                while (current && current.meta.shifted) {
                    const shifted = rootStore.cardStore.getCard(current.meta.shifted);
                    if (shifted) {
                        cardsInStack.push(shifted);
                        current = shifted;
                    }
                    else {
                        current = undefined;
                    }
                }
                card.moveTo(effect.to, {
                    discard: effect.to === "discard",
                    position: bottom ? "first" : "last",
                    isPrivate,
                });
                if (shouldRevealMoved) {
                    // Should we reveal all the cards in the stack?
                    card.reveal();
                }
                if (exerted) {
                    cardsInStack.forEach((card) => {
                        card.exert({ skipTriggers: true });
                    });
                }
            }
            break;
        }
        case "exert": {
            for (const card of cardTargets) {
                if (effect.exert) {
                    if (!card.ready) {
                        console.log("Card is already exerted, skipping exert", card.name);
                        skipAfterEffect = true;
                    }
                    card.exert();
                }
                else {
                    if (!card.ready) {
                        console.log("Card is already ready, skipping ready", card.name);
                        skipAfterEffect = true;
                    }
                    card.readyCharacter();
                }
            }
            break;
        }
        case "banish": {
            for (const card of cardTargets) {
                card.banish();
            }
            break;
        }
        case "reveal": {
            for (const card of cardTargets) {
                card.reveal();
            }
            break;
        }
        case "reveal-from-top-until": {
            const { onTargetMatchEffects, target } = effect;
            const playerDeck = rootStore.tableStore.getPlayerZone(effectModel.responder, "deck");
            if (!(playerDeck && Array.isArray(playerDeck.cards))) {
                return rootStore.sendNotification({
                    type: "icon",
                    title: "No cards in deck",
                    message: "You have no cards in your deck to play",
                    icon: "warning",
                    autoClear: true,
                });
            }
            const revealedCards = [];
            for (let i = playerDeck.cards.length - 1; i >= 0; i--) {
                const topCard = playerDeck.cards[i];
                if (!topCard) {
                    rootStore.sendNotification({
                        type: "icon",
                        title: "No cards in deck",
                        message: "You have no cards in your deck to play",
                        icon: "warning",
                        autoClear: true,
                    });
                    break;
                }
                topCard.reveal();
                revealedCards.push(topCard.instanceId);
                if (matchesTargetFilters(rootStore, topCard, target, topCard.ownerId, effectModel.source)) {
                    console.log(`Revealed card (${topCard.fullName}) matches filter. ${JSON.stringify(target)}`);
                    // Set iterator to zero to not continue revealing cards
                    i = 0;
                    for (const subEffect of onTargetMatchEffects) {
                        console.log("Executing sub effect", subEffect);
                        const subEffectWithConvertedTarget = {
                            ...subEffect,
                        };
                        const subEffectModel = new EffectModel(subEffectWithConvertedTarget, effectModel.source, effectModel.responder, rootStore, rootStore.observable);
                        resolveEffect(subEffectWithConvertedTarget, subEffectModel, rootStore, {
                            ...params,
                            targets: [topCard],
                        });
                    }
                }
                else {
                    console.log("Revealed card does not match filter: ", JSON.stringify(target));
                }
            }
            rootStore.log({
                type: "REVEAL_CARD",
                card: revealedCards,
                player: effectModel.responder,
                from: "deck",
            });
            break;
        }
        case "reveal-top-card": {
            const { onTargetMatchEffects, onTargetMatchFailureEffects, target, useParentsTarget, asOptionalLayer, } = effect;
            const topCard = rootStore.tableStore.getTopDeckCard(effectModel.responder);
            if (!topCard) {
                rootStore.sendNotification({
                    type: "icon",
                    title: "No cards in deck",
                    message: "You have no cards in your deck to play",
                    icon: "warning",
                    autoClear: true,
                });
                break;
            }
            topCard.reveal();
            if (matchesTargetFilters(rootStore, topCard, target, topCard.ownerId, effectModel.source)) {
                console.log(`Revealed top card (${topCard.fullName}) matches filter activating sub effects:  ${JSON.stringify(onTargetMatchEffects)}.`, JSON.stringify(target));
                if (onTargetMatchEffects) {
                    for (const subEffect of onTargetMatchEffects) {
                        resolveRevealTopCardSubEffects(true)(subEffect);
                    }
                }
            }
            else if (onTargetMatchFailureEffects) {
                console.log(`Revealed top card (${topCard.fullName}) does not match filter activating failure effects: ${JSON.stringify(onTargetMatchFailureEffects)}.`, JSON.stringify(target));
                if (onTargetMatchFailureEffects) {
                    onTargetMatchFailureEffects.forEach(resolveRevealTopCardSubEffects(false));
                }
            }
            else {
                console.log(`Revealed card (${topCard.fullName}) does NOT match filter, Skipping layer creation.`, JSON.stringify({
                    topCard,
                    target,
                    ownerId: topCard.ownerId,
                    source: effectModel.source,
                    paras: JSON.stringify(params),
                }));
            }
            function resolveRevealTopCardSubEffects(hasMatched) {
                return function callback(subEffect) {
                    if (!topCard) {
                        console.error("No top card");
                        return;
                    }
                    const subEffectWithConvertedTarget = {
                        ...subEffect,
                    };
                    if (cardEffectTargetPredicate(target) &&
                        useParentsTarget &&
                        hasMatched // When it doesn't match, replacing the target will always result in a failure.
                    ) {
                        // After replacing
                        // {"type":"card","value":1,"filters":[{"filter":"owner","value":"self"},{"filter":"attribute","value":"name","comparison":{"operator":"eq","value":"Lilo"}}
                        // Before Replacing
                        // {"type":"card","value":1,"filters":[{"filter":"owner","value":"self"},{"filter":"attribute","value":"name","comparison":{"operator":"eq","value":"target"}}
                        subEffectWithConvertedTarget.target = target;
                    }
                    console.log(JSON.stringify(target));
                    if (asOptionalLayer) {
                        createNewLayer({
                            responder: effectModel.responder,
                            optional: asOptionalLayer,
                            effects: [subEffectWithConvertedTarget],
                            params,
                        });
                    }
                    else {
                        const subEffectModel = new EffectModel(subEffectWithConvertedTarget, effectModel.source, effectModel.responder, rootStore, rootStore.observable);
                        resolveEffect(subEffectWithConvertedTarget, subEffectModel, rootStore, {
                            ...params,
                            targets: [topCard],
                        });
                    }
                };
            }
            break;
        }
        case "reveal-and-play": {
            const { target } = effect;
            const topCard = rootStore.tableStore.getTopDeckCard(effectModel.responder);
            if (!topCard) {
                rootStore.sendNotification({
                    type: "icon",
                    title: "No cards in deck",
                    message: "You have no cards in your deck to play",
                    icon: "warning",
                    autoClear: true,
                });
                break;
            }
            topCard.reveal();
            if (topCard.matchesTargetFilter(target.filters, effectModel.responder, effectModel.source)) {
                rootStore.trace(`Revealed card (${topCard.fullName}) matches filter, creating a player to play it exerted.`);
                createNewLayer({
                    responder: "self",
                    optional: true,
                    effects: [
                        {
                            type: "play",
                            forFree: true,
                            exerted: effect.exerted,
                            target: {
                                type: "card",
                                value: "all",
                                filters: [{ filter: "instanceId", value: topCard.instanceId }],
                            },
                        },
                    ],
                    // params,
                });
            }
            else {
                rootStore.trace(`Revealed card (${topCard.fullName}) does NOT match filter, Skipping layer creation.`);
            }
            break;
        }
        case "modal": {
            const { mode } = params;
            const { modes } = effect;
            const selectedMode = modes.find((m) => m.id === mode);
            if (!selectedMode) {
                rootStore.sendNotification({
                    type: "icon",
                    icon: "warning",
                    title: "Invalid mode",
                    message: "Make sure you select a valid mode for the effect",
                    autoClear: true,
                });
                return rootStore.moveResponse(false);
            }
            rootStore.trace(`Selected mode: ${selectedMode.id}${selectedMode.responder ? ` ${selectedMode.responder}` : ""}, ${selectedMode.text} - ${JSON.stringify(selectedMode.effects)}`);
            createNewLayer({
                responder: selectedMode.responder,
                effects: selectedMode.effects,
                optional: selectedMode.optional,
                resolveEffectsIndividually: selectedMode.resolveEffectsIndividually,
                // params,
            });
            break;
        }
        case "move-damage": {
            const { to, amount } = effect;
            const moveDamageToEffect = {
                type: "move-damage-to",
                amount: amount,
                from: cardTargets.map((target) => target.instanceId),
                target: to,
            };
            createNewLayer({
                responder: effectModel.responder,
                effects: [moveDamageToEffect],
                // params,
            });
            break;
        }
        case "move-damage-to": {
            const { from } = effect;
            if (!Array.isArray(from)) {
                rootStore.debug("Invalid from for move-damage-to effect");
                return;
            }
            from.forEach((fromInstanceId) => {
                const damageSource = rootStore.cardStore.getCard(fromInstanceId);
                if (!damageSource) {
                    rootStore.debug("Invalid damage source");
                    return;
                }
                // It's very unlikely that we have more than one target here
                cardTargets.forEach((target) => {
                    const sourceDamageBeforeMoving = damageSource.meta.damage ?? 0;
                    damageSource.updateCardDamage(effectModel.calculateAmount(), "remove", damageSource, {
                        skipTrigger: false,
                    });
                    const sourceDamageAfterMoving = damageSource.meta.damage ?? 0;
                    const damageMoved = sourceDamageBeforeMoving - sourceDamageAfterMoving;
                    const currentDamage = target.meta.damage ?? 0;
                    target.updateCardDamage(currentDamage + damageMoved, "set", damageSource, {
                        skipResist: true,
                        skipTrigger: false,
                    });
                    rootStore.log({
                        type: "MOVE_DAMAGE",
                        from: damageSource.instanceId,
                        to: target.instanceId,
                        amount: damageMoved,
                    });
                });
            });
            break;
        }
        case "scry": {
            if (params.scry) {
                const { top, hand, bottom, inkwell, discard, play } = params.scry;
                rootStore.tableStore.scry(top, bottom, hand, inkwell, discard, play, effect.tutorFilters, effect.playFilters, effect.limits, effect.shouldRevealTutored, effect.playExerted);
            }
            else {
                console.error("Invalid scry params");
                return rootStore.moveResponse(false);
            }
            break;
        }
        case "protection": {
            rootStore.debug("Protection effect is implemented in the card model itself");
            break;
        }
        case "create-layer-based-on-condition": {
            const { conditionalEffects } = effect;
            for (const conditionalEffect of conditionalEffects) {
                const { conditions, effects } = conditionalEffect;
                const metConditions = isConditionMet(rootStore, effectModel.source, conditions);
                if (metConditions) {
                    rootStore.trace(`create-layer-based-on-condition met conditions for effect: ${JSON.stringify(effects)}`);
                    createNewLayer({
                        responder: effectModel.responder,
                        effects: effects,
                    });
                }
                else {
                    rootStore.trace(`create-layer-based-on-condition conditions not met: ${JSON.stringify(conditions)}`);
                }
            }
            break;
        }
        case "create-layer-based-on-target": {
            let { filters, effects, fallback, resolveAmountBeforeCreatingLayer, optional, numberOfMatchingTargets, replaceEffectTarget, resolveEffectsIndividually, } = effect;
            const target = params.targets?.[0];
            const targets = params.targets || [];
            if ((params?.targets?.length ?? 0) > 1) {
                rootStore.trace("Multiple targets is not implemented, ", params?.targets?.map((t) => t.name));
                // break;
            }
            rootStore.debug(`Creating layer based on target: ${target?.name}`);
            const convertedResponder = target?.ownerId === effectModel.source.ownerId ? "self" : "opponent";
            const responder = target && effect.responder === "target_card_owner"
                ? convertedResponder
                : effect.responder;
            if (target) {
                for (const effect of effects) {
                    if (effect.target && "filters" in effect.target) {
                        effect.target.filters = effect.target.filters.map((filter) => {
                            if (filter.filter === "attribute" &&
                                (filter.value === "name" ||
                                    filter.value === "title" ||
                                    filter.value === "instanceId") &&
                                filter.comparison?.value === "target") {
                                return {
                                    ...filter,
                                    comparison: {
                                        ...filter.comparison,
                                        value: target[filter.value],
                                    },
                                };
                            }
                            return filter;
                        });
                    }
                }
            }
            if (!target) {
                rootStore.debug("Invalid target for create-layer-based-on-target effect");
                return;
            }
            if (resolveAmountBeforeCreatingLayer) {
                effects = effects.map((effect) => {
                    const amount = "amount" in effect ? effect.amount : undefined;
                    if (!amount) {
                        rootStore.trace(`No amount to resolve Before creating layer: ${JSON.stringify(effect)}`);
                        return effect;
                    }
                    return {
                        ...effect,
                        amount: calculateDynamicAmount(amount, rootStore, [target], effectModel.source),
                    };
                });
            }
            if (replaceEffectTarget) {
                effects = JSON.parse(JSON.stringify(effects));
                effects = effects.map((effect) => {
                    const effectWithConvertedTarget = {
                        ...effect,
                    };
                    if (cardEffectTargetPredicate(effect.target) &&
                        effect.target.filters.find((filter) => filter.filter === "source" && filter.value === "target")) {
                        effectWithConvertedTarget.target = {
                            type: "card",
                            value: "all",
                            filters: [
                                {
                                    filter: "instanceId",
                                    value: target.instanceId,
                                },
                            ],
                        };
                    }
                    return effectWithConvertedTarget;
                });
            }
            if (!filters) {
                createNewLayer({
                    optional,
                    responder: responder,
                    effects: effects,
                    resolveEffectsIndividually,
                    // params,
                });
                break;
            }
            if (numberOfMatchingTargets && filters) {
                // Count matching targets and use numeric comparison
                const matchingTargetsCount = targets.filter((target) => target.matchesTargetFilter(filters, effectModel.responder, effectModel.source)).length;
                const matches = computeNumericOperator(numberOfMatchingTargets, matchingTargetsCount, rootStore, effectModel.source, targets);
                if (matches) {
                    createNewLayer({
                        responder: effectModel.responder,
                        resolveEffectsIndividually,
                        optional,
                        effects: effects,
                        params,
                    });
                }
                else if (fallback) {
                    createNewLayer({
                        responder: effectModel.responder,
                        resolveEffectsIndividually,
                        optional,
                        effects: fallback,
                        params,
                    });
                }
                break;
            }
            const matchesTargetFilter = target.matchesTargetFilter(filters, effectModel.responder, effectModel.source, params);
            if (matchesTargetFilter) {
                createNewLayer({
                    responder: effectModel.responder,
                    resolveEffectsIndividually,
                    optional,
                    effects: effects,
                    params,
                });
            }
            else if (fallback) {
                createNewLayer({
                    responder: effectModel.responder,
                    resolveEffectsIndividually,
                    optional,
                    effects: fallback,
                    params,
                });
            }
            rootStore.debug("No layer created");
            break;
        }
        // TODO: This is not well implemented, everythign about it was done in a rush. We need to re do it
        case "target-conditional": {
            const target = params.targets?.[0];
            if (!(target && targetConditionalEffectPredicate(effect))) {
                rootStore.debug("Invalid target for conditional effect");
                return;
            }
            // We only use the first effect to evaluate the target, kind of weird
            const effectToEvaluate = effect.effects[0];
            const targetFilters = 
            // biome-ignore lint/correctness/noUnsafeOptionalChaining: Lazyness
            effectToEvaluate?.target && "filters" in effectToEvaluate?.target
                ? effectToEvaluate?.target.filters
                : [];
            const metConditions = target.matchesTargetFilter(targetFilters, effectModel.responder, effectModel.source);
            if (metConditions) {
                rootStore.trace(`Met conditions for effect: ${effect.type}`);
                for (const conditionalEffect of effect.effects) {
                    const newEffectModel = new EffectModel(conditionalEffect, effectModel.source, effectModel.responder, rootStore, rootStore.observable);
                    newEffectModel.resolveEffect(conditionalEffect, params);
                }
            }
            if (!metConditions && effect.fallback) {
                rootStore.trace(`Conditions not met, triggering fallback effect: ${effect.type}`);
                for (const fallbackEffect of effect.fallback) {
                    const newEffectModel = new EffectModel(fallbackEffect, effectModel.source, effectModel.responder, rootStore, rootStore.observable);
                    newEffectModel.resolveEffect(fallbackEffect, params);
                }
            }
            break;
        }
        // TODO: Fix this, it's working but it shouldn't. I have the feeling that once we make someething right this will break
        case "from-target-card-to-target-player": {
            const { player } = effect;
            effect.effects.forEach((playerEffect) => {
                const target = cardTargets[0];
                if (!target || cardTargets.length > 1) {
                    rootStore.debug("Invalid target for from-target-card-to-target-player effect");
                    return;
                }
                let targetPlayer = {
                    type: "player",
                    value: "self",
                };
                switch (player) {
                    case "card-owner": {
                        targetPlayer =
                            target.ownerId === effectModel.responder
                                ? { type: "player", value: "self" }
                                : { type: "player", value: "opponent" };
                        break;
                    }
                    case "effect-owner": {
                        targetPlayer =
                            effectModel.source.ownerId === effectModel.responder
                                ? { type: "player", value: "self" }
                                : { type: "player", value: "opponent" };
                        break;
                    }
                    default: {
                        exhaustiveCheck(player);
                    }
                }
                const model = new EffectModel(
                // @ts-expect-error Look at this later, CardOwnerEffect has to override extends PlayerBaseEffect
                { ...playerEffect, target: targetPlayer }, effectModel.source, effectModel.responder, rootStore, rootStore.observable);
                // TODO: I think this should create a layer instead of resolving directly the effect
                model.resolve(params);
            });
            break;
        }
        default: {
            exhaustiveCheck(effect);
        }
    }
    if (!skipAfterEffect &&
        cardEffectTargetPredicate(effect.target) &&
        "afterEffect" in effect &&
        effect.afterEffect) {
        rootStore.trace("Resolving after effect", JSON.stringify(effect.afterEffect));
        const { afterEffect } = effect;
        // cardTargets.forEach((card) => {
        //   afterEffect.forEach((subEffect) => {
        //     const subEffectModel = new EffectModel(
        //       subEffect,
        //       effectModel.source,
        //       subEffect.responder || effectModel.responder,
        //       rootStore,
        //       rootStore.observable,
        //     );
        //
        //     subEffectModel.resolve({ ...params, targets: [card] });
        //   });
        // });
        for (const subEffect of afterEffect) {
            const subEffectModel = new EffectModel(subEffect, effectModel.source, subEffect.responder || effectModel.responder, rootStore, rootStore.observable);
            subEffectModel.resolve({ ...params, targets: cardTargets });
        }
    }
    if (cardEffectTargetPredicate(effect.target) &&
        "forEach" in effect &&
        effect.forEach) {
        const { forEach } = effect;
        for (const card of cardTargets) {
            for (const subEffect of forEach) {
                const subEffectModel = new EffectModel(subEffect, effectModel.source, effectModel.responder, rootStore, rootStore.observable);
                subEffectModel.resolve({ ...params, targets: [card] });
            }
        }
    }
    function startCardContinuousEffect(target, rawEffect) {
        const id = createEffectId(continuousEffectCount, effect, effectModel.source, target.instanceId);
        const duration = {
            turn: rawEffect.duration === "turn" ? turn : turn + 1,
            until: rawEffect.until,
            challenge: rawEffect.duration === "challenge",
        };
        rootStore.continuousEffectStore.startContinuousEffect(new ContinuousEffectModel({
            id,
            source: effectModel.source,
            target,
            duration,
            effect: effectModel,
            filters: [],
            rootStore,
            observable: rootStore.observable,
        }));
    }
    function createNewLayer({ optional, effects, responder, resolveEffectsIndividually, layer, params, }) {
        const ability = layer || {
            type: "resolution",
            responder: (responder || "self"),
            resolveEffectsIndividually,
            optional,
            // TODO: We should have linked effect to ability, so we could use ability name and text here, as well as optional or not
            effects,
        };
        const abilityModel = new AbilityModel(ability, effectModel.source, rootStore, rootStore.observable);
        rootStore.stackLayerStore.addAbilityToStack(abilityModel, effectModel.source, {
            params,
        });
    }
}
//# sourceMappingURL=effectResolver.js.map