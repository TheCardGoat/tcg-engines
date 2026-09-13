import { Button, Group, Popover, Stack, Text } from "@mantine/core";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const TIP_IDS = ["priority", "support", "opponent"] as const;
type TipId = (typeof TIP_IDS)[number];
const STORAGE_KEY = "tcg:simulator:sidebar-tips:v1";
const COPY: Record<TipId, { title: string; body: string }> = {
  priority: {
    title: "Choose when to pause",
    body: "Use priority settings to choose which windows to hold or skip. The anchor keeps your next follow-up window so you can respond.",
  },
  support: {
    title: "Help improve your next match",
    body: "Something not working? Open your menu to report a bug, share feedback, or suggest a feature—right from the match.",
  },
  opponent: {
    title: "Keep the table welcoming",
    body: "Open your opponent’s menu to view their profile or report misconduct. Reports go to the moderation team.",
  },
};
const TipsContext = createContext<{
  current: TipId | null;
  next: () => void;
  skip: () => void;
  interact: (id: TipId) => void;
} | null>(null);

/** Optional, non-modal feature discovery. Only explicit dismissal is persisted. */
export function SimulatorSidebarTips({
  children,
  enabled = true,
}: {
  readonly children: ReactNode;
  readonly enabled?: boolean;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const found = TIP_IDS.findIndex((id) => id === saved);
      setIndex(saved === "done" ? TIP_IDS.length : found >= 0 ? found : 0);
    } catch {
      setIndex(0);
    }
  }, []);
  const advance = (nextIndex: number) => {
    setIndex(nextIndex);
    try {
      window.localStorage.setItem(STORAGE_KEY, TIP_IDS[nextIndex] ?? "done");
    } catch {
      // Storage restrictions must never prevent playing or dismissing a tip.
    }
  };
  return (
    <TipsContext.Provider
      value={{
        current: enabled && !paused && index !== null ? (TIP_IDS[index] ?? null) : null,
        next: () => advance((index ?? 0) + 1),
        skip: () => advance(TIP_IDS.length),
        interact: (id) => {
          if (index !== null && TIP_IDS[index] === id) advance(index + 1);
          setPaused(true);
        },
      }}
    >
      {children}
    </TipsContext.Provider>
  );
}

export function SimulatorSidebarTip({
  id,
  children,
}: {
  readonly id: TipId;
  readonly children: ReactNode;
}) {
  const tips = useContext(TipsContext);
  if (!tips) return children;
  const copy = COPY[id];
  return (
    <Popover
      opened={tips.current === id}
      position={id === "opponent" ? "bottom-start" : "top-start"}
      width={264}
      zIndex={5100}
      transitionProps={{ duration: 0 }}
      withArrow
      withinPortal
      trapFocus={false}
      closeOnClickOutside={false}
      closeOnEscape
      onDismiss={tips.skip}
    >
      <Popover.Target>
        <span
          style={{ display: "inline-flex", minWidth: 0 }}
          onClickCapture={() => tips.interact(id)}
        >
          {children}
        </span>
      </Popover.Target>
      <Popover.Dropdown aria-label={copy.title} maw="calc(100vw - 16px)">
        <Stack gap="xs">
          <Text size="sm" fw={600}>
            {copy.title}
          </Text>
          <Text size="sm">{copy.body}</Text>
          <Group justify="space-between" gap="xs">
            <Button variant="subtle" size="compact-sm" onClick={tips.skip}>
              Skip tips
            </Button>
            <Button variant="light" size="compact-sm" onClick={tips.next}>
              {id === "opponent" ? "Got it" : "Next tip"}
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
