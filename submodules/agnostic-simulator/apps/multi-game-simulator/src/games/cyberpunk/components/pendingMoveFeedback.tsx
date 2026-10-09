import { Button, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";

const PENDING_MOVE_NOTIFICATION_ID = "cyberpunk-pending-move-sync";

export function PendingMoveRecoveryMessage({
  onReload = () => window.location.reload(),
}: {
  onReload?: () => void;
}) {
  return (
    <Stack gap="xs">
      <Text size="sm">
        Your previous move is still waiting for confirmation. If this continues, refresh your
        browser to reconnect to the current game state.
      </Text>
      <Button size="compact-sm" variant="light" onClick={onReload}>
        Refresh browser
      </Button>
    </Stack>
  );
}

export function showPendingMoveRecoveryNotification(): void {
  notifications.show({
    id: PENDING_MOVE_NOTIFICATION_ID,
    color: "yellow",
    title: "Game synchronization delayed",
    message: <PendingMoveRecoveryMessage />,
    autoClose: false,
  });
}

export function hidePendingMoveRecoveryNotification(): void {
  notifications.hide(PENDING_MOVE_NOTIFICATION_ID);
}
