// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { GrandArchiveSimulatorProviders } from "./App";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";

afterEach(cleanup);
const base = GRAND_ARCHIVE_VISUAL_FIXTURES.find((fixture) => fixture.id === "opportunity")!;
const self = base.table.seats.find((seat) => seat.perspective === "bottom")!;
const opponent = base.table.seats.find((seat) => seat.perspective === "top")!;
const card = base.entities.find((entity) => entity.face === "public" && entity.kind === "card")!;
function mount(fixture: GrandArchiveHarnessFixture, submit?: () => boolean, errorMessage?: string) {
  const result = render(
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop
        fixture={fixture}
        onSubmitProtocolInteraction={submit}
        errorMessage={errorMessage}
      />
    </GrandArchiveSimulatorProviders>,
  );
  document.querySelectorAll(".ga-scene-inventory").forEach((node) => node.setAttribute("open", ""));
  return result;
}

it("inspects the Spirit and earlier levels from the host without duplicating the field champion", async () => {
  const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "champion-lineage")!;
  mount(fixture);
  const arena = screen.getByRole("region", { name: "Your champion" });
  expect(arena.querySelectorAll(".ga-scene-card-control")).toHaveLength(1);
  fireEvent.click(within(arena).getByRole("button", { name: "Inspect Rai, Archmage lineage" }));
  const lineage = await screen.findByRole("group", { name: "Rai, Archmage lineage" });
  const layers = within(lineage).getAllByTestId("card");
  expect(layers).toHaveLength(2);
  expect(layers[0]!.getAttribute("aria-label")).toContain("Spirit of Fire");
  expect(layers[1]!.getAttribute("aria-label")).toContain("Rai, Spellcrafter");
  fireEvent.click(layers[0]!);
  expect(await screen.findByRole("dialog", { name: "Spirit of Fire" })).toBeTruthy();
});

it("retains concealed lineage counts without inventing card identities", async () => {
  const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "champion-lineage")!;
  const seat = fixture.table.seats.find((entry) => entry.perspective === "bottom")!;
  mount({
    ...fixture,
    table: {
      ...fixture.table,
      zones: fixture.table.zones.map((zone) =>
        zone.id === `${seat.id}:inner-lineage` ? { ...zone, entityIds: [], count: 2 } : zone,
      ),
    },
  });
  fireEvent.click(
    within(screen.getByRole("region", { name: "Your arena" })).getByRole("button", {
      name: "Inner Lineage, 2 cards",
    }),
  );
  const dialog = await screen.findByRole("dialog", { name: "Inner Lineage · 2" });
  expect(dialog.textContent).toContain("2 concealed cards");
  expect(within(dialog).queryAllByTestId("card")).toHaveLength(0);
});

it("includes opponent-owned bottom attachments in their field host inspection", async () => {
  const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "champion-lineage")!;
  const seat = fixture.table.seats.find((entry) => entry.perspective === "bottom")!;
  const owner = fixture.table.seats.find((entry) => entry.perspective === "top")!;
  const hostId = fixture.table.zones.find((zone) => zone.id === `${seat.id}:field`)!.entityIds[0]!;
  const attachment = {
    ...card,
    id: "opposing-bottom-card",
    title: "Opponent-owned bottom card",
    ownerId: owner.id,
    dataAttributes: { ...card.dataAttributes, "data-host-id": hostId, "data-lineage-position": -1 },
  };
  mount({
    ...fixture,
    entities: [...fixture.entities, attachment],
    table: {
      ...fixture.table,
      zones: fixture.table.zones.map((zone) =>
        zone.id === `${owner.id}:inner-lineage`
          ? {
              ...zone,
              entityIds: [...zone.entityIds, attachment.id],
              count: (zone.count ?? zone.entityIds.length) + 1,
            }
          : zone,
      ),
    },
  });
  fireEvent.click(screen.getByRole("button", { name: "Inspect Rai, Archmage lineage" }));
  const group = await screen.findByRole("group", { name: "Rai, Archmage lineage" });
  expect(within(group).getAllByTestId("card")[0]!.getAttribute("aria-label")).toContain(
    attachment.title,
  );
});

it("renders presence and disables every fixture mutation while retaining inspection", () => {
  mount({
    ...base,
    table: {
      ...base.table,
      seats: base.table.seats.map((seat) => ({
        ...seat,
        connectionStatus: seat.id === self.id ? "online" : "offline",
      })),
    },
  });
  expect(screen.getByText("Online")).toBeTruthy();
  expect(screen.getAllByText("Offline").length).toBeGreaterThan(0);
  for (const name of ["Pass Opportunity", "Concede"]) {
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: new RegExp(`^${name}$`) }).disabled,
    ).toBe(true);
  }
  fireEvent.click(screen.getByRole("tab", { name: "Now" }));
  for (const button of within(
    screen.getByLabelText("Legal actions"),
  ).getAllByRole<HTMLButtonElement>("button"))
    expect(button.disabled).toBe(true);
});

it("renders populated object-specific zones and private Pantheon without inventing identities", async () => {
  const names = ["intent", "inner-lineage", "loaded", "pantheon"] as const;
  const fixture: GrandArchiveHarnessFixture = {
    ...base,
    entities: [
      ...base.entities,
      ...names.map((name) => ({
        ...card,
        id: `zone-${name}`,
        title: `Visible ${name}`,
        dataAttributes: { "data-host-id": card.id },
      })),
    ],
    table: {
      ...base.table,
      zones: base.table.zones.map((zone) => {
        const name = names.find((entry) => zone.id === `${self.id}:${entry}`);
        if (name) return { ...zone, entityIds: [`zone-${name}`], count: 1 };
        if (zone.id === `${opponent.id}:pantheon`)
          return { ...zone, entityIds: [], count: 2, visibility: "private" };
        return zone;
      }),
    },
  };
  mount(fixture);
  for (const name of ["loaded", "pantheon", "inner-lineage"]) {
    const label =
      name === "inner-lineage" ? "Inner Lineage" : name === "loaded" ? "Loaded" : "Pantheon";
    fireEvent.click(
      within(screen.getByRole("region", { name: "Your arena" })).getByRole("button", {
        name: `${label}, 1 cards`,
      }),
    );
    const dialog = await screen.findByRole("dialog", { name: `${label} · 1` });
    expect(
      within(dialog).getByRole("button", { name: new RegExp(`^Visible ${name},`) }),
    ).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: `Close ${label}` }));
  }
  fireEvent.click(
    within(screen.getByRole("region", { name: "Opponent arena" })).getByRole("button", {
      name: "Pantheon, 2 cards",
    }),
  );
  const hidden = await screen.findByRole("dialog", { name: "Pantheon · 2" });
  expect(hidden.textContent).toContain("2 concealed cards");
  expect(within(hidden).queryAllByTestId("card")).toHaveLength(0);
  expect(hidden.textContent).not.toContain("Visible pantheon");
});

it("inspects only authorized Main Deck reveals without implying deck order", async () => {
  const reveal = { ...card, id: "authorized-reveal", title: "Authorized revealed card" };
  mount({
    ...base,
    entities: [...base.entities, reveal],
    table: {
      ...base.table,
      zones: base.table.zones.map((zone) =>
        zone.id === `${self.id}:main-deck` ? { ...zone, entityIds: [reveal.id], count: 40 } : zone,
      ),
    },
  });
  fireEvent.click(
    within(screen.getByRole("region", { name: "Your arena" })).getByRole("button", {
      name: /Deck,/,
    }),
  );
  const dialog = await screen.findByRole("dialog");
  expect(dialog.textContent).toContain("does not indicate deck order");
  expect(dialog.textContent).toContain("39 concealed cards");
  expect(dialog.querySelectorAll("[data-sim-entity-id]")).toHaveLength(1);
});

it("keeps a rejected pregame completion visible and retryable", () => {
  const pregame = GRAND_ARCHIVE_VISUAL_FIXTURES.find((fixture) => fixture.id === "pregame-action")!;
  const submit = vi.fn(() => false);
  mount(pregame, submit, "Connection interrupted. Try again.");
  expect(
    screen
      .getAllByRole("alert")
      .some((node) => node.textContent?.includes("Connection interrupted")),
  ).toBe(true);
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Continue to starting champions" }));
  expect(submit).toHaveBeenCalled();
  expect(screen.getByTestId("interaction-resolution-prompt")).toBeTruthy();
});

it("allows retrying a pregame action rejected asynchronously at the same state version", () => {
  const pregame = GRAND_ARCHIVE_VISUAL_FIXTURES.find((fixture) => fixture.id === "pregame-action")!;
  const submit = vi.fn(() => true);
  const element = (errorMessage?: string) => (
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop
        fixture={pregame}
        onSubmitProtocolInteraction={submit}
        errorMessage={errorMessage}
      />
    </GrandArchiveSimulatorProviders>
  );
  const view = render(element());
  expect(submit).toHaveBeenCalledTimes(1);
  view.rerender(element("Server rejected the request. Retry."));
  expect(submit).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Continue to starting champions" }));
  expect(submit).toHaveBeenCalledTimes(2);
});

it("keeps read-only decision fixtures informational", () => {
  mount(GRAND_ARCHIVE_VISUAL_FIXTURES.find((fixture) => fixture.id === "decision")!);
  const prompt = screen.getByTestId("interaction-resolution-prompt");
  expect(within(prompt).queryByRole("button", { name: /^(Confirm|Complete|Submit)/ })).toBeNull();
});

it.each(["main-deck", "material-deck"] as const)(
  "orders authorized %s reveals independently of native positions",
  async (zoneName) => {
    const alpha = { ...card, id: "revealed-a", title: "Alpha revealed card" };
    const zeta = { ...card, id: "revealed-z", title: "Zeta revealed card" };
    const element = (entityIds: string[]) => (
      <GrandArchiveSimulatorProviders>
        <GrandArchiveTabletop
          fixture={{
            ...base,
            entities: [...base.entities, alpha, zeta],
            table: {
              ...base.table,
              zones: base.table.zones.map((zone) =>
                zone.id === `${self.id}:${zoneName}`
                  ? { ...zone, entityIds, count: 40, visibility: "private" }
                  : zone,
              ),
            },
          }}
        />
      </GrandArchiveSimulatorProviders>
    );
    const view = render(element([zeta.id, alpha.id]));
    fireEvent.click(
      within(screen.getByRole("region", { name: "Your arena" })).getByRole("button", {
        name: zoneName === "main-deck" ? /Deck,/ : /Material,/,
      }),
    );
    const dialog = await screen.findByRole("dialog");
    const revealedIds = () =>
      Array.from(dialog.querySelectorAll("[data-sim-entity-id]"), (node) =>
        node.getAttribute("data-sim-entity-id"),
      );
    expect(dialog.textContent).toContain("does not indicate deck order");
    expect(revealedIds()).toEqual([alpha.id, zeta.id]);
    view.rerender(element([alpha.id, zeta.id]));
    expect(revealedIds()).toEqual([alpha.id, zeta.id]);
  },
);
