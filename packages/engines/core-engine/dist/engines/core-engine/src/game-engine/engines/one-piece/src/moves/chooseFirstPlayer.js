/**
 * Choose First Player move for One Piece TCG
 *
 * Based on One Piece rules:
 * - Both players determine Player One and Player Two using a method such as rock paper scissors
 * - The winner decides who becomes Player One
 */
export const chooseFirstPlayer = ({ G, coreOps }, targetPlayerId) => {
    coreOps.setOTP(targetPlayerId);
    return G;
};
//# sourceMappingURL=chooseFirstPlayer.js.map