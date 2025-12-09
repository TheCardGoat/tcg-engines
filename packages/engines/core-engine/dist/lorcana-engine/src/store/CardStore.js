import { Random } from "@lorcanito/lorcana-engine/lib/shuffle/random";
import { CardModel, } from "@lorcanito/lorcana-engine/store/models/CardModel";
import { createTargetFiltersPredicate } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
import { makeAutoObservable } from "mobx";
import { AbilityModel } from "..";
export class CardStore {
    dependencies;
    cards;
    // This variable is used to keep track of cards moving during the same move. Kind of a hacky way of achieving:
    // 8.7.3. Whenever a triggered ability’s condition is met, the ability is added to the bag by the player who played the card with the
    // triggered ability. If multiple triggered abilities happen at the same time, they’re added to the bag simultaneously by the
    // respective players.
    temporary;
    rootStore;
    observable;
    constructor(initialState = {}, dependencies, rootStore, observable) {
        this.rootStore = rootStore;
        this.dependencies = dependencies;
        this.cards = {};
        this.temporary = {};
        Object.keys(initialState).forEach((instanceId) => {
            const card = initialState[instanceId];
            if (card) {
                this.cards[instanceId] = new CardModel(instanceId, card.publicId, null, // I'm not sure yet I should remove this from the model, it's currently being handle in a separate store
                card.ownerId, 
                // I'm not sure if this is a good idea
                this.rootStore, observable);
            }
        });
        this.observable = observable;
        if (observable) {
            makeAutoObservable(this, {
                rootStore: false,
                dependencies: false,
            });
        }
    }
    sync() {
        this.clearTemporary();
    }
    // Doing like this to leverage computed properties while not breaking expect toJSON behaviour
    // https://mobx.js.org/computeds.html
    toJSON() {
        return {};
    }
    getCardIdsMapping() {
        return Object.keys(this.cards).reduce((acc, instanceId) => {
            const card = this.cards[instanceId];
            if (!card) {
                return acc;
            }
            acc[instanceId] = card.publicId;
            return acc;
        }, {});
    }
    getCardsIdsAndNames() {
        return Object.keys(this.cards).reduce((acc, instanceId) => {
            const card = this.cards[instanceId];
            if (!card) {
                return acc;
            }
            acc[instanceId] = card.fullName;
            return acc;
        }, {});
    }
    hasCard(instanceId) {
        if (!instanceId) {
            return false;
        }
        return !!this.cards[instanceId];
    }
    getCard(instanceId) {
        if (!instanceId) {
            console.error("Card not found: ", instanceId);
            return undefined;
        }
        const card = this.cards[instanceId];
        if (!card) {
            console.error("Card not found: ", instanceId);
            return undefined;
        }
        return card;
    }
    // TODO: get all cards could be all cards in game, and not the full set of cards
    get getAllCards() {
        return Object.values(this.cards || {});
    }
    get characterCardsInPlay() {
        const charsInPlay = [
            { filter: "zone", value: ["play"] },
            { filter: "type", value: "character" },
        ];
        return this.rootStore.cardStore.getCardsByTargetFilter(charsInPlay);
    }
    get locationsInPlay() {
        return this.locationCardsInPlay.filter((card) => card.type === "location");
    }
    get locationCardsInPlay() {
        const charsInPlay = [
            { filter: "zone", value: "play" },
            { filter: "type", value: "location" },
        ];
        return this.rootStore.cardStore.getCardsByTargetFilter(charsInPlay);
    }
    get cardsInPlay() {
        const filters = [
            { filter: "zone", value: ["play"] },
            { filter: "type", value: ["character", "item", "location"] },
        ];
        return this.getCardsByTargetFilter(filters);
    }
    get cardsInDiscard() {
        const filters = [
            { filter: "zone", value: ["discard"] },
            { filter: "type", value: ["character", "item", "location"] },
        ];
        return this.getCardsByTargetFilter(filters);
    }
    get cardsInPlayAndDiscard() {
        const filters = [
            { filter: "zone", value: ["play", "discard"] },
            { filter: "type", value: ["character", "item", "location"] },
        ];
        return this.getCardsByTargetFilter(filters);
    }
    get cardsInPlayYouOwn() {
        const filters = [
            { filter: "zone", value: ["play"] },
            { filter: "owner", value: "self" },
            { filter: "type", value: ["character", "item", "location"] },
        ];
        return this.getCardsByTargetFilter(filters);
    }
    getCardsByTargetFilter(filters, responder, source, excludeSelf, params) {
        // TODO: No filters means no cards
        if (!filters) {
            return [];
        }
        const predicate = createTargetFiltersPredicate(this.rootStore, responder, filters, source, excludeSelf, params);
        // TODO: We can optimize this getAllCards
        return this.getAllCards.filter(predicate);
    }
    // TODO: We can optimize this functions, some filters are heavy to compute and best to filter the cards by the most specific filter first
    getCardsByAbilityFilter(filters = []) {
        return this.rootStore.cardStore
            .getCardsByTargetFilter([
            { filter: "zone", value: "play" },
            { filter: "type", value: ["character", "item", "location"] },
        ])
            .filter((card) => this.rootStore.effectStore.getAbilitiesForCard(card, filters).length >
            0);
    }
    // todo: move this to cardModel
    // TODO: combine this with CardModel.play
    shiftCard(shifter, shifted, costs) {
        const table = this.rootStore.tableStore.getTable(shifter?.ownerId);
        if (!(shifter && shifter.hasShift && shifted && table)) {
            this.rootStore.sendNotification({
                type: "icon",
                title: "Shift Card not found",
                message: "Card not found",
                icon: "warning",
                autoClear: true,
            });
            return this.rootStore.moveResponse(false);
        }
        if (!shifter.canShiftInto(shifted)) {
            this.rootStore.sendNotification({
                type: "icon",
                title: "Can't shift",
                message: "Invalid target",
                icon: "warning",
                autoClear: true,
            });
            return this.rootStore.moveResponse(false);
        }
        if (!shifter.canPayShiftCosts(costs)) {
            this.rootStore.sendNotification({
                type: "icon",
                title: "Not enough ink",
                message: "You can drag the card from hand on top of the card you want to shift, to skip paying costs.",
                icon: "warning",
                autoClear: true,
            });
            return this.rootStore.moveResponse(false);
        }
        shifter.payCosts(shifter.shiftCosts, costs);
        this.rootStore.tableStore.moveCard(shifter.instanceId, "play");
        const shiftedMeta = shifted.meta || {};
        const combinedMeta = {
            ...shiftedMeta,
            shifted: shifted.instanceId,
        };
        // TODO: Triggering before updating meta can have adverse consequences
        // If we move down, we have to validate whether StaticTriggeredStore grabs the trigger ability, we filter out from filter characters that are shifted.
        // They do not count as being in the game at all
        this.rootStore.triggeredStore.onShift(shifted, {
            shifted,
            shifter,
        });
        shifted.updateCardMeta({ shifter: shifter.instanceId });
        shifter.updateCardMeta(combinedMeta);
        if (shifter.meta.location) {
            const location = this.rootStore.cardStore.getCard(shifter.meta.location);
            if (location) {
                shifted.leaveLocation({
                    shifting: true,
                });
                shifter.enterLocation(location, {
                    shifting: true,
                });
            }
        }
        this.rootStore.continuousEffectStore.moveEffectsToCard({
            from: shifted,
            to: shifter,
        });
        this.rootStore.log({
            type: "SHIFT",
            shifter: shifter.instanceId,
            shifted: shifted.instanceId,
            costs: costs?.map((c) => c.instanceId),
        });
        if (shifter.hasBodyguard) {
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
                                    value: shifter.instanceId,
                                },
                            ],
                        },
                    },
                ],
            }, shifter, this.rootStore, this.rootStore.observable);
            this.rootStore.stackLayerStore.addAbilityToStack(abilityModel, shifter);
        }
        return shifter.onPlay({ hasShifted: true });
    }
    singCard(song, singer) {
        return singer.sing(song);
    }
    challenge(attackerId, defenderId) {
        const attacker = this.cards[attackerId || ""];
        const defender = this.cards[defenderId || ""];
        if (!(attacker && defender && attackerId && defenderId)) {
            console.error("attackerId or defenderId is undefined");
            return;
        }
        attacker.challenge(defender);
    }
    shuffleCardIntoDeck(instanceId) {
        const card = this.cards[instanceId];
        if (!(instanceId && card)) {
            this.rootStore.debug("Card not found", instanceId);
            return;
        }
        this.rootStore.tableStore.moveCard(instanceId, "deck");
        this.rootStore.tableStore.shuffleDeck(card.ownerId);
        // this.rootStore.log({ type: "SHUFFLE_CARD_INTO_DECK" });
        this.rootStore.log({
            type: "SHUFFLE_CARD",
            instanceId: instanceId,
        });
    }
    pickACardAtRandom(cards) {
        const random = new Random({ seed: this.rootStore.seed });
        return random.api().Shuffle([...cards])[0];
    }
    getTemporaryCards(moveCount) {
        return this.temporary[moveCount] || [];
    }
    addToTemporary(moveCount, card) {
        if (this.temporary[moveCount]) {
            this.temporary[moveCount].push(card);
        }
        else {
            this.temporary[moveCount] = [card];
        }
    }
    clearTemporary() {
        this.temporary = {};
    }
}
//# sourceMappingURL=CardStore.js.map