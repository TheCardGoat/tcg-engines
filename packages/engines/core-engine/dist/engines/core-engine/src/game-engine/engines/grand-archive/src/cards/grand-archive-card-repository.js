/**
 * Grand Archive Card Repository
 *
 * Extends CoreEngine's card repository for Grand Archive specific functionality
 */
import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import { logger } from "~/game-engine/core-engine/utils/logger";
import { allGrandArchiveCardsById } from "./definitions/cards";
/**
 * Grand Archive card repository implementation
 */
export class GrandArchiveCardRepository extends CardRepository {
    constructor(cards) {
        const processedCards = GrandArchiveCardRepository.processCards(cards);
        const dictionary = GrandArchiveCardRepository.createDictionary(cards);
        super(dictionary, processedCards);
    }
    /**
     * Process cards for CardRepository format
     */
    static processCards(cards) {
        const processedCards = {};
        const allInstanceIds = new Set();
        logger.info("Processing Grand Archive cards for repository");
        for (const [playerId, playerCards] of Object.entries(cards)) {
            logger.debug(`Processing cards for player: ${playerId}`);
            for (const [instanceId, publicId] of Object.entries(playerCards)) {
                // Validate unique instance IDs across all players
                if (allInstanceIds.has(instanceId)) {
                    const error = `Duplicate instance ID found: ${instanceId}`;
                    logger.error(error);
                    throw new Error(error);
                }
                allInstanceIds.add(instanceId);
                // Get card definition from registry
                const cardDefinition = allGrandArchiveCardsById[publicId];
                if (!cardDefinition) {
                    const error = `Card definition not found for public ID: ${publicId}`;
                    logger.error(error);
                    throw new Error(error);
                }
                // Validate card is implemented
                if (!cardDefinition.implemented) {
                    logger.warn(`Adding unimplemented card to repository: ${cardDefinition.name} (${publicId})`);
                }
                processedCards[instanceId] = cardDefinition;
            }
        }
        logger.info(`Grand Archive card repository processed ${Object.keys(processedCards).length} card instances`);
        return processedCards;
    }
    /**
     * Create dictionary for CardRepository
     */
    static createDictionary(cards) {
        return cards;
    }
    /**
     * Get all card instance IDs
     */
    getAllInstanceIds() {
        return Object.keys(this.dictionary).flatMap((playerId) => Object.keys(this.dictionary[playerId]));
    }
    /**
     * Get all card definitions
     */
    getAllDefinitions() {
        return this.getAllInstanceIds()
            .map((instanceId) => this.getCardByInstanceId(instanceId))
            .filter((card) => card !== undefined);
    }
    /**
     * Check if card exists by instance ID
     */
    hasCard(instanceId) {
        return this.getCardByInstanceId(instanceId) !== undefined;
    }
    /**
     * Get cards by type
     */
    getCardsByType(cardType) {
        return this.getAllDefinitions().filter((card) => card.type === cardType);
    }
    /**
     * Get cards by element
     */
    getCardsByElement(element) {
        return this.getAllDefinitions().filter((card) => card.element === element);
    }
    /**
     * Get implemented cards only
     */
    getImplementedCards() {
        return this.getAllDefinitions().filter((card) => card.implemented);
    }
    /**
     * Get cards with specific keyword
     */
    getCardsWithKeyword(keyword) {
        return this.getAllDefinitions().filter((card) => card.keywords?.includes(keyword));
    }
    /**
     * Get cards with specific subtype
     */
    getCardsWithSubtype(subtype) {
        return this.getAllDefinitions().filter((card) => card.subtypes?.includes(subtype));
    }
    /**
     * Get cards by cost range
     */
    getCardsByCostRange(minCost, maxCost) {
        return this.getAllDefinitions().filter((card) => {
            const cost = card.reserveCost || card.memoryCost || 0;
            return cost >= minCost && cost <= maxCost;
        });
    }
    /**
     * Search cards by name (case-insensitive)
     */
    searchCardsByName(nameQuery) {
        const query = nameQuery.toLowerCase();
        return this.getAllDefinitions().filter((card) => card.name.toLowerCase().includes(query));
    }
    /**
     * Get card statistics
     */
    getRepositoryStats() {
        const allCards = this.getAllDefinitions();
        return {
            totalCards: allCards.length,
            implementedCards: allCards.filter((card) => card.implemented).length,
            cardsByType: this.groupCardsByProperty(allCards, "type"),
            cardsByElement: this.groupCardsByProperty(allCards, "element"),
            cardsBySet: this.groupCardsByProperty(allCards, "set"),
        };
    }
    /**
     * Helper to group cards by property
     */
    groupCardsByProperty(cards, property) {
        const groups = {};
        for (const card of cards) {
            const value = String(card[property]);
            groups[value] = (groups[value] || 0) + 1;
        }
        return groups;
    }
    /**
     * Validate repository integrity
     */
    validateRepository() {
        try {
            const instanceIds = this.getAllInstanceIds();
            const uniqueInstanceIds = new Set(instanceIds);
            if (instanceIds.length !== uniqueInstanceIds.size) {
                logger.error("Repository integrity check failed: duplicate instance IDs");
                return false;
            }
            // Validate all cards have definitions
            for (const instanceId of instanceIds) {
                const definition = this.getCardByInstanceId(instanceId);
                if (!definition) {
                    logger.error(`Repository integrity check failed: missing definition for instance ${instanceId}`);
                    return false;
                }
            }
            logger.info("Repository integrity check passed");
            return true;
        }
        catch (error) {
            logger.error(`Repository integrity check failed: ${error}`);
            return false;
        }
    }
}
//# sourceMappingURL=grand-archive-card-repository.js.map