/**
 * Place DON!! move for One Piece TCG
 *
 * During DON!! Phase, place up to 2 DON!! cards from DON!! deck to cost area
 */
export const placeDon = ({ G, ctx, coreOps, playerID }, count) => {
    // Validate count (max 2 per turn)
    if (count < 1 || count > 2) {
        return G; // Invalid move
    }
    const donDeckZone = coreOps.getZone("donDeck", playerID);
    const cardsToPlace = Math.min(count, donDeckZone.cards.length);
    for (let i = 0; i < cardsToPlace; i++) {
        coreOps.moveCard({
            playerId: playerID,
            from: "donDeck",
            to: "costArea",
            destination: "end",
        });
    }
    return G;
};
//# sourceMappingURL=placeDon.js.map