import type { Dependencies } from "@lorcanito/lorcana-engine/store/types";

function noOp() {}

export const noOpDeps: Dependencies = {
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
