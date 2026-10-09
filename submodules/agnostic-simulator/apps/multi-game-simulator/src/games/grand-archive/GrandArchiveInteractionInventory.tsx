import { Badge, Button, Group, Select, TextInput } from "@mantine/core";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { buildMountedHref } from "../../routes/router-paths";
import { GRAND_ARCHIVE_FIXTURE_GROUPS, GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import { GrandArchivePlayableFixture } from "./Fixtures.page";
import { GrandArchiveInteractionPreview } from "./GrandArchiveInteractionPreview";
import classes from "../../components/InteractionCatalogPage.module.css";

const inventoryPath = "/simulator-ui-fixtures/game-interactions/grand-archive";
const isPlayable = (id: string) => id === "attack-targeting" || id === "materialization-hand";

/** Uses the existing native fixture registry, so new fixtures also enter this inventory. */
export function GrandArchiveInteractionInventory({ scenario }: { scenario: string }) {
  const [, setSearch] = useSearchParams();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<string | null>("all");
  const selected = GRAND_ARCHIVE_VISUAL_FIXTURES.find((fixture) => fixture.id === scenario);
  if (scenario !== "inventory") {
    return (
      <>
        <Group p="md" style={{ background: "#101923", color: "#e7edf6" }}>
          <Button component={Link} to={buildMountedHref(inventoryPath)} variant="light">
            Grand Archive inventory
          </Button>
          <Select
            label="Grand Archive interaction scenario"
            value={selected?.id ?? null}
            placeholder="Choose a scenario"
            searchable
            style={{ flex: "1 1 240px", maxWidth: "100%" }}
            data={GRAND_ARCHIVE_VISUAL_FIXTURES.map((fixture) => ({
              value: fixture.id,
              label: fixture.name,
            }))}
            onChange={(value) => value && setSearch({ scenario: value })}
          />
        </Group>
        {!selected ? (
          <p role="alert">Unknown interaction scenario. Choose a test from the inventory.</p>
        ) : isPlayable(scenario) ? (
          <GrandArchivePlayableFixture key={scenario} kind={scenario} />
        ) : (
          <GrandArchiveInteractionPreview key={scenario} scenario={scenario} />
        )}
      </>
    );
  }
  const visible = GRAND_ARCHIVE_VISUAL_FIXTURES.filter(
    (fixture) =>
      (mode === "all" || isPlayable(fixture.id) === (mode === "playable")) &&
      `${fixture.name} ${fixture.summary} ${fixture.tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <main className={classes.page}>
      <h1>Grand Archive interaction inventory</h1>
      <p>
        Test the shared React prompts with Grand Archive cards, board targets, and adapter
        projections.
      </p>
      <p>
        Playable tests advance a local engine. Projection previews validate answers without
        advancing a match. Inspection and waiting states can have no answer controls.
      </p>
      <Group my="lg" align="end">
        <TextInput
          label="Find an interaction"
          placeholder="Search targeting, memory, inspection…"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          style={{ flex: "1 1 240px" }}
        />
        <Select
          label="Test mode"
          value={mode}
          onChange={setMode}
          allowDeselect={false}
          data={[
            { value: "all", label: "All scenarios" },
            { value: "playable", label: "Playable engine tests" },
            { value: "projection", label: "Projection previews" },
          ]}
        />
      </Group>
      <p role="status">
        {visible.length} of {GRAND_ARCHIVE_VISUAL_FIXTURES.length} scenarios
      </p>
      {visible.length === 0 && (
        <p>No matching interactions. Clear the search or change the test mode.</p>
      )}
      {GRAND_ARCHIVE_FIXTURE_GROUPS.map((group) => {
        const fixtures = visible.filter((fixture) => fixture.group === group.id);
        if (!fixtures.length) return null;
        return (
          <section key={group.id} aria-label={group.label}>
            <h2>{group.label}</h2>
            <p>{group.description}</p>
            <div className={classes.games}>
              {fixtures.map((fixture) => {
                const kinds = [
                  ...new Set(
                    fixture.interactionView?.actions.flatMap((action) =>
                      action.inputs.map((input) => input.kind),
                    ) ?? [],
                  ),
                ];
                return (
                  <article key={fixture.id} className={classes.game}>
                    <Badge variant="light" color={isPlayable(fixture.id) ? "teal" : "blue"}>
                      {isPlayable(fixture.id) ? "Playable engine test" : "Projection preview"}
                    </Badge>
                    <h3>{fixture.name}</h3>
                    <p>{fixture.summary}</p>
                    <p>{fixture.tags.join(" · ")}</p>
                    <p>
                      Shared inputs:{" "}
                      {kinds.length ? kinds.join(", ") : "No additional input fields in this state"}
                    </p>
                    <Button
                      component={Link}
                      variant="light"
                      mih={44}
                      mt="sm"
                      to={`${buildMountedHref(inventoryPath)}?scenario=${encodeURIComponent(fixture.id)}`}
                    >
                      Open {fixture.name}
                    </Button>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
