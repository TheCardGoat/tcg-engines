import { Alert, Button, Group, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

import { useEngine } from "../engine";
import { SETUP_SYNC_STALL_GRACE_MS, isSetupStateStale } from "./setupSyncStall";

/**
 * True while the local board is stuck in the pre-deal setup state — the
 * engine phase is `setup`, no hands have been dealt, and no pending choice
 * exists. A healthy match passes through this state in moments, so a
 * sustained reading means this client missed its setup `state_update`s.
 *
 * After {@link SETUP_SYNC_STALL_GRACE_MS} the hook fires `onSync` once (the
 * authoritative re-sync request) and surfaces the recovery notice. The notice
 * hides itself as soon as real setup state arrives.
 */
export function useSetupSyncStall(onSync?: () => void): boolean {
  const { matchState, humanSide } = useEngine();
  const stale = isSetupStateStale(matchState, humanSide);
  const [visible, setVisible] = useState(false);
  const autoSyncedRef = useRef(false);

  useEffect(() => {
    if (!stale || !onSync) {
      setVisible(false);
      autoSyncedRef.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      if (!autoSyncedRef.current) {
        autoSyncedRef.current = true;
        onSync();
      }
      setVisible(true);
    }, SETUP_SYNC_STALL_GRACE_MS);
    return () => window.clearTimeout(timer);
  }, [stale, onSync]);

  return visible && stale;
}

/**
 * Recovery affordance for a missed setup update: tells the player what is
 * wrong (the opening setup never arrived), what we already did about it
 * (requested a fresh copy), and gives direct Sync / Reload actions so the
 * expected behavior never silently strands a seat.
 */
export function SetupSyncNotice({ onSync }: { onSync?: () => void }) {
  return (
    <div
      role="status"
      data-testid="cyberpunk-setup-sync-notice"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 210,
        transform: "translateX(-50%)",
        zIndex: 60,
        width: "min(420px, calc(100vw - 32px))",
      }}
    >
      <Alert variant="filled" color="yellow" title="Board may be out of date">
        <Stack gap="xs">
          <Text size="sm">
            The opening setup hasn&apos;t arrived on this screen. A fresh copy was requested — if
            the board stays empty, sync again or reload the page. Your match is not lost: it resumes
            from the live state once the board catches up.
          </Text>
          <Group gap="xs">
            <Button
              size="compact-sm"
              variant="light"
              data-testid="cyberpunk-setup-sync-now"
              onClick={onSync}
            >
              Sync board
            </Button>
            <Button size="compact-sm" variant="default" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </Group>
        </Stack>
      </Alert>
    </div>
  );
}
