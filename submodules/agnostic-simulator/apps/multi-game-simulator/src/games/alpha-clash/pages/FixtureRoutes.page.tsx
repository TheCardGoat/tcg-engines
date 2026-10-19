import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { Badge, Button, Group, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import { auditNativeFixtureLegality } from "../native-fixture-legality";
import {
  alphaClashVisualFixtures,
  createAlphaClashVisualFixture,
  canonicalAlphaClashFixtureId,
} from "../visual-fixtures";
import { alphaClashInteractionCases, alphaClashInteractionFamilies } from "../interaction-coverage";
import { AlphaClashPracticePage } from "./Practice.page";
import { AlphaClashCorrectionFixture } from "./CorrectionFixture";

export function AlphaClashFixtureIndexPage() {
  const legality = useMemo(
    () =>
      new Map<string, ReturnType<typeof auditNativeFixtureLegality>>(
        alphaClashVisualFixtures.map((f) => [
          f.id,
          auditNativeFixtureLegality(createAlphaClashVisualFixture(f.id).state),
        ]),
      ),
    [],
  );
  const [query, setQuery] = useState("");
  const matches = alphaClashInteractionCases.filter((entry) =>
    `${entry.id} ${entry.title} ${entry.fixtureIds.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <Stack gap="lg">
        <Text size="xs" tt="uppercase">
          Alpha Clash · Native interaction review
        </Text>
        <Title order={1}>Interaction coverage</Title>
        <Text>
          Real cards on the practice board. Start before the action and control both seats. Each
          board can cover several cases. Reset between paths.
        </Text>
        <Text size="sm" c="dimmed">
          Engine support, fixture coverage, and UX acceptance are separate. A failure specimen does
          not count as a working interaction. Construction checks are shown per board. Mid-game
          arrangements are not complete historical replay proofs.
        </Text>
        <Link to="/alpha-clash/simulator/tests/correction-tools">
          Game state correction controls
        </Link>
        <TextInput
          label="Find an interaction or fixture"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <Text role="status">
          {matches.length} of {alphaClashInteractionCases.length} interaction cases ·{" "}
          {alphaClashVisualFixtures.length} board variants
        </Text>
        {alphaClashInteractionFamilies.map(([family, title]) => {
          const entries = matches.filter((entry) => entry.family === family);
          if (!entries.length) return null;
          return (
            <Stack key={family} gap="md">
              <Title order={2}>{title}</Title>
              {entries.map((entry) => (
                <Paper key={entry.id} id={entry.id} withBorder p="lg">
                  <Stack gap="sm">
                    <Title order={3} size="h4">
                      {entry.title}
                    </Title>
                    <Group gap="xs">
                      <Badge
                        variant="light"
                        color={entry.engineSupport === "native" ? "blue" : "orange"}
                      >
                        Engine / adapter: {entry.engineSupport}
                      </Badge>
                      <Badge variant="outline">Fixture: {entry.fixtureCoverage}</Badge>
                      <Badge variant="outline" color="gray">
                        UX: {entry.uxQuality}
                      </Badge>
                    </Group>
                    <Text>{entry.steps}</Text>
                    <Text size="sm">
                      <strong>Expected:</strong> {entry.expected}
                    </Text>
                    <Stack gap="xs">
                      {entry.fixtureIds.map((id) => {
                        const fixture = alphaClashVisualFixtures.find((f) => f.id === id);
                        return (
                          <div key={id}>
                            <Button
                              variant="light"
                              component={Link}
                              to={`/alpha-clash/simulator/tests/${id}`}
                            >
                              {fixture?.title ?? id}
                            </Button>
                            <Text
                              size="xs"
                              c={legality.get(id)?.construction === "valid" ? "dimmed" : "orange"}
                            >
                              Construction: {legality.get(id)?.construction}.{" "}
                              {legality.get(id)?.reason}
                            </Text>
                          </div>
                        );
                      })}
                    </Stack>
                    <details>
                      <summary style={{ cursor: "pointer" }}>
                        UX specification and evidence · {entry.id}
                      </summary>
                      <Stack gap="xs" mt="sm">
                        <Text size="sm">
                          <strong>Actor:</strong> {entry.actor}. <strong>Visibility:</strong>{" "}
                          {entry.visibility}.
                        </Text>
                        <Text size="sm">
                          <strong>Visual design:</strong> {entry.visual}
                        </Text>
                        <Text size="sm">
                          <strong>Input:</strong> {entry.input}
                        </Text>
                        <Text size="sm">
                          <strong>Motion:</strong> {entry.motion}
                        </Text>
                        <Text size="sm">
                          <strong>Sound:</strong> {entry.sound}
                        </Text>
                        <Text size="sm">
                          <strong>Adapter trace:</strong> {entry.source}
                        </Text>
                        {[
                          {
                            label: "Native test sources",
                            files: entry.evidence.filter((file) => /\.test\.tsx?$/.test(file)),
                          },
                          {
                            label: "Browser captures",
                            files: entry.evidence.filter((file) => /\.(jpg|png|webp)$/.test(file)),
                          },
                          {
                            label: "Recordings",
                            files: entry.evidence.filter((file) => /\.(mp4|webm|wav)$/.test(file)),
                          },
                          {
                            label: "Measurement data",
                            files: entry.evidence.filter((file) => file.endsWith(".json")),
                          },
                        ].map(({ label, files }) => (
                          <Text size="sm" key={label}>
                            <strong>{label}:</strong>{" "}
                            {files.length ? files.join(", ") : "Not recorded"}
                          </Text>
                        ))}
                        <Text size="sm" c="dimmed">
                          {entry.evidenceLimits ??
                            "Evidence is partial. Test sources and saved captures do not establish full browser, motion or sound acceptance; see the validation report."}
                        </Text>
                        <Text size="sm">
                          Full specification: docs/alpha-clash-ux/interactions.md#{entry.specAnchor}
                          . Captures and limits: docs/alpha-clash-ux/validation.md.
                        </Text>
                        <a href={`#${entry.id}`}>Link to this review case</a>
                      </Stack>
                    </details>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          );
        })}
      </Stack>
    </main>
  );
}
export function AlphaClashFixturePage() {
  const { fixtureId: routeId } = useParams();
  const fixtureId = canonicalAlphaClashFixtureId(routeId ?? "");
  if (fixtureId === "correction-tools") return <AlphaClashCorrectionFixture />;
  if (!alphaClashVisualFixtures.some((fixture) => fixture.id === fixtureId))
    return (
      <main style={{ padding: 32 }}>
        <h1>Fixture not found</h1>
        <Link to="/alpha-clash/simulator/tests">All fixtures</Link>
      </main>
    );
  return <AlphaClashPracticePage key={fixtureId} fixtureId={fixtureId} />;
}
