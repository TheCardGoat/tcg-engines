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
                Choose Clarity Hyper Aggro or The Absence from Makati, then play against the
                recommended opponent or control both sides.
              </Text>
            </Stack>
            <Button component="a" href="/alpha-clash/simulator/play/practice">
              Open practice
            </Button>
          </Group>
        </Paper>
        <Button component="a" variant="light" href="/alpha-clash/simulator/tests">
          Open TestEngine board fixtures
        </Button>
        <Text size="sm" c="dimmed">
          Local practice uses the same main decks as bot-lab. Sideboards are not used.
        </Text>
      </Stack>
    </main>
  );
}

export default AlphaClashHomePage;
