import { Button, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { createContext } from "react";
import { useTableBotControls } from "./useTableBotControls";

/** V2 replaces the legacy sidebar automation row on local tables. */
export const LocalTableControlsContext = createContext(false);

/** Local controls act on the same engine; changing seats never rebuilds the table. */
export function LocalTableControls() {
  const { engine, botOn, mode, canStep, toggleTakeover, setMode } = useTableBotControls();
  if (engine.isRemote) return null;
  return (
    <Stack gap="xs" aria-label="Table and bot controls">
      <Text size="sm" fw={700}>
        Table and bot controls
      </Text>
      <Text size="xs" role="status">
        {engine.aiTakeover
          ? "You control the opponent"
          : botOn
            ? `Bot: ${engine.aiMode === "step" ? "paused" : "automatic"}`
            : "Bot off · you control both players"}
      </Text>
      <SegmentedControl
        fullWidth
        aria-label="Bot mode"
        value={mode}
        disabled={engine.matchState.G.gameEnded || engine.boardCorrectionEnabled}
        data={[
          { value: "off", label: "Bot off" },
          { value: "step", label: "Step" },
          { value: "auto", label: "Auto" },
        ]}
        onChange={setMode}
      />
      <Group grow>
        <Button
          variant="light"
          disabled={!canStep || engine.boardCorrectionEnabled || engine.matchState.G.gameEnded}
          onClick={engine.stepOnce}
        >
          Next bot decision
        </Button>
        <Button variant="light" disabled={engine.matchState.G.gameEnded} onClick={toggleTakeover}>
          {engine.aiTakeover ? "Return to bot" : botOn ? "Take over opponent" : "Switch player"}
        </Button>
      </Group>
      <Text size="xs">
        Viewing Player {engine.humanSide === "player" ? "1" : "2"}. Bot steps make one decision,
        including choices and reactions.
      </Text>
      {engine.boardCorrectionEnabled ? (
        <Text size="xs">Exit board correction to run the bot.</Text>
      ) : null}
    </Stack>
  );
}
