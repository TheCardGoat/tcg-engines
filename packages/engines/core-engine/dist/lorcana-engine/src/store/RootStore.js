import { notEmptyPredicate } from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import { exhaustiveCheck } from "@lorcanito/lorcana-engine/lib/exhaustiveCheck";
import { createLogEntry } from "@lorcanito/lorcana-engine/lib/gameLog";
import { cleanObject, hash } from "@lorcanito/lorcana-engine/lib/hash";
import { BagStore } from "@lorcanito/lorcana-engine/store/BagStore";
import { CardStore } from "@lorcanito/lorcana-engine/store/CardStore";
import { ConfigurationStore } from "@lorcanito/lorcana-engine/store/ConfigurationStore";
import { ContinuousEffectStore } from "@lorcanito/lorcana-engine/store/ContinuousEffectStore";
import { EffectStore } from "@lorcanito/lorcana-engine/store/EffectStore";
import { MetaStore } from "@lorcanito/lorcana-engine/store/MetaStore";
import { StackLayerStore } from "@lorcanito/lorcana-engine/store/StackLayerStore";
import { StateMachineStore } from "@lorcanito/lorcana-engine/store/StateMachineStore";
import { StaticTriggeredStore } from "@lorcanito/lorcana-engine/store/StaticTriggeredStore";
// if (process.env.NODE_ENV === "development" && !process.env.JEST_WORKER_ID) {
//   configure({
//     enforceActions: "always",
//     computedRequiresReaction: true,
//     reactionRequiresObservable: true,
//     observableRequiresReaction: true,
//     disableErrorBoundaries: true,
//   });
// }
import { TableStore } from "@lorcanito/lorcana-engine/store/TableStore";
import { keywordToAbilityPredicate } from "@lorcanito/lorcana-engine/store/utils";
import { autorun, computed, makeAutoObservable, runInAction, toJS } from "mobx";
import { getGlobalObject, isBrowser } from "../lib/environment";
import { AbilityModel } from "./models/AbilityModel";
export function recursivelyNullifyUndefinedValues(obj = {}) {
    Object.entries(obj || {}).forEach(([key, value]) => {
        if (!!value && typeof value === "object") {
            if (key === "rootStore") {
                return;
            }
            recursivelyNullifyUndefinedValues(value);
        }
        else if (value === undefined) {
            obj[key] = null;
        }
    });
    return obj;
}
function selectNextTurnPlayer(players, playerId) {
    const next = (players.findIndex((p) => p === playerId) + 1) % players.length;
    return players[next] || playerId;
}
export class MobXRootStore {
    static instance = null;
    dependencies;
    matchId;
    gameId;
    seed;
    turnPlayer;
    priorityPlayer;
    priorityTimestamp;
    firstPlayer;
    choosingFirstPlayer;
    turnCount;
    manualMode;
    undoState;
    observable;
    moveCount = 0;
    createdAt = Date.now();
    isPassingTurn = undefined;
    pendingDrawStep = undefined;
    pendingRequests = [];
    highlightedCardId = null;
    activePlayer;
    opponent;
    _winner;
    _isLoading = false;
    _moveResponse;
    _pendingLogs = [];
    _pendingNotifications = [];
    // stores
    tableStore;
    cardStore;
    metaStore;
    stackLayerStore;
    triggeredStore;
    bagStore;
    continuousEffectStore;
    configurationStore;
    effectStore;
    stateMachineStore;
    _byPassLogSender = "";
    constructor(initialState, cards = {}, dependencies, observable = true) {
        // TODO: find a more elegant way of doing this
        // if (MobXRootStore.instance && !MobXRootStore.instance.isInitialStore) {
        //   return MobXRootStore.instance;
        // }
        this.observable = observable;
        if (observable) {
            makeAutoObservable(this, {
                dependencies: false,
                observable: false,
                _pendingLogs: false,
                _pendingNotifications: false,
                _moveResponse: false,
                _winner: true,
                _isLoading: false,
                _byPassLogSender: false,
                hash: computed,
            });
        }
        this.dependencies = dependencies;
        this.activePlayer = this.dependencies.playerId;
        this.opponent =
            Object.keys(initialState.tables || {}).filter((player) => player !== this.activePlayer)[0] || "SOLO_MODE";
        this.pendingRequests = initialState.pendingRequests || [];
        // state
        this.matchId = initialState.matchId;
        this.gameId = initialState.gameId;
        this.choosingFirstPlayer = initialState.choosingFirstPlayer;
        this.priorityPlayer = initialState.priorityPlayer;
        this.priorityTimestamp = initialState.priorityTimestamp;
        this.turnPlayer = initialState.turnPlayer;
        this.turnCount = initialState.turnCount;
        this.moveCount = initialState.moveCount;
        this.manualMode = initialState.manualMode;
        this.seed = initialState.seed;
        this._winner = initialState.winner;
        this.firstPlayer = initialState.firstPlayer;
        this.isPassingTurn = initialState.isPassingTurn;
        this.pendingDrawStep = initialState.pendingDrawStep;
        // stores
        this.cardStore = new CardStore(cards, dependencies, this, observable);
        this.metaStore = new MetaStore(initialState.metas, dependencies, this, observable);
        this.tableStore = TableStore.fromTable(initialState.tables, dependencies, this.cardStore, this, observable);
        this.stackLayerStore = new StackLayerStore(initialState.effects, dependencies, this, observable);
        this.bagStore = new BagStore(initialState.effects, dependencies, this, observable);
        this.triggeredStore = new StaticTriggeredStore(this, observable);
        this.continuousEffectStore = new ContinuousEffectStore(initialState.continuousEffects, this, observable);
        this.configurationStore = new ConfigurationStore(observable);
        this.effectStore = new EffectStore(this, observable);
        this.stateMachineStore = new StateMachineStore(initialState.stateMachines, this, observable);
        if (isBrowser() && process.env.NODE_ENV === "development") {
            getGlobalObject().rootStore =
                this;
        }
        if (!this.isSpectator) {
            const stop = autorun(() => {
                this.effectStore.reEvaluateAbilities(this.hash);
            }, {
                name: "Re-evaluate abilities",
                requiresObservable: true,
            });
        }
        MobXRootStore.instance = this;
    }
    sync(match) {
        if (!match) {
            return this;
        }
        this.matchId = match.matchId;
        this.gameId = match.gameId;
        this.priorityPlayer = match.priorityPlayer;
        this.priorityTimestamp = match.priorityTimestamp;
        this.choosingFirstPlayer = match.choosingFirstPlayer;
        this.firstPlayer = match.firstPlayer;
        this.turnPlayer = match.turnPlayer;
        this.turnCount = match.turnCount;
        this.moveCount = match.moveCount;
        this.seed = match.seed;
        this.tableStore.sync(match.tables);
        this.metaStore.sync(match.metas);
        this.firstPlayer = match.firstPlayer;
        this.isPassingTurn = match.isPassingTurn;
        this.pendingDrawStep = match.pendingDrawStep;
        this.createdAt = match.createdAt;
        this.pendingRequests = match.pendingRequests || [];
        // nullables
        this.manualMode = match.manualMode;
        this._winner = match.winner;
        this.stackLayerStore.sync(match.effects || []);
        this.bagStore.sync(match.bag || []);
        this.continuousEffectStore.sync(match.continuousEffects || []);
        this.triggeredStore.sync(match.triggeredAbilities || []);
        this.stateMachineStore.sync(match.stateMachines);
        this.cardStore.sync();
        // this.gameStateCheck();
        return this;
    }
    // Doing like this to leverage computed properties while not breaking expect toJSON behaviour
    // https://mobx.js.org/computeds.html
    toJSON() {
        return this.json;
    }
    getBoardState() {
        const json = this.json;
        const boards = {};
        Object.keys(json.tables || {}).forEach((playerId) => {
            const playerTable = json.tables[playerId];
            if (!playerTable) {
                return;
            }
            const innerBoard = {
                cardsPlayed: playerTable.turn?.cardsMoved
                    ?.filter((movement) => movement.to === "play")
                    .map((movement) => movement.card) || [],
                challenges: playerTable.turn?.challenges || [],
                quests: playerTable.turn?.quests || [],
                cardsInPlay: playerTable.zones.play || [],
                deckCount: playerTable.zones.deck?.length || 0,
                discardCount: playerTable.zones.discard?.length || 0,
                handCount: playerTable.zones.hand?.length || 0,
                unusedInk: playerTable.zones.inkwell?.filter((card) => !json.metas[card]?.exerted).length || 0,
                inkCount: playerTable.zones.inkwell?.length || 0,
                lore: playerTable.lore,
            };
            boards[playerId] = innerBoard;
        });
        return {
            turnCount: json.turnCount,
            movesCount: json.moveCount,
            duration: Date.now(),
            boards: boards,
        };
    }
    get json() {
        const match = toJS({
            matchId: this.matchId,
            gameId: this.gameId,
            seed: this.seed,
            isPassingTurn: this.isPassingTurn,
            pendingDrawStep: this.pendingDrawStep,
            firstPlayer: this.firstPlayer,
            choosingFirstPlayer: this.choosingFirstPlayer,
            priorityPlayer: this.priorityPlayer,
            priorityTimestamp: this.priorityTimestamp,
            turnPlayer: this.turnPlayer,
            moveCount: this.moveCount,
            turnCount: this.turnCount,
            tables: this.tableStore.toJSON(),
            metas: this.metaStore.toJSON() || {},
            pendingRequests: JSON.parse(JSON.stringify(this.pendingRequests || [])),
            // Nullables
            effects: this.stackLayerStore.toJSON(),
            bag: this.bagStore.toJSON(),
            continuousEffects: this.continuousEffectStore.toJSON(),
            triggeredAbilities: this.triggeredStore.toJSON(),
            stateMachines: this.stateMachineStore.toJSON(),
            manualMode: this.manualMode ? this.manualMode : undefined,
            winner: this._winner,
            createdAt: this.createdAt,
        });
        // @ts-ignore -- expect error is not working
        match["_hash"] = hash(match);
        return cleanObject(match);
    }
    get hash() {
        const json = this.toJSON();
        const { undoState, _hash, ...state } = json;
        return hash(state);
    }
    // 1.9. Game State Check
    // 1.9.1. There is a set of conditions the game checks for with certain required actions happening when one or more of those conditions is met. This is called a game state check and is made up of two parts: the game state condition and the required action. A game state condition is a specific circumstance the game state can achieve. A required action is what happens in the game when a game state condition is met. The following are the conditions that the game state check looks for and the required action each creates.
    // 1.9.1.1. If a player has 20 or more lore, that player wins the game.
    // 1.9.1.2. If a player attempted to draw from a deck with no cards since the last game state check, that player loses the game.
    // 1.9.1.3. If a character or location has damage equal to or greater than its Willpower {W}, that character or location is banished.
    // 1.9.2. A game state check is made at the end of every step, after any action or ability is finished resolving, and after each effect in the bag is finished resolving. During a game state check, first check and complete all win and loss conditions and required actions. Then if there are no win or loss conditions met, check and complete all other conditions and required actions. Once all required actions are complete, the game state check repeats until there are no further required actions to complete. Triggered abilities that occurred during this process are then added to the bag to resolve.
    // 1.9.2.1. Any required actions generated from a game state check happen in turn order. If a player would win and lose the game at the same time as a result of the same game state check, that player wins the game.
    // 1.9.3. Once a required action is completed, the game state check occurs again.
    // 1.9.4. Abilities that trigger as a result of a game state check are added to the bag as soon as the check and any required actions are fully completed.
    // 1.9.5. If multiple required actions would happen at once, a single combined required action takes place, and all of the required actions happen simultaneously.
    // TODO: NOT IMPLEMENTED YET
    gameStateCheck() {
        if (this.isSpectator || !this.matchHasStarted) {
            return;
        }
        if (!this.winner) {
            // TODO: Change test engine and test store to have at least one card in deck
            if (process.env.NODE_ENV !== "test") {
                if (this.playerHasWonByLore) {
                    this.declareWinnerForMatch(this.playerHasWonByLore, "LORE");
                }
            }
        }
        // TODO: Challenge is still banishing cards, it should happen here
        this.cardStore.cardsInPlay.forEach((card) => {
            if (card.isDead) {
                card.banish();
            }
        });
        // This is not in the game rules, but on damage triggers goes to the bag before potential targets are declared dead.
        // So it may be that a trigger goes to the bag and then the target is banished, leaving the trigger in the bag with no valid target
        for (const layer of this.stackLayerStore.layers) {
            // It could be that an earlier layer resolution changes the board in a way that by the time we resolve the layer it has valid targets.
            // Revisit this
            if (!(layer.hasValidTarget() || layer.ability.ability.dependentEffects)) {
                this.log({
                    type: "SKIP_EFFECT",
                    ability: layer.ability.ability,
                    source: layer.source.instanceId,
                });
                this.trace(`Skipping effect: ${JSON.stringify(layer.ability.ability)}, invalid target during game state check`);
                const skipLayer = layer.ability.onCancelLayer();
                if (skipLayer) {
                    this.stackLayerStore.addAbilityToStack(new AbilityModel(skipLayer, layer.source, this, this.observable), layer.source);
                }
                this.stackLayerStore.removeLayerFromStack(layer);
            }
        }
        // const priorityPlayerLayers = this.stackLayerStore.layers.filter(
        //   (layer) => layer.responder === this.priorityPlayer,
        // );
        // if (
        //   priorityPlayerLayers.length === 1 &&
        //   priorityPlayerLayers[0]?.autoResolve
        // ) {
        //   this.debug(
        //     "Priority player only has one layer, and it requires no target, auto-resolving it",
        //   );
        //   this.stackLayerStore.resolveLayerById(priorityPlayerLayers[0].id);
        //   if (
        //     this.stackLayerStore.layers.length === 1 &&
        //     this.stackLayerStore.layers[0]
        //   ) {
        //     this.debug("Just one layer left, auto-resolving it");
        //     this.stackLayerStore.resolveLayerById(
        //       this.stackLayerStore.layers[0].id,
        //     );
        //   }
        // }
        this.effectStore.reEvaluateAbilities(this.hash);
        this.resetPriority();
        this.cardStore.clearTemporary();
    }
    setActivePlayer(playerId) {
        this.activePlayer = playerId;
    }
    incrementMoveCount() {
        return this.moveCount++;
    }
    setMoveResponse(response) {
        runInAction(() => {
            this._moveResponse = response;
        });
    }
    moveResponse(success = true, overwriteResult) {
        const moveResponse = this._moveResponse || {
            success: true,
            logs: [],
            notifications: [],
        };
        const response = {
            success: moveResponse.success && success,
            logs: this._pendingLogs,
            notifications: this._pendingNotifications,
        };
        if (overwriteResult) {
            response.success = success;
        }
        this.setMoveResponse(response);
        return response;
    }
    flushResponse() {
        const response = this._moveResponse;
        this.setMoveResponse(undefined);
        this._pendingLogs = [];
        this._pendingNotifications = [];
        if (!response) {
            return {
                success: false,
                logs: [],
                notifications: [],
            };
        }
        return response;
    }
    get hasPriority() {
        if (this.manualMode) {
            return true;
        }
        return (this.priorityPlayer === this.dependencies.playerId ||
            this.stateMachineStore.priorityPlayer === this.dependencies.playerId);
    }
    getActiveEffects() {
        return this.continuousEffectStore.continuousEffects;
    }
    questWithAll(playerId) {
        if (playerId !== this.activePlayer) {
            return this.sendNotification({
                type: "icon",
                icon: "error",
                title: "You can only quest your own cards",
                message: "",
                autoClear: true,
            });
        }
        const charsQuesting = [];
        let total = 0;
        this.tableStore?.getTable(playerId)?.zones?.play?.cards.forEach((card) => {
            if (card.canQuest) {
                card.quest();
                charsQuesting.push(card.instanceId);
                total = total + card.lore;
            }
        });
        if (charsQuesting.length > 0) {
            this.log({
                type: "QUEST_WITH_ALL",
                player: playerId,
                cards: charsQuesting,
                total: total,
            });
        }
        return this.moveResponse(true);
    }
    get matchHasStarted() {
        return this.stateMachineStore.matchHasStarted;
    }
    get matchHasEnded() {
        return !!this.winner;
    }
    get matchIsInProgress() {
        return this.matchHasStarted && !this.matchHasEnded;
    }
    declareWinnerForMatch(winner, reason = "") {
        if (!this.winner) {
            this.log({ type: "END_GAME", winner, reason });
            this._winner = winner;
        }
    }
    get playerHasWonByLore() {
        const winningTable = Object.values(this.tableStore.tables).find((table) => {
            const loreRequiredToWin = table.opponentHasDonalDuckFlutteringWizard
                ? 25
                : 20;
            return table.lore >= loreRequiredToWin;
        });
        return winningTable?.ownerId;
    }
    get winner() {
        // TODO: This exists because of declareWinnerForMatch
        return this._winner;
    }
    playerTable(playerId) {
        return this.tableStore.tables[playerId];
    }
    getPlayerZone(playerId, zone) {
        return this.tableStore.getPlayerZone(playerId, zone);
    }
    topDeckCard(playerId) {
        return this.tableStore.getTopDeckCard(playerId);
    }
    get shouldRevealTopDeck() {
        return (this.cardStore.locationCardsInPlay.filter((card) => {
            return (card.fullName.toLowerCase() ===
                "Merlin's Cottage - The Wizard's Home".toLowerCase());
        }).length > 0);
    }
    get pendingPlayerRequests() {
        return this.pendingRequests || [];
    }
    sendPlayerRequest(request) {
        if (this.pendingRequests) {
            this.pendingRequests.push(request);
        }
        else {
            this.pendingRequests = [request];
        }
    }
    cancelPlayerRequest(playerId, cancelled) {
        const firstPendingRequest = this.pendingRequests?.[0];
        if (!firstPendingRequest) {
            return this.moveResponse(true);
        }
        // Only the requester can cancel the request
        if (firstPendingRequest.player !== playerId) {
            return this.moveResponse(true);
        }
        if (cancelled) {
            this.pendingRequests = this.pendingRequests?.slice(1);
        }
        return this.log({
            type: "PLAYER_REQUEST_ANSWER",
            sender: this.activePlayer,
            accepted: false,
        });
    }
    answerPlayerRequest(playerId, accepted) {
        const firstPendingRequest = this.pendingRequests?.[0];
        if (!firstPendingRequest) {
            return this.moveResponse(true);
        }
        // Only the player that received the request can answer it
        if (firstPendingRequest.player === playerId) {
            return this.moveResponse(true);
        }
        //remove item from pending requests
        this.pendingRequests = this.pendingRequests?.slice(1);
        if (accepted) {
            switch (firstPendingRequest.request) {
                case "UNDO_TURN": {
                    if (this.dependencies.externals?.undo) {
                        this.dependencies.externals.undo("turn");
                        this.sendNotification({
                            type: "icon",
                            title: "Undoing Turn",
                            message: "This might take a few seconds",
                            icon: "warning",
                            autoClear: true,
                        });
                    }
                    break;
                }
                case "UNDO_MOVE": {
                    if (this.dependencies.externals?.undo) {
                        this.dependencies.externals.undo("move");
                        this.sendNotification({
                            type: "icon",
                            title: "Undoing Move",
                            message: "This might take a few seconds",
                            icon: "warning",
                            autoClear: true,
                        });
                    }
                    break;
                }
                case "MANUAL_MODE": {
                    this.setManualMode(true);
                    break;
                }
                case "CONCEDE_GAME": {
                    const concedingPlayer = firstPendingRequest.player;
                    if (concedingPlayer && this.dependencies.externals?.concede) {
                        this.dependencies.externals.concede({
                            loserId: concedingPlayer,
                            reason: "Conceded by player request",
                            type: "game",
                        });
                        this.sendNotification({
                            type: "icon",
                            title: "Conceding Game...",
                            message: "This might take a few seconds",
                            icon: "warning",
                            autoClear: true,
                        });
                    }
                    break;
                }
                case "ENABLE_CHAT": {
                    if (this.dependencies.externals?.updateMetadata) {
                        this.dependencies.externals.updateMetadata({
                            chat: "free_text",
                        });
                    }
                    else {
                        return this.sendNotification({
                            type: "icon",
                            title: "Failed to enable chat",
                            message: `Enable chat didn't work, please try again`,
                            icon: "warning",
                            autoClear: true,
                        });
                    }
                    break;
                }
                case "CANCEL_GAME": {
                    break;
                }
                default: {
                    console.warn("Unknown request type", firstPendingRequest.request);
                    exhaustiveCheck(firstPendingRequest.request);
                }
            }
        }
        return this.log({
            type: "PLAYER_REQUEST_ANSWER",
            sender: this.activePlayer,
            accepted,
        });
    }
    requestUndoTurn(playerId, message) {
        this.sendPlayerRequest({
            request: "UNDO_TURN",
            player: playerId,
            message: message.substring(0, 100),
        });
        return this.log({
            type: "UNDO_TURN_REQUEST",
            sender: this.activePlayer,
            toggle: true,
            message,
        });
    }
    requestConcedeGame() {
        this.sendPlayerRequest({
            request: "CONCEDE_GAME",
            player: this.activePlayer,
            message: "I want to concede the game, gg.",
        });
        return this.log({
            type: "CONCEDE_GAME_REQUEST",
            player: this.activePlayer,
        });
    }
    requestFreeTextChat(playerId) {
        this.sendPlayerRequest({
            request: "ENABLE_CHAT",
            player: playerId,
            message: "",
        });
        return this.log({
            type: "REQUEST",
            payload: {
                type: "ENABLE_CHAT",
                mode: "free_text",
            },
        });
    }
    requestUndoMove(playerId, message) {
        this.sendPlayerRequest({
            request: "UNDO_MOVE",
            player: playerId,
            message: message.substring(0, 100),
        });
        return this.log({
            type: "UNDO_MOVE_REQUEST",
            sender: this.activePlayer,
            toggle: true,
            message,
        });
    }
    requestManualMode(playerId, message) {
        this.sendPlayerRequest({
            request: "MANUAL_MODE",
            player: playerId,
            message: message.substring(0, 100),
        });
        return this.log({
            type: "MANUAL_MODE_REQUEST",
            sender: this.activePlayer,
            toggle: true,
            message,
        });
    }
    setManualMode(mode) {
        this.manualMode = mode;
        return this.log({
            type: "MANUAL_MODE",
            sender: this.activePlayer,
            toggle: mode,
        });
    }
    convertPlayerTargetToPlayerId(target) {
        if (target.value === "target_owner" || target.value === "all") {
            console.warn("NOT IMPLEMENTED YET");
            return "";
        }
        if (target.value === "player_id") {
            return target.id;
        }
        if (target.value === "self") {
            return this.activePlayer;
        }
        if (target.value === "opponent") {
            return this.opponent;
        }
        console.warn("Unable to convert player target to player id");
        return "";
    }
    opponentPlayer(playerId) {
        if (playerId === this.activePlayer) {
            return this.opponent;
        }
        if (playerId === this.opponent) {
            return this.activePlayer;
        }
        return "NO_OPPONENT_FOUND";
    }
    get isMyPriority() {
        return this.priorityPlayer === this.dependencies.playerId;
    }
    isMyTurn(playerId) {
        return this.turnPlayer === playerId;
    }
    drawCard(playerId, amount = 1, skipLog = false) {
        return this.tableStore.drawCards(playerId, amount, { skipLog });
    }
    hasPassTurnBlockers(currentPlayer) {
        const recklessGlimmers = this.cardStore.getCardsByTargetFilter([
            { filter: "zone", value: ["play"] },
            { filter: "owner", value: currentPlayer },
            { filter: "type", value: "character" },
            { filter: "ability", value: "reckless" },
        ], currentPlayer);
        const opponentPlayArea = this.cardStore.getCardsByTargetFilter([
            { filter: "zone", value: ["play"] },
            { filter: "type", value: ["character", "location"] },
            { filter: "owner", value: this.opponent },
        ], currentPlayer);
        return recklessGlimmers
            .filter((card) => card.hasReckless)
            .some((recklessGlimmer) => {
            return opponentPlayArea.some((opponentCard) => recklessGlimmer.canChallenge(opponentCard) &&
                !recklessGlimmer.hasChallengedThisTurn);
        });
    }
    readySetDraw(playerId) {
        try {
            this.changeLogSender(this.opponent);
            // Ready Step
            const readyResponse = this.readyStep(playerId);
            if (!readyResponse.success) {
                return readyResponse;
            }
            // Set Step
            const setResponse = this.setStep(playerId);
            if (!setResponse.success) {
                return setResponse;
            }
            // Check if there are pending effects after set step
            if (this.stackLayerStore.layers.length > 0) {
                console.log("Pending effects after set step, setting pending draw step");
                this.pendingDrawStep = playerId;
                this.resetPriority();
                return this.moveResponse(true);
            }
            // Draw Step
            const drawResponse = this.drawStep(playerId);
            if (!drawResponse.success)
                return drawResponse;
            this.resetPriority();
            this.gameStateCheck();
            return this.moveResponse(true);
        }
        finally {
            this.changeLogSender(this.activePlayer);
        }
    }
    readyStep(playerId) {
        // Hide revealed cards
        const cardsInHand = this.getPlayerZone(playerId, "hand")?.cards.filter((card) => card.isRevealed);
        const cardsInDeck = this.getPlayerZone(playerId, "deck")?.cards.filter((card) => card.isRevealed);
        const cardsInInkwell = this.getPlayerZone(playerId, "inkwell")?.cards.filter((card) => card.isRevealed);
        const revealedCards = [...cardsInHand, ...cardsInDeck, ...cardsInInkwell];
        if (revealedCards?.length > 0) {
            revealedCards.forEach((card) => card.hide());
            this.log({
                type: "HIDE_CARD",
                player: playerId,
                cards: revealedCards.map((card) => card.instanceId),
                from: "hand",
            });
        }
        const zones = ["play", "inkwell"];
        zones.forEach((zone) => {
            this.getPlayerZone(playerId, zone)?.cards.forEach((card) => {
                card.updateCardMeta({
                    playedThisTurn: false,
                });
                if (card.hasAtStartOfTurnReadyRestriction &&
                    zone === "play" &&
                    card.type === "character") {
                    return;
                }
                if (!card.hasExertRestriction) {
                    card.updateCardMeta({
                        exerted: false,
                    });
                }
            });
        });
        return this.moveResponse(true);
    }
    setStep(playerId) {
        // Gain location lore
        this.cardStore.locationsInPlay
            .filter((card) => card.ownerId === playerId)
            .forEach((locationCard) => {
            locationCard.gainLocationLore();
        });
        this.gameStateCheck();
        // Handle start of turn triggers
        this.triggeredStore.onStartOfTurn(playerId);
        this.gameStateCheck();
        return this.moveResponse(true);
    }
    drawStep(playerId) {
        const playZone = this.getPlayerZone(playerId, "play");
        const shouldSkipDraw = playZone?.cards.some(
        // TODO: We should add a static effect type for skip draw
        (card) => card.fullName.toLowerCase() ===
            "Arthur - Determined Squire".toLowerCase() &&
            !card.isShiftedCharacter);
        if (shouldSkipDraw) {
            this.log({
                type: "SKIP_DRAW_STEP",
                player: playerId,
            });
            return this.moveResponse(true);
        }
        return this.drawCard(playerId);
    }
    get getAllCards() {
        return this.cardStore.getAllCards;
    }
    changePriority(playerId) {
        this.priorityPlayer = playerId;
        this.priorityTimestamp = Date.now();
    }
    resetPriority() {
        const opponent = this.opponentPlayer(this.turnPlayer) || this.turnPlayer;
        // TODO: THIS SHOULD USE
        // const topLayer = this.stackLayerStore.sortedTopLayer;
        const topLayer = this.stackLayerStore.layers[this.stackLayerStore.layers.length - 1];
        const turnPlayerHasActionEffectOnStack = this.stackLayerStore.layers.some((layer) => layer.source.type === "action" &&
            (layer.responder === this.turnPlayer || layer.responder === "self"));
        if (turnPlayerHasActionEffectOnStack) {
            return this.changePriority(this.turnPlayer);
        }
        const nonTurnPlayerHasActionEffectOnStack = this.stackLayerStore.layers.some((layer) => layer.source.type === "action" &&
            (layer.responder === "opponent" || layer.responder === opponent));
        if (nonTurnPlayerHasActionEffectOnStack) {
            return this.changePriority(opponent);
        }
        const turnPlayerHasEffectsOnStack = this.stackLayerStore.layers.some((layer) => layer.responder === this.turnPlayer);
        if (turnPlayerHasEffectsOnStack) {
            return this.changePriority(this.turnPlayer);
        }
        if (!topLayer && this.matchHasStarted) {
            this.changePriority(this.turnPlayer);
        }
        if (topLayer) {
            this.changePriority(topLayer.responder);
        }
    }
    // TODO: Move this to cardModel
    shiftCard(shifter, shifted) {
        const shifterCard = this.cardStore.cards[shifter || ""];
        const shiftedCard = this.cardStore.cards[shifted || ""];
        if (shifterCard && shiftedCard) {
            this.cardStore.shiftCard(shifterCard, shiftedCard);
        }
    }
    sendNotification(notification) {
        if (process.env.NODE_ENV === "test" || isBrowser()) {
            this.dependencies.notifier.sendNotification(notification);
        }
        this._pendingNotifications.push(notification);
        return this.moveResponse(false);
    }
    // This is a work around to let the active player send logs as if it happened by the opponent
    changeLogSender(activePlayer) {
        this._byPassLogSender = activePlayer;
    }
    log(entry) {
        try {
            const { logger } = this.dependencies;
            if (process.env.NODE_ENV === "test") {
                let cardName = "";
                if ("instanceId" in entry) {
                    cardName = this.cardStore.getCard(entry.instanceId)?.fullName || "";
                }
                if ("source" in entry) {
                    cardName = this.cardStore.getCard(entry.source)?.fullName || "";
                }
                if (cardName) {
                    // @ts-ignore
                    entry.cardName = cardName;
                }
                logger.log(entry);
            }
            this._pendingLogs.push(createLogEntry({
                logEntry: entry,
                sender: this._byPassLogSender || this.activePlayer,
            }));
            return this.moveResponse(true);
        }
        catch (e) {
            console.error(e);
            return this.moveResponse(false);
        }
    }
    trace(...args) {
        if (process.env.NODE_ENV === "test" ||
            process.env.NODE_ENV === "development") {
            console.log(...args);
        }
        return this.moveResponse(true);
    }
    debug(...args) {
        if (process.env.NODE_ENV === "test") {
            console.log(...args);
        }
        return this.moveResponse(true);
    }
    analytics(entry, params) {
        return this.debug(entry, params);
    }
    get isLoading() {
        return this._isLoading;
    }
    set isLoading(value) {
        this._isLoading = value;
    }
    debugCondition(conditions = [], card) {
        conditions.forEach((condition) => {
            this.debug(`Condition ${condition.type}: ${this.effectStore.metCondition(card, [
                condition,
            ])}`);
            if (condition.type === "filter") {
                const result = this.cardStore.getCardsByTargetFilter(condition.filters, card.ownerId, card);
                // this.debug(
                //   `${
                //     result.length !== 0
                //       ? ansiEscape("[PASSED]", ANSI_ESCAPE_CODES.GREEN)
                //       : ansiEscape("[FAILED]", ANSI_ESCAPE_CODES.RED)
                //   }${ANSI_ESCAPE_CODES.END} Filter ${JSON.stringify(condition.filters)}: ${result.map(
                //     (card) => card.fullName,
                //   )}`,
                // );
                condition.filters.forEach((currentFilter) => {
                    const result = this.cardStore.getCardsByTargetFilter([currentFilter], card.ownerId, card);
                    // this.debug(
                    //   `${
                    //     result.length !== 0
                    //       ? ansiEscape("[PASSED]", ANSI_ESCAPE_CODES.GREEN)
                    //       : ansiEscape("[FAILED]", ANSI_ESCAPE_CODES.RED)
                    //   } Filter ${JSON.stringify(currentFilter)}: ${result.map(
                    //     (card) => card.fullName,
                    //   )}`,
                    // );
                });
            }
            else {
                this.debug(JSON.stringify(condition));
            }
        });
    }
    // TEST UTILITY
    changeActivePlayer(activePlayer) {
        // @ts-expect-error  This is a test utility
        this.opponent = this.opponentPlayer(activePlayer);
        this.activePlayer = activePlayer;
    }
    get players() {
        return Object.keys(this.tableStore.tables);
    }
    // Moves
    tutorCard(instanceId) {
        this.tableStore.moveCard(instanceId, "hand");
        return this.log({
            type: "TUTORED",
            instanceId: instanceId,
        });
    }
    passTurn(playerId = this.turnPlayer, force = false) {
        if (this.stackLayerStore.topLayer) {
            return this.sendNotification({
                type: "icon",
                title: "There's still effects to be resolved",
                message: "Please make sure all effects are resolved/skipped before passing the turn",
                icon: "warning",
                autoClear: true,
            });
        }
        if (playerId !== this.turnPlayer) {
            return this.sendNotification({
                type: "icon",
                title: "It's not your turn",
                message: `It's ${this.turnPlayer}'s turn to pass`,
                icon: "warning",
            });
        }
        const nextTurnPlayer = selectNextTurnPlayer(Object.keys(this.tableStore.tables), this.turnPlayer);
        const currentPlayerTable = this.tableStore.getTable(this.turnPlayer);
        const nextTurnPlayerTable = this.tableStore.getTable(nextTurnPlayer);
        const hasPendingRecklessCard = this.hasPassTurnBlockers(this.turnPlayer);
        if (hasPendingRecklessCard && !force) {
            return this.sendNotification({
                type: "icon",
                title: "You have a reckless card that can still challenge your opponent",
                message: "You can instead use manual mode to skip this check, right click on the table and select pass turn (force)",
                icon: "warning",
                autoClear: true,
            });
        }
        if (this.isPassingTurn) {
            // THere's already a check that the stack is empty
            this.isPassingTurn = undefined;
        }
        else {
            this.gameStateCheck();
            // TODO: Split in two, triggers are getting resolved after this functions finishes and it's already opponents turn
            this.triggeredStore.onEndOfTurn(this.turnPlayer);
            this.gameStateCheck();
            if (this.stackLayerStore.layers.length > 0) {
                this.debug("Stack layers not empty, resolving top of stack");
                this.isPassingTurn = true;
                // Send some log
                return this.log({
                    type: "PASS_TURN",
                    player: playerId,
                    turn: this.turnCount,
                });
            }
        }
        this.log({ type: "PASS_TURN", player: playerId, turn: this.turnCount });
        nextTurnPlayerTable.resetTurn();
        currentPlayerTable.resetTurn();
        runInAction(() => {
            this.turnCount++;
            this.turnPlayer = nextTurnPlayer;
            this.resetPriority();
        });
        this.continuousEffectStore.onTurnPassed(this.turnCount);
        this.triggeredStore.onTurnPassed(this.turnCount);
        return this.readySetDraw(nextTurnPlayer);
    }
    resolveTopOfStack(params, activePlayer) {
        const { layerId, scry, targets, nameACard, mode, skip, targetPlayer } = params;
        let moveResponse;
        const layerBeingResolved = this.stackLayerStore.getLayer(layerId);
        if (activePlayer &&
            layerBeingResolved?.responderToPlayer !== activePlayer) {
            return this.sendNotification({
                type: "icon",
                icon: "warning",
                title: "You can only resolve layers you own",
                message: "You can only resolve layers you own",
                autoClear: true,
            });
        }
        if (skip) {
            moveResponse = this.skipLayer(layerId);
        }
        else if (mode) {
            moveResponse = this.stackLayerStore.resolveLayerById(layerId, { mode });
        }
        else if (nameACard) {
            moveResponse = this.stackLayerStore.resolveLayerById(layerId, {
                nameACard,
            });
        }
        else if (targetPlayer) {
            moveResponse = this.stackLayerStore.resolveLayerById(layerId, {
                targetPlayer,
            });
        }
        else if (targets) {
            moveResponse = this.stackLayerStore.resolveLayerById(layerId, {
                targets: targets
                    ?.map((target) => this.cardStore.getCard(target))
                    .filter(notEmptyPredicate),
            });
        }
        else if (scry && Object.values(scry).some((value) => value?.length > 0)) {
            const layer = this.stackLayerStore.getLayer(layerId);
            const scryEffect = layer?.ability.getScryEffect();
            moveResponse = this.stackLayerStore.resolveLayerById(layerId, {
                scry: {
                    top: scry.top
                        ?.map((target) => this.cardStore.getCard(target))
                        .filter(notEmptyPredicate),
                    bottom: scry.bottom
                        ?.map((target) => this.cardStore.getCard(target))
                        .filter(notEmptyPredicate),
                    hand: scry.hand
                        ?.map((target) => this.cardStore.getCard(target))
                        .filter(notEmptyPredicate),
                    inkwell: scry.inkwell
                        ?.map((target) => this.cardStore.getCard(target))
                        .filter(notEmptyPredicate),
                    discard: scry.discard
                        ?.map((target) => this.cardStore.getCard(target))
                        .filter(notEmptyPredicate),
                    play: scry.play
                        ?.map((target) => this.cardStore.getCard(target))
                        .filter(notEmptyPredicate),
                    limits: scryEffect?.limits,
                    tutorFilters: scryEffect?.tutorFilters,
                    shouldRevealTutored: scryEffect?.shouldRevealTutored,
                },
            });
        }
        else {
            moveResponse = this.stackLayerStore.resolveLayerById(layerId, {});
        }
        // After resolving the layer, check if there are any pending challenges to resolve
        if (moveResponse.success && this.stackLayerStore.layers.length === 0) {
            // If there are no more effects and we have a pending draw step
            if (this.pendingDrawStep) {
                const playerId = this.pendingDrawStep;
                this.pendingDrawStep = undefined;
                const drawResponse = this.drawStep(playerId);
                if (drawResponse.success) {
                    moveResponse = drawResponse;
                }
            }
            this.checkForPendingChallenges();
        }
        return moveResponse;
    }
    alterHand(cards, player) {
        this.tableStore.alterHand(cards, player);
        return this.moveResponse(true);
    }
    get playersLores() {
        const lores = {};
        Object.keys(this.tableStore.tables).forEach((table) => {
            lores[table] = this.tableStore.getTable(table).lore;
        });
        return lores;
    }
    startGame(playerId) {
        runInAction(() => {
            this.turnCount = 1;
            this.firstPlayer = playerId;
            this.turnPlayer = playerId;
            this.priorityPlayer = playerId;
            this.resetPriority();
        });
    }
    playCardFromHand(instanceId, params) {
        const card = this.cardStore.cards[instanceId];
        if (!card) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${instanceId}`,
                icon: "warning",
                autoClear: true,
            });
        }
        return card.playFromHand({
            ...params,
            alternativeCosts: params?.alternativeCosts
                ?.map((cost) => this.cardStore.cards[cost])
                .filter(notEmptyPredicate),
        });
    }
    singTogether(songId, singersId) {
        const song = this.cardStore.cards[songId];
        const targets = singersId
            .map((singer) => this.cardStore.cards[singer])
            .filter(notEmptyPredicate);
        if (!(song && targets)) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${songId} or ${singersId}`,
                icon: "warning",
                autoClear: true,
            });
        }
        if (song.type !== "action" || !song.characteristics.includes("song")) {
            return this.sendNotification({
                type: "icon",
                title: "Can't sing",
                message: "You must select a song to sing",
                icon: "warning",
                autoClear: true,
            });
        }
        const singTogetherAbility = song.getNativeAbilities
            .map((model) => model.ability)
            .find(keywordToAbilityPredicate("sing-together"));
        const songCost = singTogetherAbility?.value;
        if (!(song.hasSingTogether && songCost)) {
            return this.sendNotification({
                type: "icon",
                title: "Can't sing together",
                message: "You must select a song that has sing together ability",
                icon: "warning",
                autoClear: true,
            });
        }
        const singers = targets.filter((card) => card.canSing);
        if (singers.length < targets.length) {
            targets
                .filter((card) => !card.canSing)
                .forEach((card) => {
                this.debug(`Unable to sing: ${card.fullName}`);
            });
        }
        const singersTotalCost = singers.reduce((acc, singer) => acc + singer.singerCost, 0);
        if (singersTotalCost < songCost) {
            singers.forEach((singer) => {
                this.debug(`Singer: ${singer.fullName}, cost: ${singer.singerCost}`);
            });
            return this.sendNotification({
                type: "icon",
                title: "Not Enough Singers",
                message: `The total cost of the singers is ${singersTotalCost}, but the song requires ${songCost}`,
                icon: "warning",
                autoClear: true,
            });
        }
        singers.forEach((singer) => {
            singer.meta.update({ exerted: true });
        });
        this.log({
            type: "SING_TOGETHER",
            song: song.instanceId,
            singers: singers.map((singer) => singer.instanceId),
        });
        const moveResponse = song.play({
            forFree: true,
            singing: true,
            singers,
            song,
        });
        if (moveResponse.success) {
            singers.forEach((singer) => {
                this.triggeredStore.onSing(singer, song);
            });
        }
        return moveResponse;
    }
    scryMove(params) {
        const { top, discard, bottom, hand, inkwell, play, playerId } = params;
        return this.scry(playerId, top, bottom, hand, inkwell, discard, play);
    }
    scry(playerId, top = [], bottom = [], hand = [], inkwell = [], discard = [], play = [], 
    // No filter means no cards
    tutorFilters = [], playFilters = [], limits = {}, shouldReveal) {
        if (playerId !== this.activePlayer) {
            return this.sendNotification({
                type: "icon",
                title: "You can only scry your own cards",
                message: "",
                icon: "warning",
                autoClear: true,
            });
        }
        return this.tableStore.scry(top
            .map((instanceId) => this.cardStore.getCard(instanceId))
            .filter(notEmptyPredicate), bottom
            .map((instanceId) => this.cardStore.getCard(instanceId))
            .filter(notEmptyPredicate), hand
            .map((instanceId) => this.cardStore.getCard(instanceId))
            .filter(notEmptyPredicate), inkwell
            .map((instanceId) => this.cardStore.getCard(instanceId))
            .filter(notEmptyPredicate), discard
            .map((instanceId) => this.cardStore.getCard(instanceId))
            .filter(notEmptyPredicate), play
            .map((instanceId) => this.cardStore.getCard(instanceId))
            .filter(notEmptyPredicate), tutorFilters, playFilters, limits, shouldReveal);
    }
    undo(undoState, string) {
        this.sync(undoState);
        return this.log({
            type: "UNDO_TURN",
            turn: this.turnCount,
            move: this.moveCount,
        });
    }
    enterLocation(cardInstanceId, locationInstanceId, opts = {}) {
        const cardModel = this.cardStore.cards[cardInstanceId];
        const locationModel = this.cardStore.cards[locationInstanceId];
        if (!(cardModel && locationModel)) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${cardInstanceId} or ${locationInstanceId}`,
                icon: "warning",
                autoClear: true,
            });
        }
        return cardModel.enterLocation(locationModel, opts);
    }
    challenge(attacker, defender) {
        const attackerCard = this.cardStore.cards[attacker];
        const defenderCard = this.cardStore.cards[defender];
        if (!(attackerCard && defenderCard)) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${attacker} or ${defender}`,
                icon: "warning",
                autoClear: true,
            });
        }
        return attackerCard.challenge(defenderCard);
    }
    shift(shifter, shifted, params) {
        const shifterCard = this.cardStore.cards[shifter];
        const shiftedCard = this.cardStore.cards[shifted];
        const costs = params?.costs
            ?.map((c) => this.cardStore.cards[c])
            .filter(notEmptyPredicate);
        if (!(shifterCard && shiftedCard)) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${shifter} or ${shifted}`,
                icon: "warning",
                autoClear: true,
            });
        }
        return shifterCard.shift(shiftedCard, costs);
    }
    sing(songId, singerId) {
        const song = this.cardStore.cards[songId];
        const singer = this.cardStore.cards[singerId];
        if (!(song && singer)) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${songId} or ${singerId}`,
                icon: "warning",
                autoClear: true,
            });
        }
        return this.cardStore.singCard(song, singer);
    }
    // @DEPRECATED
    addToInkwell(instanceId) {
        this.tableStore.addToInkwell(instanceId);
    }
    putCardIntoInkwell(instanceId) {
        const card = this.cardStore.cards[instanceId];
        if (!card) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${instanceId}`,
                icon: "warning",
                autoClear: true,
            });
        }
        if (!card.canPutIntoInkwell) {
            return this.sendNotification({
                type: "icon",
                title: "Can't put card into inkwell",
                message: `Card ${card.fullName} can't be put into the inkwell`,
                icon: "warning",
                autoClear: true,
            });
        }
        return card.addToInkwell();
    }
    updateCardDamage(instanceId, damage, operation) {
        const card = this.cardStore.getCard(instanceId);
        if (!card) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${instanceId}`,
                icon: "warning",
                autoClear: true,
            });
        }
        return card.updateCardDamage(damage, operation);
    }
    drawInitialHands() {
        this.tableStore.getTables().forEach((table) => {
            const cardsInHand = table.zones.hand.cards.length;
            if (cardsInHand === 7) {
                return;
            }
            this.tableStore.drawCards(table.ownerId, 7, { skipLog: true });
        });
        return this.moveResponse(true);
    }
    shuffleDeck(player) {
        return this.tableStore.shuffleDeck(player);
    }
    revealCard(instanceId) {
        const cardToReveal = this.cardStore.getCard(instanceId);
        if (!cardToReveal) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${instanceId}`,
                icon: "warning",
                autoClear: true,
            });
        }
        return cardToReveal.revealCard();
    }
    moveCard(instanceId, to, position) {
        return this.tableStore.moveCard(instanceId, to, { position });
    }
    tapCard(instanceId, exerted, toggle) {
        const cardToTap = this.cardStore.getCard(instanceId);
        if (!cardToTap) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${instanceId}`,
                icon: "warning",
                autoClear: true,
            });
        }
        return cardToTap.tapCard({ exerted, toggle });
    }
    updatePlayerLore(player, lore) {
        const tableModel = this.playerTable(player);
        if (!tableModel) {
            return this.sendNotification({
                type: "icon",
                title: "Player not found",
                message: "Player not found",
                icon: "warning",
                autoClear: true,
            });
        }
        if (isNaN(lore)) {
            return this.sendNotification({
                type: "icon",
                title: "Invalid lore value",
                message: "Invalid lore value",
                icon: "warning",
                autoClear: true,
            });
        }
        return tableModel.updateLore(lore);
    }
    skipLayer(layerId, activePlayer) {
        const pendingLayers = this.stackLayerStore.layers;
        const layer = pendingLayers.find((layer) => layer.id === layerId);
        if (!layer) {
            const notification = {
                type: "icon",
                title: "Unknown layer",
                message: "The layer cannot be found",
                icon: "warning",
                autoClear: true,
            };
            return this.sendNotification(notification);
        }
        if (activePlayer && layer.responderToPlayer !== activePlayer) {
            return this.sendNotification({
                type: "icon",
                icon: "warning",
                title: "You can only skip layers you own",
                message: "You can only skip layers you own",
                autoClear: true,
            });
        }
        // if (
        //   layer.source.type !== "action" &&
        //   pendingLayers.find((layer) => layer.source.type === "action")
        // ) {
        //   this.sendNotification({
        //     type: "icon",
        //     icon: "warning",
        //     title: "You should first resolve action cards",
        //     message:
        //       "You cannot resolve a layer while an action card is on the bag",
        //     autoClear: true,
        //   });
        //   return this.moveResponse(false);
        // }
        let moveResponse = layer.skipEffect();
        // After resolving the layer, check if there are any pending challenges to resolve
        if (moveResponse.success && this.stackLayerStore.layers.length === 0) {
            // If there are no more effects and we have a pending draw step
            if (this.pendingDrawStep) {
                const playerId = this.pendingDrawStep;
                this.pendingDrawStep = undefined;
                const drawResponse = this.drawStep(playerId);
                if (drawResponse.success) {
                    moveResponse = drawResponse;
                }
            }
            this.checkForPendingChallenges();
        }
        return moveResponse;
    }
    checkForPendingChallenges() {
        if (this.stateMachineStore.challengeInProgress) {
            this.stateMachineStore.progressChallenge();
        }
    }
    generateLayerOnDemand(instanceId, ability, params = {}) {
        const card = this.cardStore.getCard(instanceId);
        if (!card) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${instanceId}`,
                icon: "warning",
                autoClear: true,
            });
        }
        const hasAbility = card
            .nativeAbilities()
            .find((nativeAbility) => nativeAbility.name === ability.name);
        if (!hasAbility) {
            // @ts-ignore - This is a temporary fix to add the ability to the card
            card.abilities.push(new AbilityModel(ability, card, this, this.observable));
        }
        return this.activateCardAbility(card.instanceId, ability.name, params);
    }
    activateCardAbility(instanceId, ability, params = {}) {
        const card = this.cardStore.getCard(instanceId);
        if (!card) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${instanceId}`,
                icon: "warning",
                autoClear: true,
            });
        }
        return card.activate(ability, {
            costs: params.costs,
        });
    }
    questWithCard(instanceId) {
        const card = this.cardStore.getCard(instanceId);
        if (!card) {
            return this.sendNotification({
                type: "icon",
                title: "Card not found",
                message: `Card not found with instanceId: ${instanceId}`,
                icon: "warning",
                autoClear: true,
            });
        }
        return card.quest();
    }
    chooseFirstPlayer(playerId) {
        // TO improve UX we should also send a notification
        // But notifications are marking move as failure
        // this.sendNotification({
        //   type: "icon",
        //   title: "First player chosen",
        //   message: `Player ${playerId} is the first player`,
        //   icon: "info",
        //   autoClear: true,
        // });
        return this.stateMachineStore.chooseFirstPlayer(playerId);
    }
    get isSpectator() {
        return !Object.keys(this.tableStore.tables).includes(this.activePlayer);
    }
    setHighlightedCardId(id) {
        this.highlightedCardId = id;
    }
    resolveResponder(responder, source) {
        if (responder === "self") {
            return source.ownerId;
        }
        if (responder === "opponent") {
            return this.opponentPlayer(source.ownerId);
        }
        return responder;
    }
}
//# sourceMappingURL=RootStore.js.map