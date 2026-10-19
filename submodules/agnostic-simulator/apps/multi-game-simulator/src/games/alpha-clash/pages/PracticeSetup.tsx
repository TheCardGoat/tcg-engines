import { useEffect, useState } from "react";
import { Button, Group, Paper, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import {
  alphaClashPracticeDecks,
  ALPHA_CLASH_PRACTICE_STRATEGIES,
  ALPHA_CLASH_RECOMMENDED_PRACTICE_STRATEGY,
} from "@tcg/alpha-clash-server-adapter/practice";
import type { AlphaClashPracticeSetupInput } from "../practice-setup";
import type { PracticeMode } from "../../../simulator/practiceMode";
import classes from "./Practice.module.css";

export function AlphaClashPracticeSetup({
  error,
  initialMode,
  onStart,
}: {
  error?: string;
  initialMode: PracticeMode;
  onStart: (input: AlphaClashPracticeSetupInput, mode: PracticeMode) => void;
}) {
  const [playerDeckId, setPlayerDeckId] = useState("clarity-hyper-aggro");
  const [opponentDeckId, setOpponentDeckId] = useState("absence-makati");
  const [strategyId, setStrategyId] = useState<string>(ALPHA_CLASH_RECOMMENDED_PRACTICE_STRATEGY);
  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [seed, setSeed] = useState("1");
  useEffect(() => {
    setSeed(String(Math.floor(Math.random() * 0x7fffffff)));
  }, []);
  const decks = alphaClashPracticeDecks.map(({ id, name }) => ({ value: id, label: name }));
  return (
    <main className={`${classes.page} ${classes.setupPage}`} data-testid="ac-practice-setup">
      <Paper
        component="form"
        withBorder
        p="xl"
        radius="lg"
        className={classes.setupCard}
        onSubmit={(event) => {
          event.preventDefault();
          onStart({ playerDeckId, opponentDeckId, strategyId, seed }, mode);
        }}
      >
        <Stack gap="lg">
          <Stack gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase">
              Local practice
            </Text>
            <Title order={1}>Alpha Clash</Title>
            <Text>Choose your deck and opponent. You start the match.</Text>
          </Stack>
          {error && (
            <Text c="red" role="alert">
              {error}
            </Text>
          )}
          <div className={classes.setupDecks}>
            <Select
              label="Your deck"
              data={decks}
              value={playerDeckId}
              allowDeselect={false}
              onChange={(value) => value && setPlayerDeckId(value)}
            />
            <Select
              label="Opponent deck"
              data={decks}
              value={opponentDeckId}
              allowDeselect={false}
              onChange={(value) => value && setOpponentDeckId(value)}
            />
          </div>
          <Group align="flex-start" grow>
            <Select
              label="Practice mode"
              data={[
                { value: "bot", label: "Play against a bot" },
                { value: "self", label: "Play both sides" },
              ]}
              value={mode}
              allowDeselect={false}
              onChange={(value) => (value === "bot" || value === "self") && setMode(value)}
            />
            <Select
              label="Bot opponent"
              disabled={mode === "self"}
              data={ALPHA_CLASH_PRACTICE_STRATEGIES.map(({ id, name }) => ({
                value: id,
                label: name,
              }))}
              value={strategyId}
              allowDeselect={false}
              onChange={(value) => value && setStrategyId(value)}
            />
          </Group>
          <Text size="sm" c="dimmed">
            Clarity uses 50 main cards. The Absence uses 60. These are the same lists used in
            bot-lab. Sideboards are not used.
            {mode === "bot" &&
              strategyId === ALPHA_CLASH_RECOMMENDED_PRACTICE_STRATEGY &&
              " The recommended bot can inspect hidden cards when it chooses a move."}
          </Text>
          <TextInput
            label="Match seed"
            description="Use the same seed to repeat the opening hands."
            value={seed}
            onChange={(event) => setSeed(event.currentTarget.value)}
            required
          />
          <Group justify="space-between">
            <Button component="a" href="/alpha-clash/simulator" variant="subtle">
              Back
            </Button>
            <Button type="submit" disabled={!seed.trim()}>
              Start practice
            </Button>
          </Group>
        </Stack>
      </Paper>
    </main>
  );
}
