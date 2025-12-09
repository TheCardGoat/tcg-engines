function noOp() { }
export const noOpDeps = {
    logger: { log: noOp, batchLogs: noOp },
    notifier: {
        sendNotification: noOp,
        clearNotification: noOp,
        clearAllNotifications: noOp,
    },
    playerId: "player_one",
    modals: {
        openYesOrNoModal: noOp,
        openTargetModal: noOp,
        openScryModal: noOp,
    },
};
//# sourceMappingURL=dependencies.js.map