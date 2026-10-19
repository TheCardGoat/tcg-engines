import { Badge, Popover, Stack, Text } from "@mantine/core";
import type { SimulatorEntityDecoration } from "@tcg/simulator-contract";
import { useState } from "react";
import classes from "./GrandArchiveStatuses.module.css";

export function isGrandArchiveStatus(decoration: SimulatorEntityDecoration): boolean {
  return (
    decoration.id.startsWith("ga:state:") ||
    decoration.id.startsWith("ga:activation:") ||
    decoration.id.startsWith("ga:keyword:")
  );
}

/** Visible labels use the shared badge primitive; the inspector preserves activation scope. */
export function GrandArchiveStatuses({
  title,
  statuses,
  zIndex,
}: {
  readonly title: string;
  readonly zIndex?: number;
  readonly statuses: readonly SimulatorEntityDecoration[];
}) {
  const [opened, setOpened] = useState(false);
  if (statuses.length === 0) return null;
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      withArrow
      withinPortal
      trapFocus
      returnFocus
      width={260}
      zIndex={zIndex}
    >
      <Popover.Target>
        <button
          type="button"
          className={classes.trigger}
          aria-label={`Inspect states on ${title}: ${statuses.map((status) => status.ariaLabel).join("; ")}`}
          aria-expanded={opened}
          data-sim-primary-click-owner="status-inspection"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setOpened(!opened);
          }}
        >
          {statuses.slice(0, 2).map((status) => (
            <Badge
              key={status.id}
              size="xs"
              variant="filled"
              color={status.tone === "negative" ? "red" : "dark"}
              title={status.ariaLabel}
            >
              {status.content.kind === "text" ? status.content.text : status.ariaLabel}
            </Badge>
          ))}
          {statuses.length > 2 ? (
            <Badge size="xs" color="dark">
              +{statuses.length - 2}
            </Badge>
          ) : null}
        </button>
      </Popover.Target>
      <Popover.Dropdown onClick={(event) => event.stopPropagation()}>
        <Stack gap="xs" role="region" aria-label={`States on ${title}`}>
          <Text size="sm" fw={700}>
            {title}
          </Text>
          {statuses.map((status) => (
            <Text key={status.id} size="sm">
              {status.ariaLabel}
            </Text>
          ))}
          <button type="button" className={classes.close} onClick={() => setOpened(false)}>
            Close states
          </button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
