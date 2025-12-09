// **3.1.6.1. **Step 1 – The player selects any number of cards from their hand and places them on the bottom of their deck without revealing them.
// **3.1.6.2. **Step 2 – The player draws until they have 7 cards in their hand.
// **3.1.6.3. **Step 3 – In turn order, each other player completes steps 1 and 2 if they choose to alter their hand.
// **3.1.6.4. **Step 4 – Each player who altered their hand by 1 or more cards shuffles their deck.
// **3.1.6.5. **Step 5 – Each player who altered their hand offers an opposing player a chance to cut their deck. Note that some play events may allow additional randomizing methods or require specific ones.
export const alterHandMove = ({ G, playerID, coreOps }, ...cardsToAlter) => {
    const newG = { ...G };
    const currentPlayer = playerID;
    coreOps.playerHasMulliganed(currentPlayer);
    // Step 1 - The player selects any number of cards from their hand and places them on the bottom of their deck
    if (cardsToAlter.length > 0) {
        for (const card of cardsToAlter) {
            coreOps.moveCard({
                playerId: currentPlayer,
                instanceId: card,
                from: "hand",
                to: "deck",
                destination: "end",
            });
        }
    }
    // Step 2 - The player draws until they have 7 cards in their hand
    const cardsInHand = coreOps.getZone("hand", currentPlayer).cards.length;
    const cardsToDraw = 7 - cardsInHand;
    if (cardsToDraw > 0) {
        const cardsInDeck = coreOps.getZone("deck", currentPlayer).cards.length;
        const numToDraw = Math.min(cardsToDraw, cardsInDeck);
        for (let i = 0; i < numToDraw; i++) {
            coreOps.moveCard({
                playerId: currentPlayer,
                from: "deck",
                to: "hand",
                destination: "end",
            });
        }
    }
    // Step 3 - Pass priority to the next player who hasn't altered their hand yet
    coreOps.passPriority();
    // Step 4 - Each player who altered their hand shuffles their deck
    coreOps.shuffleZone("deck", currentPlayer);
    return newG;
};
//# sourceMappingURL=alterHand.js.map