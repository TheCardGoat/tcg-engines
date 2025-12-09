/**
 * Concede move for One Piece TCG
 *
 * Player forfeits the game, making the opponent the winner
 */
export const concede = ({ G, ctx, playerID, coreOps, }) => {
    coreOps.concede(playerID);
    return G;
};
//# sourceMappingURL=concede.js.map