import { Button, Group, Stack, Text } from "@mantine/core";
import { useMatchSession } from "./MatchSessionProvider";

/** Place inside blocking dialogs so recovery remains keyboard-accessible. */
export function MatchSessionRecovery() {
  const { refresh, refreshing, error } = useMatchSession();
  return (
    <Stack gap="xs">
      {error && (
        <Text size="sm" c="red" role="alert">
          {error}
        </Text>
      )}
      <Group justify="flex-end" gap="xs">
        <Text size="xs" role="status" flex={1} c="dimmed">
          {refreshing ? "Refreshing match…" : error ? "Reconnecting automatically…" : null}
        </Text>
        <Button
          variant="subtle"
          color="gray"
          size="xs"
          mih="var(--simulator-action-rail-height, 2.75rem)"
          loading={refreshing}
          onClick={() => void refresh()}
        >
          Refresh match
        </Button>
      </Group>
    </Stack>
  );
}
