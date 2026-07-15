import { notifications } from "@mantine/notifications";

const BLOCKED_PASS_NOTIFICATION_ID = "cyberpunk-blocked-pass-turn";
const BLOCKED_PASS_NOTIFICATION_THROTTLE_MS = 1200;

let lastBlockedPassNotificationAt = 0;

export function showBlockedPassTurnNotification(reason: string): void {
  const now = Date.now();
  if (now - lastBlockedPassNotificationAt < BLOCKED_PASS_NOTIFICATION_THROTTLE_MS) {
    return;
  }
  lastBlockedPassNotificationAt = now;

  notifications.show({
    id: BLOCKED_PASS_NOTIFICATION_ID,
    color: "yellow",
    title: "Pass Turn blocked",
    message: reason,
    autoClose: 3200,
  });
}
