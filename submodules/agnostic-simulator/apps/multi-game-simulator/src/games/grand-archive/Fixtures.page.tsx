import { useMemo, useReducer, useState } from "react";
import { Button } from "@mantine/core";
import { projectGrandArchiveSimulator } from "@tcg/grand-archive-server-adapter";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { grandArchiveHarnessFixture } from "./fixtureProjection";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  GRAND_ARCHIVE_FIXTURE_GROUPS,
  GRAND_ARCHIVE_VISUAL_FIXTURES,
  createMaterialHandFixtureServer,
  type GrandArchiveFixtureGroupId,
} from "./fixtures";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";

const GRAND_ARCHIVE_SIMULATOR_BASE = "/grand-archive/simulator";
const ALL_GROUPS = "all" as const;

export function GrandArchiveFixturesPage() {
  const { fixtureId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<GrandArchiveFixtureGroupId | typeof ALL_GROUPS>(ALL_GROUPS);
  const active =
    GRAND_ARCHIVE_VISUAL_FIXTURES.find((fixture) => fixture.id === fixtureId) ??
    GRAND_ARCHIVE_VISUAL_FIXTURES[0]!;

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return GRAND_ARCHIVE_VISUAL_FIXTURES.filter((fixture) => {
      if (group !== ALL_GROUPS && fixture.group !== group) return false;
      if (!normalizedQuery) return true;
      return [fixture.id, fixture.name, fixture.summary, ...fixture.tags].some((value) =>
        value.toLocaleLowerCase().includes(normalizedQuery),
      );
    });
  }, [group, query]);

  if (!fixtureId) {
    return (
      <main className="ga-fixture-catalog" data-testid="grand-archive-fixture-index">
        <header className="ga-fixture-catalog-header">
          <p>Grand Archive · developer fixture bench</p>
          <h1>Visual fixture catalog</h1>
          <span>
            Every fixture is projected from a real Grand Archive engine state. Private cards stay
            private, and only authoritative actions are interactive.
          </span>
          <nav aria-label="Fixture catalog navigation">
            <Link to={GRAND_ARCHIVE_SIMULATOR_BASE}>← Simulator hub</Link>
            <Link to={`${GRAND_ARCHIVE_SIMULATOR_BASE}/play/practice`}>Local practice</Link>
          </nav>
        </header>

        <div className="ga-fixture-toolbar">
          <label>
            <span>Search fixtures</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search phases, decisions, or zones"
              data-testid="ga-fixture-search"
            />
          </label>
          <label>
            <span>Fixture group</span>
            <select
              value={group}
              onChange={(event) => {
                const value = event.currentTarget.value;
                const match = GRAND_ARCHIVE_FIXTURE_GROUPS.find((entry) => entry.id === value);
                setGroup(match?.id ?? ALL_GROUPS);
              }}
              data-testid="ga-fixture-group-filter"
            >
              <option value={ALL_GROUPS}>All groups</option>
              {GRAND_ARCHIVE_FIXTURE_GROUPS.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>
          <output data-testid="ga-fixture-count">
            Showing {visible.length} of {GRAND_ARCHIVE_VISUAL_FIXTURES.length}
          </output>
        </div>

        {GRAND_ARCHIVE_FIXTURE_GROUPS.map((groupEntry) => {
          const fixtures = visible.filter((fixture) => fixture.group === groupEntry.id);
          if (fixtures.length === 0) return null;
          return (
            <section key={groupEntry.id} className="ga-fixture-group">
              <header>
                <h2>{groupEntry.label}</h2>
                <p>{groupEntry.description}</p>
              </header>
              <div>
                {fixtures.map((fixture) => (
                  <Link key={fixture.id} to={`${GRAND_ARCHIVE_SIMULATOR_BASE}/tests/${fixture.id}`}>
                    <strong>{fixture.name}</strong>
                    <code>{fixture.id}</code>
                    <p>{fixture.summary}</p>
                    <span>{fixture.tags.join(" · ")}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    );
  }

  if (fixtureId === "materialization-hand") return <GrandArchiveMaterialHandFixture />;

  return (
    <GrandArchiveTabletop
      fixtures={GRAND_ARCHIVE_VISUAL_FIXTURES}
      fixture={active}
      onSelectFixture={(nextFixtureId) => {
        void navigate(`${GRAND_ARCHIVE_SIMULATOR_BASE}/tests/${nextFixtureId}`);
      }}
    />
  );
}

/** Playable decision fixture using the same server submission path as practice. */
function GrandArchiveMaterialHandFixture() {
  const [server, setServer] = useState(createMaterialHandFixtureServer);
  const [resetVersion, reset] = useReducer((version: number) => version + 1, 0);
  const [, refresh] = useReducer((version: number) => version + 1, 0);
  const [error, setError] = useState<string>();
  const viewer = grandArchivePlayerId("p1");
  const fixture = grandArchiveHarnessFixture(
    "materialization-hand",
    "Material deck in hand",
    "Try one materialization choice, then use Reset materialization to try another.",
    projectGrandArchiveSimulator(server.program, server.runtime.state, viewer),
  );
  return (
    <GrandArchiveTabletop
      key={resetVersion}
      fixture={fixture}
      errorMessage={error}
      historyAccessory={
        <Button
          size="compact-sm"
          variant="default"
          onClick={() => {
            setServer(createMaterialHandFixtureServer());
            setError(undefined);
            reset();
          }}
        >
          Reset materialization
        </Button>
      }
      onSubmitProtocolInteraction={(submission) => {
        const result = server.submitInteraction(viewer, submission, {
          gameId: "grand-archive-material-hand-fixture",
          sourceAuthority: "client",
        });
        setError(result.success ? undefined : result.error);
        refresh();
        return result.success;
      }}
    />
  );
}
