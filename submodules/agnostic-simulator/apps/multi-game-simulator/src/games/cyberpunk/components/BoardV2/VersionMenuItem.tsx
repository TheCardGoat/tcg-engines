import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { ArrowLeftRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useInRouterContext } from "react-router";
import participantClasses from "../../../../simulator/participant-actions/SimulatorParticipantActions.module.css";
import { useCyberpunkUiVersion } from "./version";

export const V2_INVITATION_STORAGE_KEY = "tcg:cyberpunk:ui-v2-invitation:v1";

function RoutedVersionMenuItem({ onComplete }: { onComplete: () => void }) {
  const { isV2, setVersion } = useCyberpunkUiVersion();
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    try {
      setOpened(!isV2 && localStorage.getItem(V2_INVITATION_STORAGE_KEY) !== "dismissed");
    } catch {
      setOpened(!isV2);
    }
  }, [isV2]);

  const dismiss = () => {
    setOpened(false);
    try {
      localStorage.setItem(V2_INVITATION_STORAGE_KEY, "dismissed");
    } catch {
      // Blocked storage must not prevent switching or dismissing the invitation.
    }
  };
  const switchVersion = () => {
    dismiss();
    onComplete();
    setVersion(isV2 ? "v1" : "v2");
  };

  return (
    <>
      <button
        type="button"
        role="menuitem"
        className={participantClasses.menuItem}
        onClick={switchVersion}
      >
        <ArrowLeftRight size={16} aria-hidden="true" />
        <span>{isV2 ? "Return to V1" : "Try V2 · Beta"}</span>
      </button>
      {opened && (
        <Paper withBorder p="xs" role="group" aria-label="Help shape the new board">
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              Help shape the new board
            </Text>
            <Text size="sm">
              Try our new 3D board and help us improve it. V2 is in beta, so you may find bugs. Your
              game stays the same. Return to V1 at any time from this menu.
            </Text>
            <Group justify="space-between" gap="xs">
              <Button role="menuitem" variant="subtle" size="compact-sm" onClick={dismiss}>
                Dismiss invitation
              </Button>
              <Button role="menuitem" variant="light" size="compact-sm" onClick={switchVersion}>
                Try V2
              </Button>
            </Group>
          </Stack>
        </Paper>
      )}
    </>
  );
}

export function CyberpunkVersionMenuItem(props: { onComplete: () => void }) {
  return useInRouterContext() ? <RoutedVersionMenuItem {...props} /> : null;
}
