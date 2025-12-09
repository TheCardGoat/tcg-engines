import { notEmptyPredicate, } from "@lorcanito/lorcana-engine";
import { lorcanitoShuffle } from "@lorcanito/lorcana-engine/lib/shuffle/lorcanitoShuffle";
import { TableModel } from "@lorcanito/lorcana-engine/store/models/TableModel";
import { makeAutoObservable, toJS } from "mobx";
export class TableStore {
    dependencies;
    tables;
    cardStore;
    rootStore;
    constructor(initialState, dependencies, cardStore, rootStore, observable) {
        this.dependencies = dependencies;
        this.tables = initialState;
        this.cardStore = cardStore;
        this.rootStore = rootStore;
        if (observable) {
            makeAutoObservable(this, { rootStore: false, dependencies: false });
        }
    }
    static fromTable(tables, dependencies, cardStore, rootStore, observable) {
        const tableModels = {};
        Object.keys(tables || {}).forEach((playerId) => {
            const table = tables[playerId];
            if (table) {
                tableModels[playerId] = TableModel.fromTable(table, playerId, cardStore, rootStore, observable);
            }
        });
        return new TableStore(tableModels, dependencies, cardStore, rootStore, observable);
    }
    sync(tables) {
        Object.keys(tables || {}).forEach((playerId) => {
            const table = tables[playerId];
            const tableModel = this.tables[playerId];
            if (table && tableModel) {
                tableModel.sync(table);
            }
        });
    }
    // Doing like this to leverage computed properties while not breaking expect toJSON behaviour
    // https://mobx.js.org/computeds.html
    toJSON() {
        return this.JSON;
    }
    get JSON() {
        const tables = {};
        Object.keys(this.tables || {}).forEach((playerId) => {
            const table = this.tables[playerId];
            if (table) {
                tables[playerId] = table.toJSON();
            }
        });
        return toJS(tables);
    }
    getTables() {
        return Object.values(this.tables);
    }
    get players() {
        return Object.keys(this.tables).filter(notEmptyPredicate);
    }
    getTable(playerId) {
        let table;
        if (playerId) {
            table = this.tables[playerId];
        }
        else {
            const activePlayer = this.rootStore.activePlayer;
            table = this.tables[activePlayer];
        }
        // TODO: FIX THIS
        return table;
    }
    payInk(table, amount) {
        const availableInk = this.tables[table.ownerId]?.zones?.inkwell?.cards.filter((card) => card.ready) || [];
        if (availableInk.length < amount) {
            console.error("Not enough ink");
            return false;
        }
        availableInk?.slice(0, amount).forEach((card) => {
            card.updateCardMeta({ exerted: true });
        });
        return true;
    }
    hasChallengedThisTurn(glimmer) {
        return this.getTables().some((table) => {
            return table.hasChallengedThisTurn(glimmer);
        });
    }
    alterHand(cardsToAlter, playerId) {
        if (this.rootStore.stateMachineStore.hasPlayerAlteredHand(playerId)) {
            console.error("Already Mulliganed: ", playerId);
            return;
        }
        const table = this.getTable(playerId);
        this.rootStore.log({
            type: "MULLIGAN",
            cards: cardsToAlter,
            player: playerId,
        });
        this.rootStore.stateMachineStore.trackAlteredCards(playerId, cardsToAlter.length);
        cardsToAlter.map((card) => {
            this.moveCard(card, "deck", { position: "first", skipLog: false });
            this.drawCards(playerId, 1, { skipLog: true });
        });
        while (table.zones.hand.cards.length < 7 &&
            table.zones.deck.cards.length > 0) {
            this.drawCards(playerId, 1, { skipLog: true });
        }
        if (cardsToAlter.length) {
            this.shuffleDeck(playerId);
        }
    }
    findCardZone(card) {
        const table = this.tables[card.ownerId];
        if (!table) {
            console.error("Table not found", card.ownerId);
            return;
        }
        const zones = table.zones;
        return Object.keys(zones).find((zone) => {
            return zones[zone]?.hasCard(card);
        });
    }
    getStackCards() {
        const turnPlayer = this.rootStore.activePlayer;
        return (this.rootStore.tableStore
            .getPlayerZone(turnPlayer, "play")
            ?.cards.filter((card) => card?.lorcanitoCard?.type === "action") || []);
    }
    get getPendingEffects() {
        return this.rootStore.stackLayerStore.getLayers;
    }
    move(card, to, opts = {}) {
        this.moveCard(card.instanceId, to, opts);
    }
    moveCard(instanceId = "", to, opts = {}) {
        const { skipLog = false, position = "last", discard = false, attacker, defender, effectSource, } = opts;
        const card = this.cardStore.cards[instanceId];
        if (!card) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Card not found",
                message: "Card not found",
                icon: "warning",
                autoClear: true,
            });
        }
        const owner = card?.ownerId;
        const table = this.tables[owner];
        if (!table) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Table not found",
                message: "Table not found",
                icon: "warning",
                autoClear: true,
            });
        }
        return table.moveCard(card, to, position, skipLog, discard, attacker, defender, effectSource, opts);
    }
    playCardFromHand(card, params) {
        const table = this.getTable(card.ownerId);
        const isCardInHand = table?.zones?.hand?.hasCard(card);
        if (!(isCardInHand && table)) {
            console.error("Card not in hand");
            return;
        }
        card.playFromHand(params);
    }
    get allCardsMoved() {
        const cardsMoved = {};
        Object.values(this.tables).forEach((table) => {
            cardsMoved[table.ownerId] = table.turn.cardsMoved;
        });
        return cardsMoved;
    }
    setPlayerLore(player, lore) {
        const table = this.getTable(player);
        if (!table) {
            console.error("Table not found", player);
            return;
        }
        const playerLore = table.lore;
        table.lore = lore;
        return this.rootStore.log({
            type: "LORE_CHANGE",
            player: player,
            from: playerLore,
            to: lore,
        });
    }
    shuffleDeck(player) {
        const table = this.tables[player];
        if (table?.zones.deck) {
            table.zones.deck.cards = lorcanitoShuffle(table.zones.deck.cards);
            table.zones.deck.cards.forEach((card) => {
                if (card.isRevealed) {
                    card.hide({ skipLog: true });
                }
            });
        }
        this.rootStore.log({ type: "SHUFFLE_DECK" });
        return this.rootStore.moveResponse(true);
    }
    scry(top = [], bottom = [], hand = [], inkwell = [], discard = [], play = [], 
    // No filter means No cards
    tutorFilters = [], playFilters = [], limits = {}, shouldReveal, playExerted) {
        const { top: topLimit = 0, bottom: bottomLimit = 0, hand: handLimit = 0, inkwell: inkwellLimit = 0, discard: discardLimit = 0, play: playLimit = 0, } = limits;
        // TODO: We should verify whether the player that is scrying owns the cards
        // There are effects that the opponent scries the cards
        const end = (Array.isArray(handLimit) ? handLimit.length : handLimit) || 0;
        // There are effects that require multiple filters, but a limited amount of cards per filter.
        // E.g. The Madrigal Family
        let limitPerTarget = Array.isArray(handLimit) ? handLimit : undefined;
        hand.slice(0, end).forEach((card) => {
            if (typeof limitPerTarget !== "undefined") {
                if (!limitPerTarget.length) {
                    console.log("Already taken the max amount of cards");
                    return;
                }
                if (limitPerTarget.some((filter) => card.matchesTargetFilter(filter.filters))) {
                    limitPerTarget = limitPerTarget.filter((filter) => !card.matchesTargetFilter(filter.filters));
                    card.moveTo("hand", { skipLog: true });
                    if (shouldReveal) {
                        card.reveal();
                    }
                }
            }
            else if (card.matchesTargetFilter(tutorFilters)) {
                card.moveTo("hand", { skipLog: true });
                if (shouldReveal) {
                    card.reveal();
                }
            }
            else {
                this.rootStore.sendNotification({
                    type: "icon",
                    title: "Cannot tutor card, invalid target.",
                    message: "You selected an invalid target for the effect.",
                    icon: "warning",
                    autoClear: true,
                });
            }
        });
        top.slice(0, topLimit || 0).forEach((card) => {
            card.moveTo("deck", { skipLog: true });
        });
        inkwell.slice(0, inkwellLimit || 0).forEach((card) => {
            card.moveTo("inkwell", { skipLog: true });
            card.updateCardMeta({ exerted: true });
        });
        discard
            // Not sure if a limit should be applied here
            .forEach((card) => {
            card.moveTo("discard", { skipLog: true });
        });
        bottom
            .reverse()
            .slice(0, bottomLimit || 0)
            .forEach((card) => {
            card.moveTo("deck", { position: "first", skipLog: true });
        });
        play.slice(0, playLimit || 0).forEach((card) => {
            // TODO: Improve this, too specific to The Queen - Diviner
            if (card.matchesTargetFilter(tutorFilters)) {
                if (card.matchesTargetFilter(playFilters)) {
                    this.rootStore.trace(`Playing card from scry ${card.name} (${card.instanceId})`);
                    const exerted = typeof playExerted === "undefined" || playExerted; // If playExerted not defined, it defaults to exerted. TODO: Change this behavior
                    card.playFromHand({ forFree: true, exerted: exerted });
                }
                else {
                    card.moveTo("hand", { skipLog: true });
                }
            }
            else {
                this.rootStore.sendNotification({
                    type: "icon",
                    title: "Cannot tutor card, invalid target",
                    message: "You selected an invalid target for the effect",
                    icon: "warning",
                    autoClear: true,
                });
            }
        });
        if (hand.length > end) {
            this.rootStore.sendNotification({
                type: "icon",
                title: "Too many cards in hand",
                message: `You selected ${hand.length} cards, but you can only tutor ${handLimit} cards`,
                icon: "warning",
                autoClear: true,
            });
        }
        if (play.length > playLimit) {
            this.rootStore.sendNotification({
                type: "icon",
                title: "Too many cards to play",
                message: `You selected ${play.length} cards to play, but you can only play ${playLimit} cards`,
                icon: "warning",
                autoClear: true,
            });
        }
        if (top.length > topLimit) {
            this.rootStore.sendNotification({
                type: "icon",
                title: "Too many cards on top",
                message: `You selected ${top.length} cards, but you can only put ${topLimit} cards on top`,
                icon: "warning",
                autoClear: true,
            });
        }
        if (bottom.length > bottomLimit) {
            this.rootStore.sendNotification({
                type: "icon",
                title: "Too many cards on bottom",
                message: `You selected ${bottom.length} cards, but you can only put ${bottomLimit} cards on bottom`,
                icon: "warning",
                autoClear: true,
            });
        }
        if (inkwell.length > inkwellLimit) {
            this.rootStore.sendNotification({
                type: "icon",
                title: "Too many cards on inkwell",
                message: `You selected ${inkwell.length} cards, but you can only put ${inkwellLimit} cards to the inkwell`,
                icon: "warning",
                autoClear: true,
            });
        }
        if (discard.length > discardLimit) {
            this.rootStore.sendNotification({
                type: "icon",
                title: "Too many cards on discard",
                message: `You selected ${discard.length} cards, but you can only put ${discardLimit} cards to the inkwell`,
                icon: "warning",
                autoClear: true,
            });
        }
        this.rootStore.log({
            type: "SCRY",
            top: top.length,
            bottom: bottom.length,
            inkwell: inkwell.length,
            hand: shouldReveal ? hand.map((card) => card.instanceId) : hand.length,
            discard: discard.map((card) => card.instanceId),
            play: play.map((card) => card.instanceId),
            shouldReveal,
        });
        return this.rootStore.moveResponse(true);
    }
    addToInkwell(instanceId) {
        const card = this.cardStore.cards[instanceId];
        const lorcanitoCard = card?.lorcanitoCard;
        if (!card?.inkwell) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "This card doesn't contain inkwell symbol",
                message: `You can instead right click the card and select "Move card to Inkwell" option, if you want to skip this check.`,
                icon: "warning",
                autoClear: true,
            });
        }
        if (!(card && lorcanitoCard)) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "Card not found",
                message: "Card not found",
                icon: "warning",
                autoClear: true,
            });
        }
        const owner = card.ownerId;
        const tableModel = this.getTable(owner);
        const hasReachedLimit = !tableModel.canAddToInkwell();
        if (hasReachedLimit) {
            return this.rootStore.sendNotification({
                type: "icon",
                title: "You already added a card to the inkwell this turn",
                message: `You can instead right click the card and select "Move card to Inkwell" option, if you want to skip this check.`,
                icon: "warning",
                autoClear: true,
            });
        }
        return this.moveCard(instanceId, "inkwell", {
            movedHow: "inkwell",
        });
    }
    getPlayerZone(ownerId, zone) {
        return this.getTable(ownerId)?.zones[zone];
    }
    getPlayerZoneCards(ownerId, zone) {
        return this.getTable(ownerId)?.zones[zone]?.cards || [];
    }
    getTopDeckCard(ownerId) {
        const playerDeck = this.getPlayerZone(ownerId, "deck");
        if (!(playerDeck && Array.isArray(playerDeck.cards))) {
            return undefined;
        }
        return playerDeck.cards[playerDeck.cards.length - 1];
    }
    getBottomDeckCard(ownerId) {
        const playerDeck = this.getPlayerZone(ownerId, "deck");
        if (!playerDeck) {
            return undefined;
        }
        return playerDeck.cards[0];
    }
    drawCards(ownerId, amount = 1, opts = {}) {
        const cards = [];
        [...Array(amount).keys()].forEach(() => {
            const topCard = this.getTopDeckCard(ownerId);
            const instanceId = topCard?.instanceId;
            if (!instanceId) {
                this.rootStore.debug("Empty Deck");
                const players = Object.keys(this.tables);
                const winner = ownerId === players[0] ? players[1] : players[0];
                if (winner) {
                    this.rootStore.log({
                        type: "DRAW_EMPTY_DECK",
                        player: ownerId,
                    });
                    this.rootStore.declareWinnerForMatch(winner);
                }
                return;
            }
            cards.push(instanceId);
            this.moveCard(instanceId, "hand", {
                ...opts,
                skipLog: amount > 1 || opts.skipLog,
                triggerDraw: true,
            });
        });
        if (!opts.skipLog && amount > 1) {
            this.rootStore.log({
                type: "DRAW",
                player: ownerId,
                cards,
            });
        }
        return this.rootStore.moveResponse(true);
    }
    discardCards(cards) {
        cards.forEach((card) => {
            if (this.rootStore.effectStore.hasDiscardRestriction(card)) {
                // TODO: ADD A LOG FOR THIS
                // this.rootStore.sendNotification({
                //   type: "icon",
                //   title: "Discard restriction",
                //   message:
                //     "There's a card preventing you from discarding this card. Please check the card's text for more information.",
                //   icon: "warning",
                //   autoClear: true,
                // });
                return;
            }
            card.discard();
        });
        const yourCards = cards.filter((card) => card.ownerId === this.rootStore.activePlayer);
        if (yourCards.length >= 1) {
            this.rootStore.log({
                type: "DISCARD",
                cards: yourCards.map((card) => card.instanceId),
            });
        }
        const opponentCards = cards.filter((card) => card.ownerId !== this.rootStore.activePlayer);
        if (opponentCards.length >= 1) {
            this.rootStore.log({
                type: "DISCARD",
                cards: opponentCards.map((card) => card.instanceId),
            });
        }
        return this.rootStore.moveResponse(true);
    }
}
//# sourceMappingURL=TableStore.js.map