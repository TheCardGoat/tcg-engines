import { Alert, Button, Text } from "@mantine/core";
import { runtimeRecoveryMessage } from "@tcg/protocol";
import type { LiveRuntimeRecovery } from "./liveRuntimeRecovery";

export function LiveRuntimeRecoveryBanner({
  recovery,
  onRetry,
}: {
  recovery: LiveRuntimeRecovery;
  onRetry: () => void;
}) {
  const title =
    recovery.phase === "review"
      ? "Board refreshed"
      : recovery.code === "game_state_incompatible"
        ? "Game update required"
        : "Server problem";
  return (
    <Alert color={recovery.phase === "review" ? "blue" : "orange"} title={title} role="alert">
      <Text size="sm">
        {recovery.phase === "review"
          ? "Check the board before taking another action. No action was sent again automatically."
          : runtimeRecoveryMessage(recovery.code)}
      </Text>
      {recovery.phase === "syncing" && <Text size="sm">Checking the latest board…</Text>}
      {recovery.phase === "blocked" && (
        <Button size="xs" variant="light" mt="xs" onClick={onRetry}>
          Retry board refresh
        </Button>
      )}
      {recovery.incidentId && (
        <Text size="xs" mt="xs">
          Support reference: {recovery.incidentId}
        </Text>
      )}
    </Alert>
  );
}
