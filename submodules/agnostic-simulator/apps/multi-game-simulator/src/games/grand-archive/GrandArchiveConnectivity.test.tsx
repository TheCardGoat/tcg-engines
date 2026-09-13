// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { GrandArchiveSimulatorProviders } from "./App";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";

afterEach(cleanup);
it("stacks the Spirit and earlier levels below one current champion and keeps each inspectable", () => {
  const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "champion-lineage")!;
  mount(fixture, () => true);
  const arena = screen.getByRole("region", { name: "Your arena" });
  const lineage = within(arena).getByRole("group", { name: "Rai, Archmage lineage" });
  const cards = within(lineage).getAllByTestId("card");
  expect(cards).toHaveLength(3);
  const names = ["Spirit of Fire", "Rai, Spellcrafter", "Rai, Archmage"];
  expect(within(arena).queryByRole("region", { name: /inner-lineage/ })).toBeNull();
  cards.forEach((card, index) => {
    expect(card.getAttribute("aria-label")).toContain(names[index]);
    fireEvent.focus(card);
    expect(screen.getByRole("dialog", { name: `Card preview: ${names[index]}` })).toBeTruthy();
    fireEvent.blur(card);
  });
});
const base = GRAND_ARCHIVE_VISUAL_FIXTURES.find((fixture) => fixture.id === "opportunity")!;
const self = base.table.seats.find((seat) => seat.perspective === "bottom")!;
const opponent = base.table.seats.find((seat) => seat.perspective === "top")!;
const card = base.entities.find((entity) => entity.face === "public" && entity.kind === "card")!;
function mount(fixture: GrandArchiveHarnessFixture, submit?: () => boolean, errorMessage?: string) {
  return render(
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop
        fixture={fixture}
        onSubmitProtocolInteraction={submit}
        errorMessage={errorMessage}
      />
    </GrandArchiveSimulatorProviders>,
  );
}

it("does not duplicate an unlevelled champion with a non-champion lineage attachment", () => {
  const field = base.table.zones.find((zone) => zone.id === `${self.id}:field`)!;
  const champion = base.entities.find(
    (entity) => field.entityIds.includes(entity.id) && entity.kind === "leader",
  )!;
  const attachment = {
    ...card,
    id: "lineage-attachment",
    title: "Attached non-champion",
    dataAttributes: { ...card.dataAttributes, "data-host-id": champion.id },
  };
  mount({
    ...base,
    entities: [...base.entities, attachment],
    table: {
      ...base.table,
      zones: base.table.zones.map((zone) =>
        zone.id === `${self.id}:inner-lineage`
          ? { ...zone, entityIds: [attachment.id], count: 1 }
          : zone,
      ),
    },
  });
  const stack = screen.getByRole("group", { name: `${champion.title} lineage` });
  expect(within(stack).getAllByTestId("card")).toHaveLength(2);
  const championCard = within(stack).getByRole("button", { name: new RegExp(champion.title) });
  fireEvent.focus(championCard);
  expect(screen.getByRole("dialog", { name: `Card preview: ${champion.title}` })).toBeTruthy();
  fireEvent.blur(championCard);
  fireEvent.focus(within(stack).getByRole("button", { name: /Attached non-champion/ }));
  expect(screen.getByRole("dialog", { name: "Card preview: Attached non-champion" })).toBeTruthy();
});

for (const hosted of [false, true]) {
  it(`preserves concealed lineage cards and counts with hosted visible cards=${hosted}`, () => {
    const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "champion-lineage")!;
    const seat = fixture.table.seats.find((entry) => entry.perspective === "bottom")!;
    mount({
      ...fixture,
      table: {
        ...fixture.table,
        zones: fixture.table.zones.map((zone) =>
          zone.id === `${seat.id}:inner-lineage`
            ? {
                ...zone,
                entityIds: hosted ? zone.entityIds : [],
                count: (hosted ? zone.entityIds.length : 0) + 2,
              }
            : zone,
        ),
      },
    });
    const zone = screen.getByRole("region", { name: "Your inner-lineage, 2 cards" });
    const cards = within(zone).getAllByTestId("card");
    expect(cards).toHaveLength(2);
    for (const card of cards) {
      expect(card.getAttribute("data-face")).toBe("hidden");
      expect(card.getAttribute("data-definition-id")).toBeNull();
    }
    expect(within(zone).queryAllByRole("button")).toHaveLength(0);
  });
}

it("stacks opponent-owned bottom attachments with their host beneath the Spirit", () => {
  const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "champion-lineage")!;
  const seat = fixture.table.seats.find((entry) => entry.perspective === "bottom")!;
  const owner = fixture.table.seats.find((entry) => entry.perspective === "top")!;
  const field = fixture.table.zones.find((zone) => zone.id === `${seat.id}:field`)!;
  const champion = fixture.entities.find((entity) => field.entityIds.includes(entity.id))!;
  const attachment = {
    ...card,
    id: "opposing-bottom-card",
    title: "Opponent-owned bottom card",
    ownerId: owner.id,
    dataAttributes: {
      ...card.dataAttributes,
      "data-host-id": champion.id,
      "data-lineage-position": -1,
    },
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
  const stack = screen.getByRole("group", { name: "Rai, Archmage lineage" });
  const cards = within(stack).getAllByTestId("card");
  expect(cards).toHaveLength(4);
  ["Opponent-owned bottom card", "Spirit of Fire", "Rai, Spellcrafter", "Rai, Archmage"].forEach(
    (name, index) => {
      expect(cards[index]!.getAttribute("aria-label")).toContain(name);
      fireEvent.focus(cards[index]!);
      expect(screen.getByRole("dialog", { name: `Card preview: ${name}` })).toBeTruthy();
      fireEvent.blur(cards[index]!);
    },
  );
  expect(screen.queryByRole("region", { name: /Opponent inner-lineage/ })).toBeNull();
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
  expect(screen.getByText("Offline")).toBeTruthy();
  expect(screen.getByText(/Read-only fixture/)).toBeTruthy();
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

it("renders populated object-specific zones and private Pantheon without inventing identities", () => {
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
  for (const name of names) {
    const zone = screen.getByRole("region", { name: `Your ${name}, 1 cards` });
    expect(zone.querySelector("[data-sim-entity-id]")?.getAttribute("data-sim-entity-id")).toBe(
      `zone-${name}`,
    );
    expect(within(zone).getByText(card.title)).toBeTruthy();
  }
  const hidden = screen.getByRole("region", { name: "Opponent pantheon, 2 cards" });
  expect(within(hidden).getAllByTestId("card")).toHaveLength(2);
  for (const face of within(hidden).getAllByTestId("card")) {
    expect(face.getAttribute("data-face")).toBe("hidden");
    expect(face.getAttribute("data-definition-id")).toBeNull();
  }
  expect(within(hidden).queryAllByRole("button")).toHaveLength(0);
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
  fireEvent.click(screen.getByRole("button", { name: /Your Deck,/ }));
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
      screen.getByRole("button", {
        name: zoneName === "main-deck" ? /Your Deck,/ : /Your Material Deck,/,
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
