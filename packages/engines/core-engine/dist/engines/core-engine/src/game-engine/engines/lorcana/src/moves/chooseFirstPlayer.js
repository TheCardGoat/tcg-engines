export const chooseWhoGoesFirstMove = ({ G, coreOps }, playerId) => {
    coreOps.setOTP(playerId);
    coreOps.setPendingMulligan(coreOps.getPlayers());
    coreOps.setPriorityPlayer(playerId);
    return G;
};
//# sourceMappingURL=chooseFirstPlayer.js.map