import { Badge, Popover, Stack, Text } from "@mantine/core";
import type { SimulatorSeat } from "@tcg/simulator-contract";
import { useState } from "react";
import classes from "./GrandArchiveStatuses.module.css";

export function GrandArchivePlayerStatuses({ seat }: { readonly seat: SimulatorSeat }) {
  const [opened, setOpened] = useState(false);
  const effects = seat.activeEffects ?? [];
  if (effects.length === 0) return null;
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      withArrow
      withinPortal
      trapFocus
      returnFocus
      width={280}
    >
      <Popover.Target>
        <button
          type="button"
          className={classes.playerTrigger}
          aria-label={`Inspect player states for ${seat.label}`}
          aria-expanded={opened}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setOpened(!opened);
          }}
        >
          {effects.slice(0, 2).map((effect) => (
            <Badge key={effect.id} size="xs" variant="filled" color="dark">
              {effect.label}
            </Badge>
          ))}
          {effects.length > 2 ? (
            <Badge size="xs" color="dark">
              +{effects.length - 2}
            </Badge>
          ) : null}
        </button>
      </Popover.Target>
      <Popover.Dropdown onClick={(event) => event.stopPropagation()}>
        <Stack gap="xs" role="region" aria-label={`Player states for ${seat.label}`}>
          <Text fw={700} size="sm">
            {seat.label}
          </Text>
          {effects.map((effect) => (
            <Text key={effect.id} size="sm">
              {effect.sourceLabel}: {effect.detail}
            </Text>
          ))}
          <button type="button" className={classes.close} onClick={() => setOpened(false)}>
            Close player states
          </button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
