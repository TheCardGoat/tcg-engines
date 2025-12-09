import { AbilityModel, delayedTriggeredAbilityPredicate, notEmptyPredicate, } from "@lorcanito/lorcana-engine";
import { createGameStartMachine, } from "@lorcanito/lorcana-engine/state-machines/matchStartMachine";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { createActor } from "xstate";
export class StateMachineStore {
    rootStore;
    _startMatchMachine;
    action;
    phase;
    step;
    challengeState;
    playCardState;
    matchStart;
    constructor(initialState, rootStore, observable) {
        if (observable) {
            makeAutoObservable(this, { rootStore: false });
        }
        this.rootStore = rootStore;
        this.sync(initialState);
    }
    sync(state) {
        try {
            this.action = state?.action;
            this.phase = state?.phase;
            this.step = state?.step;
            this.challengeState = state?.challengeState;
            this.playCardState = state?.playCardState;
            this.matchStart = state?.matchStart;
            if (!(state && state.matchStart) || this.rootStore.turnCount > 0) {
                this._startMatchMachine?.stop();
                this._startMatchMachine = undefined;
                return;
            }
            const { matchStart } = state;
            if (matchStart) {
                if (this._startMatchMachine) {
                    this._startMatchMachine.stop();
                    this._startMatchMachine = undefined;
                }
                const { state: matchState, pendingAlteringHand, startingPlayer, alteredCards, } = matchStart;
                const initialContext = {
                    startingPlayer,
                    pendingAlteringHand,
                    alteredCards,
                    stateManager: {
                        shuffleDeck: (playerId) => {
                            this.rootStore.shuffleDeck(playerId);
                        },
                        startGame: (playerId) => {
                            this.rootStore.startGame(playerId);
                        },
                        alterHand: (cards, player) => {
                            this.rootStore.alterHand(cards, player);
                        },
                        drawInitialHands: () => {
                            this.rootStore.drawInitialHands();
                        },
                    },
                };
                if (matchState !== "gameStarted") {
                    const stateMachine = createGameStartMachine({
                        initialState: matchState,
                        initialContext: initialContext,
                    });
                    this._startMatchMachine = createActor(stateMachine);
                    this._startMatchMachine.subscribe((snapshot) => {
                        this.matchStart = {
                            state: snapshot.value,
                            pendingAlteringHand: snapshot.context.pendingAlteringHand,
                            startingPlayer: snapshot.context.startingPlayer,
                            alteredCards: snapshot.context.alteredCards,
                        };
                    });
                    this._startMatchMachine.start();
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    toJSON() {
        try {
            const playCardState = toJS(this.playCardState);
            // toJS is not deep cloning the params and costModifiers, so we need to do it manually
            if (playCardState?.params) {
                playCardState.params = toJS(playCardState.params);
            }
            if (playCardState?.costModifiers) {
                playCardState.costModifiers = toJS(playCardState.costModifiers);
            }
            return toJS({
                action: this.action,
                phase: this.phase,
                step: this.step,
                matchStart: toJS(this.matchStart),
                challengeState: toJS(this.challengeState),
                playCardState: playCardState,
            });
        }
        catch (e) {
            console.error(e);
            return undefined;
        }
    }
    get matchHasStarted() {
        return !this?.matchStart || this?.matchStart?.state === "gameStarted";
    }
    get startMachine() {
        return this?.matchStart;
    }
    alterHand(playerId, cards) {
        this._startMatchMachine?.send({
            type: "ALTER_HANDS",
            playerId,
            cards,
        });
        return this.rootStore.moveResponse(true);
    }
    hasPlayerAlteredHand(playerId) {
        return !this?.matchStart?.pendingAlteringHand?.includes(playerId);
    }
    get currentPlayerAlteringHand() {
        return this?.matchStart?.pendingAlteringHand?.[0];
    }
    isPlayerAlteringHand(playerId) {
        if (this?.matchStart?.state !== "alteringHands") {
            return false;
        }
        return this.currentPlayerAlteringHand === playerId;
    }
    get isChoosingWhoGoesFirst() {
        if (this?.matchStart?.state !== "choosingFirstPlayer") {
            return false;
        }
        return this.rootStore.choosingFirstPlayer === this.rootStore.activePlayer;
    }
    // TODO: Uninify priorities, currently we have a priorityPlayer inside the root store
    get priorityPlayer() {
        if (this?.matchStart?.state === "choosingFirstPlayer") {
            return this.rootStore.choosingFirstPlayer;
        }
        return this.currentPlayerAlteringHand || this.rootStore.priorityPlayer;
    }
    chooseFirstPlayer(playerId) {
        if (!this._startMatchMachine) {
            return this.rootStore.sendNotification({
                type: "icon",
                icon: "info",
                title: "Game hasn't started yet",
                message: "Please wait for the game to start",
                autoClear: true,
            });
        }
        runInAction(() => {
            this._startMatchMachine?.send({
                type: "CHOOSE_FIRST_PLAYER",
                order: this.rootStore.tableStore.players.sort((a, b) => a.localeCompare(playerId) ? 1 : -1),
            });
        });
        return this.rootStore.log({
            type: "GOING_FIRST",
            player: playerId,
        });
    }
    isGoingFirst(ownerId) {
        return this?.matchStart?.startingPlayer === ownerId;
    }
    trackAlteredCards(playerId, count) {
        if (!this?.matchStart)
            return;
        runInAction(() => {
            this.matchStart.alteredCards = {
                ...this.matchStart.alteredCards,
                [playerId]: count,
            };
        });
    }
    setPhase(phase) {
        this.phase = phase;
    }
    setStep(step) {
        this.step = step;
    }
    setAction(action) {
        this.action = action;
    }
    startChallenge(attacker, defender) {
        this.setChallengeStep("DECLARE_CHALLENGE", attacker, defender);
        this.setAction("CHALLENGE");
        return this.progressChallenge();
    }
    endChallenge() {
        this.setStep(undefined);
        this.setAction(undefined);
        this.challengeState = undefined;
        return this.rootStore.moveResponse(true);
    }
    setChallengeStep(step, attacker, defender) {
        const attackerFallback = attacker || this?.challengeState?.attacker;
        const defenderFallback = defender || this?.challengeState?.defender;
        this.setAction("CHALLENGE");
        this.setStep(step);
        this.challengeState = {
            attacker: attackerFallback,
            defender: defenderFallback,
        };
    }
    // 4.3.6.    Challenge
    // 4.3.6.1.  Sending a character into a challenge is a turn action. Only characters can challenge.
    // 4.3.6.2.  A character sent into a challenge is known as a challenging character, and the opposing character or location is being challenged. Both are considered to be in the challenge. Characters can challenge locations. For the differences in that process, see 4.3.6.18.
    // 4.3.6.3.  Only the challenging character and the character being challenged are in the challenge. If an ability or effect refers to a character "in a challenge," it's referring to one of the two characters in the current challenge.
    // 4.3.6.4.  To challenge, the active player follows the steps listed here, in order.
    progressChallenge() {
        const context = this?.challengeState || {
            attacker: undefined,
            defender: undefined,
        };
        // if (!this.machinesContext?.step) {
        //   console.log("[progressChallenge] No step found");
        //   return this.rootStore.moveResponse(true);
        // }
        const attackerModel = this.rootStore.cardStore.getCard(context.attacker);
        const defenderModel = this.rootStore.cardStore.getCard(context.defender);
        if (!(attackerModel && defenderModel)) {
            this.endChallenge();
            return this.rootStore.moveResponse(false);
        }
        switch (this.step) {
            // 4.3.6.5.  First, the player declares one of their characters is challenging a character. The declared character must have been in play since the beginning of the turn (that is, they must be dry), ready, and otherwise able to challenge.
            case "DECLARE_CHALLENGE": {
                this.setChallengeStep("CHOOSE_TARGET");
                return this.progressChallenge();
            }
            // 4.3.6.6.  Second, the player chooses an exerted opposing character to be challenged.
            case "CHOOSE_TARGET": {
                this.setChallengeStep("CHECK_RESTRICTIONS");
                return this.progressChallenge();
            }
            // 4.3.6.7.  Third, the players check for challenging restrictions. If any effect prevents the challenge, the challenge is illegal.
            case "CHECK_RESTRICTIONS": {
                if (attackerModel.hasChallengeRestriction) {
                    this.endChallenge();
                    return this.rootStore.sendNotification({
                        type: "icon",
                        title: "Glimmer can't challenge",
                        message: "You can use manual mode to simulate a quest",
                        icon: "warning",
                        autoClear: true,
                    });
                }
                if (defenderModel.type === "character") {
                    // If the defender is a character, check if the attacker has a challenge characters (only) restriction
                    if (attackerModel.hasChallengeCharactersRestriction) {
                        this.endChallenge();
                        return this.rootStore.sendNotification({
                            type: "icon",
                            title: "Glimmer can't challenge characters",
                            message: "You can use manual mode to simulate a quest",
                            icon: "warning",
                            autoClear: true,
                        });
                    }
                }
                if (defenderModel.hasEvasive && !attackerModel.hasEvasive) {
                    this.endChallenge();
                    return this.rootStore.sendNotification({
                        type: "icon",
                        title: "Can't challenge an evasive glimmer, unless the attacker has evasive too",
                        message: "You can instead use manual mode to simulate a challenge",
                        icon: "warning",
                        autoClear: true,
                    });
                }
                if (attackerModel.meta.playedThisTurn && !attackerModel.hasRush) {
                    this.endChallenge();
                    return this.rootStore.sendNotification({
                        type: "icon",
                        title: "Can't challenge when the ink is fresh",
                        message: "You can instead use manual mode to simulate a challenge",
                        icon: "warning",
                        autoClear: true,
                    });
                }
                if (defenderModel.isBodyGuarded(attackerModel)) {
                    this.endChallenge();
                    return this.rootStore.sendNotification({
                        type: "icon",
                        title: "Character has a bodyguard",
                        message: "You must attack the bodyguard instead",
                        icon: "warning",
                        autoClear: true,
                    });
                }
                if (!attackerModel.canChallenge(defenderModel)) {
                    this.endChallenge();
                    return this.rootStore.sendNotification({
                        type: "icon",
                        title: "Can't challenge this character",
                        message: "You can instead use manual mode to simulate a challenge",
                        icon: "warning",
                        autoClear: true,
                    });
                }
                this.setChallengeStep("EXERT_CHALLENGER");
                return this.progressChallenge();
            }
            // 4.3.6.8.  Fourth, the challenging player exerts the challenging character.
            case "EXERT_CHALLENGER": {
                attackerModel.updateCardMeta({ exerted: true });
                // This is required to revalidate abilities that depend on the card being exerted
                this.rootStore.effectStore.reEvaluateAbilities("");
                this.setChallengeStep("CHALLENGE_OCCURS");
                return this.progressChallenge();
            }
            // 4.3.6.9.  Fifth, the challenge occurs.
            case "CHALLENGE_OCCURS": {
                this.setChallengeStep("APPLY_WHILE_CHALLENGING_EFFECTS");
                return this.progressChallenge();
            }
            // 4.3.6.10. Sixth, "while challenging" effects apply.
            case "APPLY_WHILE_CHALLENGING_EFFECTS": {
                this.setChallengeStep("ADD_TRIGGERS_TO_BAG");
                return this.progressChallenge();
            }
            // 4.3.6.11. Seventh, effects that would trigger are added to the bag.
            case "ADD_TRIGGERS_TO_BAG": {
                this.setChallengeStep("CHALLENGE_DAMAGE");
                // Trigger onChallenge effects
                this.rootStore.triggeredStore.onChallenge(attackerModel, defenderModel);
                this.rootStore.continuousEffectStore.onChallenge(attackerModel, defenderModel);
                // Check if there are any effects that need to be resolved
                if (this.rootStore.stackLayerStore.layers.length > 0) {
                    console.log("[progressChallenge] Stack layers found, resolve it first before proceeding with challenge");
                    return this.rootStore.moveResponse(true);
                }
                return this.progressChallenge();
            }
            // 4.3.6.12. Eighth, once all effects in the bag have resolved, each character deals damage equal to their Strength {S} to the other character. This is known as the "Challenge Damage step." This isn't an ability or effect and isn't added to the bag.
            // 4.3.6.13. To determine the damage each character in the challenge deals, first calculate the total Strength {S} of each, taking into account any current modifier effects. If a character's {S} is negative, it counts as 0 {S} for the purpose of determining damage.
            // 4.3.6.14. Apply effects that adjust the amount of damage dealt (e.g., Resist).
            // 4.3.6.15. The resulting number is the final amount of damage that character deals. When damage is dealt to a character, place a number of damage counters equal to that damage on that character. (See 9.1, "Representation of Damage.")
            case "CHALLENGE_DAMAGE": {
                if (this.rootStore.stackLayerStore.layers.length > 0) {
                    console.log("[progressChallenge] Stack layers found, resolve it first before proceeding with challenge");
                    return this.rootStore.moveResponse(true);
                }
                return this.resolveChallengeOutcome(attackerModel, defenderModel);
            }
            // 4.3.6.16. Any effects that would trigger as a result of a character being banished in or during a challenge that apply trigger and resolve.
            // 4.3.6.17. Once all effects have been resolved and there are no more waiting to be added, effects that apply "while challenging" or "while being challenged" end, and the challenge is over.
            // 4.3.6.18. Players can choose to have a character challenge a location. This follows all of the normal rules and steps of challenging with the following exceptions.
            // 4.3.6.19. When a challenger is declared, the player chooses an opposing location to challenge instead of a character.
            // 4.3.6.20. Locations are never ready or exerted. They can be challenged at any time in the Main Phase.
            // 4.3.6.21. Locations don't have a Strength {S} characteristic and don't deal damage to the challenging character.
            // 4.3.6.22. If a character in a challenge is removed from the challenge for any reason, that challenge ends. First, resolve any remaining triggered abilities in the bag. Then, all "while challenging" effects end and the game proceeds to the Main Phase (see 4.3).
            default: {
                console.log("[progressChallenge] No step found", JSON.stringify(this.challengeState));
                this.endChallenge();
                return this.rootStore.moveResponse(false);
            }
        }
    }
    resolveChallengeOutcome(attacker, defender) {
        const attackerStrength = attacker.challengeTimeAttackerStrength;
        const defenderStrength = defender.challengeTimeDefenderStrength;
        const attackerDamageTaken = attacker.damage + defenderStrength;
        const defenderDamageTaken = defender.damage + attackerStrength;
        if (attacker.hasDamageDealtRestriction) {
            return this.rootStore.log({
                type: "EFFECT_PREVENTION",
                effect: "DEAL_DAMAGE",
                amount: defenderStrength,
                source: attacker.damageDealtRestrictionAbilitySource?.instanceId,
                target: attacker.instanceId,
            });
        }
        attacker.updateCardDamage(defenderStrength, "add", defender, {
            isChallenge: true,
            isAttacker: true,
            attacker: attacker,
            defender: defender,
        });
        if (defender.hasDamageDealtRestriction) {
            return this.rootStore.log({
                type: "EFFECT_PREVENTION",
                effect: "DEAL_DAMAGE",
                amount: attackerStrength,
                source: defender.damageDealtRestrictionAbilitySource?.instanceId,
                target: defender.instanceId,
            });
        }
        defender.updateCardDamage(attackerStrength, "add", attacker, {
            isChallenge: true,
            isDefender: true,
            attacker: attacker,
            defender: defender,
        });
        // TODO: Move to gameStateCheck
        // We're moving to discard after the triggers, so we can evaluate the triggers before discarding
        if (defender.isDead) {
            defender.banish({ attacker: attacker, defender: defender });
        }
        // TODO: Move to gameStateCheck
        if (attacker.isDead) {
            attacker.banish({ attacker: attacker, defender: defender });
        }
        this.rootStore.tableStore.getTable(attacker.ownerId).turn.challenges.push({
            attacker: attacker,
            defender: defender,
            meta: {
                attacker: {
                    damage: attackerDamageTaken,
                    banished: attacker.isDead,
                },
                defender: {
                    damage: defenderDamageTaken,
                    banished: defender.isDead,
                },
            },
        });
        this.rootStore.continuousEffectStore.onChallengeFinished();
        this.endChallenge();
        return this.rootStore.log({
            type: "CHALLENGE",
            attacker: attacker.instanceId,
            defender: defender.instanceId,
            strength: {
                attacker: attackerStrength,
                defender: defenderStrength,
            },
            banish: {
                attacker: attacker.isDead,
                defender: defender.isDead,
            },
            // TODO: this is not considering RESIST.
            damage: {
                attacker: attackerDamageTaken,
                defender: defenderDamageTaken,
            },
        });
    }
    get challengeInProgress() {
        return (this.action === "CHALLENGE" &&
            !!this.step &&
            this.step !== "CHALLENGE_COMPLETE");
    }
    get playInProgress() {
        return (this.action === "PLAY_CARD" &&
            !!this.step &&
            this.step !== "PLAY_COMPLETE");
    }
    startPlayCard(cardId, playerId, params) {
        this.setPlayCardStep("ANNOUNCE_CARD", cardId, playerId, params);
        this.setAction("PLAY_CARD");
        return this.progressPlayCard();
    }
    endPlayCard(overwriteResult) {
        this.setStep(undefined);
        this.setAction(undefined);
        this.playCardState = undefined;
        return this.rootStore.moveResponse(true, overwriteResult);
    }
    setPlayCardStep(step, cardId, playerId, params) {
        this.setAction("PLAY_CARD");
        this.setStep(step);
        this.playCardState = {
            cardId: cardId,
            playerId: playerId,
            params: this.playCardState?.params || params,
            alternatePayment: this?.playCardState?.alternatePayment ?? false,
            totalCost: this?.playCardState?.totalCost || 0,
            costModifiers: this?.playCardState?.costModifiers || {
                additional: 0,
                increases: 0,
                reductions: 0,
            },
        };
    }
    // 4.3.4. Play a card.
    // 4.3.4.1. The active player can take a turn action to play a card from their hand by announcing the card and paying its cost.
    // This process follows a series of steps. If any part of the playing a card process can’t be performed, it’s illegal to play
    // the card and the game goes back to the point right before the card was announced.
    // 4.3.4.2. These steps apply to all cards that can be played. Cards can normally be played only from a player’s hand. Only the
    // active player can play cards; no player may play a card on an opponent’s turn.
    // 4.3.4.3. First, the active player announces the card they intend to play and reveals it from their hand.
    // 4.3.4.4. Second, the player announces how they intend to play the card, whether for its ink cost or an alternate cost. If
    // multiple alternate costs could apply to the card, the player may choose one and ignore the others for the purposes
    // of playing the card.
    // 4.3.4.5. Third, the player determines the total cost needed to play the card. The total cost is the ink cost or alternate cost
    // plus any cost modifiers. This can include additional costs, cost increases, or cost reductions. Apply any additional
    // costs first, then cost increases, then cost reductions. The resulting cost is the total cost.
    // 4.3.4.6. Fourth, the player pays the total cost. If the total cost includes any ink, the player must exert a number of ready
    // ink cards equal to the ink cost. If any other costs are included, the player pays those costs as instructed by the card
    // text. Costs can be paid in any order but must be paid in full.
    // 4.3.4.7. Once the total card cost is paid, the card is now “played.” If the card is a character, item, or location, the card enters
    // the Play zone. If it’s a character being played using its Shift ability, it must be put on top of the card indicated in
    // the second step of this process. If the card is an action, the effect immediately resolves and the card goes to the
    // player’s discard pile.
    // 4.3.4.8. If an effect would trigger as a result of any of the steps for playing a card, that effect waits to resolve until the card
    // and its effect are fully played and resolved. Note that while an action card is resolving, it’s not considered to be in
    // the discard yet.
    // 4.3.4.9. Effects that change how a player pays the cost of a card (e.g., Singer) don’t change the ink cost of the card.
    // 4.3.4.10. If a card can be played “for free,” ignore all ink costs when paying for it. Other steps required to play the card and
    // non-ink costs still apply.
    progressPlayCard() {
        const context = this?.playCardState || {
            cardId: undefined,
            playerId: undefined,
            alternatePayment: false,
            params: undefined,
            totalCost: 0,
            costModifiers: { additional: 0, increases: 0, reductions: 0 },
        };
        const { cardId, playerId, params } = context;
        if (!(playerId && cardId)) {
            this.endPlayCard();
            return this.rootStore.moveResponse(false);
        }
        const cardBeingPlayed = this.rootStore.cardStore.getCard(cardId);
        if (!cardBeingPlayed) {
            this.endPlayCard();
            return this.rootStore.moveResponse(false);
        }
        const lorcanitoCard = cardBeingPlayed.lorcanitoCard;
        // Only the active player can play cards
        // if (this.rootStore.activePlayer !== playerId) {
        //   return this.rootStore.sendNotification({
        //     type: "icon",
        //     title: "Not your turn",
        //     message: "Only the active player can play cards",
        //     icon: "warning",
        //     autoClear: true,
        //   });
        // }
        switch (this.step) {
            // 4.3.4.3. First, the active player announces the card they intend to play and reveals it from their hand.
            case "ANNOUNCE_CARD": {
                const restrictions = cardBeingPlayed.playingCardRestrictions(params);
                if (restrictions) {
                    this.rootStore.trace(`Skipping play card ${cardBeingPlayed.instanceId}, it has restrictions.`);
                    return this.endPlayCard();
                }
                this.setPlayCardStep("ANNOUNCE_PAYMENT_METHOD", cardId, playerId);
                return this.progressPlayCard();
            }
            // 4.3.4.4. Second, the player announces how they intend to play the card
            case "ANNOUNCE_PAYMENT_METHOD": {
                if (params?.forFree) {
                    console.log("Playing for free");
                }
                else {
                    if (cardBeingPlayed.alternativeCosts && params?.alternativeCosts) {
                        cardBeingPlayed.payCosts(cardBeingPlayed.alternativeCosts, params.alternativeCosts
                            ?.map((id) => this.rootStore.cardStore.getCard(id))
                            .filter(notEmptyPredicate) || []);
                    }
                    else {
                        const ownerTable = this.rootStore.tableStore.getTable(cardBeingPlayed.ownerId);
                        this.rootStore.tableStore.payInk(ownerTable, cardBeingPlayed.cost);
                    }
                }
                if (this.playCardState) {
                    this.playCardState.alternatePayment = false;
                }
                this.setPlayCardStep("DETERMINE_TOTAL_COST", cardId, playerId);
                return this.progressPlayCard();
            }
            // 4.3.4.5. Third, determine the total cost with modifiers
            case "DETERMINE_TOTAL_COST": {
                this.setPlayCardStep("PAY_COST", cardId, playerId);
                return this.progressPlayCard();
            }
            // 4.3.4.6. Fourth, pay the total cost
            case "PAY_COST": {
                this.setPlayCardStep("PLACE_CARD", cardId, playerId);
                return this.progressPlayCard();
            }
            // 4.3.4.7. Place card in appropriate zone
            case "PLACE_CARD": {
                if (params?.bottomCardAfterPlaying) {
                    cardBeingPlayed.moveTo("deck", { position: "first" });
                }
                else if (lorcanitoCard?.characteristics?.includes("action")) {
                    cardBeingPlayed.moveTo("discard", { skipLog: true });
                }
                else {
                    cardBeingPlayed.moveTo("play");
                }
                if (params?.bodyguard || params?.exerted) {
                    cardBeingPlayed.exert({ skipTriggers: true });
                }
                else if (cardBeingPlayed.hasBodyguard) {
                    // TODO: This is wrong, this shouldn't go to the bag.
                    // Once we split between effects and the bag, we should add the ability as an effect
                    const abilityModel = new AbilityModel({
                        type: "resolution",
                        name: "Bodyguard",
                        text: "This character may enter play exerted.",
                        optional: true,
                        effects: [
                            {
                                type: "exert",
                                exert: true,
                                target: {
                                    type: "card",
                                    value: "all",
                                    filters: [
                                        {
                                            filter: "instanceId",
                                            value: cardBeingPlayed.instanceId,
                                        },
                                    ],
                                },
                            },
                        ],
                    }, cardBeingPlayed, this.rootStore, this.rootStore.observable);
                    this.rootStore.stackLayerStore.addAbilityToStack(abilityModel, cardBeingPlayed);
                }
                this.rootStore.log({
                    type: "PLAY_CARD",
                    instanceId: cardBeingPlayed.instanceId,
                    payedCost: params?.forFree ? 0 : cardBeingPlayed.cost,
                    originalCost: lorcanitoCard.cost,
                    alternativeCosts: params?.alternativeCosts,
                });
                this.setPlayCardStep("RESOLVE_EFFECTS", cardId, playerId);
                return this.progressPlayCard();
            }
            // 4.3.4.8. Resolve effects and triggers
            case "RESOLVE_EFFECTS": {
                this.rootStore.tableStore
                    .getTable(cardBeingPlayed.ownerId)
                    .turn.cardsMoved.push({
                    from: cardBeingPlayed.zone,
                    to: "play",
                    card: cardBeingPlayed,
                });
                this.rootStore.triggeredStore.onPlay(cardBeingPlayed, params);
                this.rootStore.continuousEffectStore.onPlay(cardBeingPlayed);
                // If a card containing a delayed triggered ability is played, start the effect
                cardBeingPlayed
                    .nativeAbilities([
                    (model) => delayedTriggeredAbilityPredicate(model.ability),
                ])
                    .forEach((model) => this.rootStore.triggeredStore.startDelayedAbility(model));
                cardBeingPlayed.resolutionAbilities.forEach((ability) => {
                    this.rootStore.stackLayerStore.addAbilityToStack(ability, cardBeingPlayed);
                });
                return this.endPlayCard(true);
            }
            default: {
                console.log("[progressPlayCard] No step found", JSON.stringify(this.playCardState));
                this.endPlayCard();
                return this.rootStore.moveResponse(false);
            }
        }
    }
}
//# sourceMappingURL=StateMachineStore.js.map