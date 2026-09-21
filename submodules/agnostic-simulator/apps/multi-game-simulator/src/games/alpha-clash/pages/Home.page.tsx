import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";

/** Alpha Clash simulator landing: points players at the live practice match. */
export function AlphaClashHomePage() {
  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <Stack gap="md">
        <Title order={1}>Alpha Clash</Title>
        <Text size="lg">
          Play the Alpha Clash TCG in the browser: Contenders, Clash cards, resources, the Portal,
          and the six clash steps, against a built-in practice opponent.
        </Text>
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Stack gap={4}>
              <Text fw={600}>Live practice match</Text>
              <Text size="sm" c="dimmed">
                Starter Titan versus Starter Warden — full rules enforced by the Alpha Clash engine.
              </Text>
            </Stack>
            <Button component="a" href="/alpha-clash/simulator/play/practice">
              Open practice
            </Button>
          </Group>
        </Paper>
        <Text size="sm" c="dimmed">
          Card catalog: 747 authored official cards (295 awaiting behavior authoring). Practice
          Contenders use fully-authored fixture cards while official Contender behavior lands.
        </Text>
      </Stack>
    </main>
  );
}

export default AlphaClashHomePage;
