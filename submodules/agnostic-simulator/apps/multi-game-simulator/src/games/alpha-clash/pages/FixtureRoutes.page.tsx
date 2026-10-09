import { Link, useParams } from "react-router";
import { Button, Paper, Stack, Text, Title } from "@mantine/core";
import { alphaClashVisualFixtures } from "../visual-fixtures";
import { AlphaClashPracticePage } from "./Practice.page";

export function AlphaClashFixtureIndexPage() {
  return (
    <main style={{ padding: 32, maxWidth: 960, margin: "0 auto" }}>
      <Stack gap="lg">
        <Text size="xs" tt="uppercase">
          Alpha Clash · TestEngine fixtures
        </Text>
        <Title order={1}>Choose a board state</Title>
        <Text>
          Deterministic engine states on the same board as practice and live matches. Both seats are
          controlled locally.
        </Text>
        {alphaClashVisualFixtures.map((fixture) => (
          <Paper key={fixture.id} withBorder p="lg">
            <Stack gap="xs">
              <Title order={2} size="h3">
                {fixture.title}
              </Title>
              <Text>{fixture.description}</Text>
              <Button component={Link} to={`/alpha-clash/simulator/tests/${fixture.id}`}>
                Open board
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </main>
  );
}
export function AlphaClashFixturePage() {
  const { fixtureId } = useParams();
  if (!alphaClashVisualFixtures.some((fixture) => fixture.id === fixtureId))
    return (
      <main style={{ padding: 32 }}>
        <h1>Fixture not found</h1>
        <Link to="/alpha-clash/simulator/tests">All fixtures</Link>
      </main>
    );
  return <AlphaClashPracticePage key={fixtureId} fixtureId={fixtureId} />;
}
