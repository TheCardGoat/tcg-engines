/**
 * Implementation of the Gundam Card Game hand limit rule:
 *
 * 3-8-4. A hand is limited to no more than ten cards.
 * 3-8-4-1. Players may have any number of cards in their hand, but if your hand exceeds
 * the limit during your end phase, you must discard cards until the limit is reached.
 *
 * 6-6-4. Hand Step
 * 6-6-4-1. If the number of cards in your hand exceeds the upper limit of 10, discard
 * cards of your choosing until you only have 10.
 */
export const handleHandLimit = (G, currentPlayer) => {
    const newG = { ...G };
    const MAX_HAND_SIZE = 10;
    // Check if player's hand size exceeds the limit
    const currentHandSize = newG.players[currentPlayer].zones.hand.length;
    if (currentHandSize > MAX_HAND_SIZE) {
    }
    return newG;
};
//# sourceMappingURL=endPhase.js.map