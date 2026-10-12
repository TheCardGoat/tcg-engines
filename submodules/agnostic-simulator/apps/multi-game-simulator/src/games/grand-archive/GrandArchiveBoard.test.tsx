// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GrandArchiveSimulatorProviders } from "./App";
import { grandArchiveComposition } from "./board-renderer/composition";
import { projectGrandArchiveSimulator } from "@tcg/grand-archive-server-adapter";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { buildInteractionSubmission, type InteractionSubmissionValue } from "@tcg/protocol";
import { findGrandArchiveNativeFixture } from "./native-fixtures";
import { grandArchiveHarnessFixture } from "./fixtureProjection";
import { grandArchiveBoardProjection } from "./GrandArchiveBoard";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((item) => item.id === "opportunity")!;
vi.mock("./board-renderer", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./board-renderer")>()),
  GrandArchiveBoard: (props: import("./board-renderer").GrandArchiveBoardProps) => (
    <div>
      <button onClick={() => props.onComposition?.(grandArchiveComposition(1440, 900))}>
        Report scene layout
      </button>
      <button onClick={() => props.events?.onBackgroundPick?.()}>Scene background</button>
      <button onClick={() => props.onAssetStatus?.({ loading: 0, failed: ["card.png"] })}>
        Fail texture
      </button>
      <output aria-label="Selected scene cards">
        {props.projection.selectedCardIds?.join(",")}
      </output>
      <output aria-label="Scene hand order">
        {props.projection.cards
          .filter((card) => card.owner === "self" && card.zone === "hand")
          .map((card) => card.id)
          .join(",")}
      </output>
      <output aria-label="Texture retry">{props.assetRetryKey}</output>
    </div>
  ),
}));
beforeEach(() => vi.stubGlobal("WebGLRenderingContext", class {}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
async function mount(value: GrandArchiveHarnessFixture = fixture) {
  const submit = vi.fn((_submission: import("@tcg/protocol").InteractionSubmission) => true);
  const result = render(
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop fixture={value} onSubmitProtocolInteraction={submit} />
    </GrandArchiveSimulatorProviders>,
  );
  await screen.findByRole("region", { name: "Your arena" });
  document.querySelectorAll(".ga-scene-inventory").forEach((node) => node.setAttribute("open", ""));
  return { ...result, submit };
}
it("mounts one R3F board with accessible player controls", async () => {
  const { container } = await mount();
  expect(screen.getByRole("region", { name: "Your arena" })).toBeTruthy();
  expect(screen.getByRole("region", { name: "Opponent arena" })).toBeTruthy();
  expect(screen.getByTestId("grand-archive-three-board")).toBeTruthy();
  expect(container.querySelector(".ga-sandbox-board")).toBeNull();
  expect(screen.queryByRole("complementary", { name: "Turn phases" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Cards & actions" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Open cards & controls" })).toBeNull();
});
it.each([false, true])(
  "keeps identity and pile labels relative to the viewer, switched=%s",
  async (switched) => {
    const seats = fixture.table.seats.map((seat) => ({
      ...seat,
      label: seat.perspective === "bottom" ? "You" : "Opponent",
      perspective: switched
        ? seat.perspective === "bottom"
          ? ("top" as const)
          : ("bottom" as const)
        : seat.perspective,
    }));
    const current = { ...fixture, table: { ...fixture.table, seats } };
    const { container } = await mount(current);
    fireEvent.click(screen.getByRole("button", { name: "Report scene layout" }));
    expect(
      container.querySelector('.ga-portrait-identity[data-side="bottom"] strong')?.textContent,
    ).toBe("You");
    expect(
      container.querySelector('.ga-portrait-identity[data-side="top"] strong')?.textContent,
    ).toBe("Opponent");
    for (const seat of seats) {
      const label = seat.perspective === "bottom" ? "You" : "Opponent";
      expect(
        screen
          .getByLabelText(`${label} memory`, { selector: ".ga-theme-memory" })
          .closest(".ga-theme-readouts")
          ?.getAttribute("data-side"),
      ).toBe(seat.perspective);
      expect(
        screen
          .getByLabelText(`${label} main deck`, { selector: ".ga-theme-deck" })
          .closest(".ga-theme-readouts")
          ?.getAttribute("data-side"),
      ).toBe(seat.perspective);
    }
  },
);
it("preserves player names in board identity and pile labels", async () => {
  const seats = fixture.table.seats.map((seat) => ({
    ...seat,
    label: seat.perspective === "bottom" ? "Alice" : "Bob",
  }));
  const { container } = await mount({ ...fixture, table: { ...fixture.table, seats } });
  fireEvent.click(screen.getByRole("button", { name: "Report scene layout" }));
  expect(
    container.querySelector('.ga-portrait-identity[data-side="bottom"] strong')?.textContent,
  ).toBe("Alice");
  expect(
    container.querySelector('.ga-portrait-identity[data-side="top"] strong')?.textContent,
  ).toBe("Bob");
  expect(screen.getByLabelText("Alice memory")).toBeTruthy();
  expect(screen.getByLabelText("Bob main deck")).toBeTruthy();
});
it("opens direct card inspection without submitting a move", async () => {
  const { submit } = await mount();
  const card = within(screen.getByRole("region", { name: "Your champion" })).getByRole("button");
  fireEvent.click(card);
  expect(await screen.findByRole("button", { name: "Close card inspection" })).toBeTruthy();
  expect(submit).not.toHaveBeenCalled();
});
it("keeps card states available in the inspection details", async () => {
  const current = {
    ...fixture,
    entities: fixture.entities.map((entity) => ({
      ...entity,
      decorations: [
        ...(entity.decorations ?? []),
        {
          id: "ga:keyword:inspection-test",
          slot: "top-start" as const,
          content: { kind: "text" as const, text: "Efficiency" },
          ariaLabel: "Keyword: Efficiency",
          tone: "neutral" as const,
        },
      ],
    })),
  };
  const { submit } = await mount(current);
  fireEvent.click(
    within(screen.getByRole("region", { name: "Your champion" })).getByRole("button", {
      name: /leader, p1/,
    }),
  );
  const details = await screen.findByRole("region", { name: "Card details and actions" });
  fireEvent.click(within(details).getByRole("button", { name: /Inspect states on.*Efficiency/ }));
  expect(await screen.findByText("Keyword: Efficiency")).toBeTruthy();
  // Floating UI treats zero-size jsdom anchors as detached; browser checks cover placement.
  fireEvent.click(screen.getByRole("button", { name: "Close states", hidden: true }));
  expect(screen.getByRole("button", { name: "Close card inspection" })).toBeTruthy();
  expect(submit).not.toHaveBeenCalled();
});
it("keeps an authorized face-down Memory card's face off the tabletop", async () => {
  const self = fixture.table.seats.find((seat) => seat.perspective === "bottom")!;
  const original = fixture.entities.find(
    (entity) => entity.face === "public" && entity.kind === "card",
  )!;
  const secret = {
    ...original,
    id: "secret-memory",
    ownerId: self.id,
    title: "Private memory face",
    imageUrl: "https://example.test/private-face.png",
    dataAttributes: { ...original.dataAttributes, "data-facing": "face-down" },
  };
  const memory = fixture.table.zones.find((zone) => zone.id === `${self.id}:memory`)!;
  await mount({
    ...fixture,
    entities: [...fixture.entities, secret],
    table: {
      ...fixture.table,
      zones: fixture.table.zones.map((zone) =>
        zone.id === memory.id ? { ...zone, entityIds: [secret.id], count: 1 } : zone,
      ),
    },
  });
  const arena = screen.getByRole("region", { name: "Your arena" });
  expect(within(arena).queryByRole("img", { name: secret.title })).toBeNull();
  expect(arena.querySelector('img[src="https://example.test/private-face.png"]')).toBeNull();
  expect(within(arena).getByRole("button", { name: "Concealed memory card" })).toBeTruthy();
});

it("submits Pass through the existing authoritative interaction path", async () => {
  const { submit } = await mount();
  fireEvent.click(screen.getByRole("button", { name: "Pass Opportunity" }));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit.mock.calls[0][0]).toMatchObject({
    stateVersion: fixture.interactionView!.stateVersion,
  });
});
it("selects native current lineage by clicking its highlighted field host", async () => {
  const original = fixture.entities.find((card) => card.face === "public")!;
  const host = {
    ...original,
    id: "host",
    kind: "leader" as const,
    dataAttributes: { "data-definition-id": "current" },
  };
  const current = {
    ...host,
    id: "native-current",
    dataAttributes: {
      "data-definition-id": "current",
      "data-host-id": "host",
      "data-lineage-position": 1,
    },
  };
  const originalAction = fixture.interactionView!.actions.find((action) => action.enabled)!;
  const action: import("@tcg/protocol").InteractionAction = {
    ...originalAction,
    id: "review-lineage",
    source: undefined,
    intent: "choose-targets",
    inputs: [
      {
        id: "lineage",
        kind: "entity-selection",
        text: { key: "Choose lineage" },
        role: "target",
        entityKinds: ["card"],
        ordered: false,
        min: 1,
        max: 1,
        candidates: [{ entity: { kind: "card", instanceId: current.id }, enabled: true }],
      },
    ],
  };
  const field = fixture.table.zones.find((zone) => zone.id.endsWith(":field"))!;
  const currentFixture = {
    ...fixture,
    entities: [host, current],
    table: {
      ...fixture.table,
      zones: [
        { ...field, entityIds: [host.id] },
        { ...field, id: `${field.ownerId}:inner-lineage`, entityIds: [current.id] },
      ],
    },
    interactionView: { ...fixture.interactionView!, actions: [action] },
    interactions: [
      {
        ...fixture.interactions[0]!,
        id: action.id,
        sourceEntityId: undefined,
        label: "Choose lineage",
        movePreview: { ...fixture.interactions[0]!.movePreview, command: "answer-decision" },
      },
    ],
  };
  const { submit } = await mount(currentFixture);
  fireEvent.click(screen.getByRole("tab", { name: "Now" }));
  fireEvent.click(await screen.findByRole("button", { name: "Choose lineage" }));
  const card = screen.getByRole("button", { name: new RegExp(`^${host.title},`) });
  fireEvent.click(card);
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ actionId: action.id, values: { lineage: [current.id] } }),
  );
});

it("keeps the layout lean with count-only opponent hand and no empty optional piles", async () => {
  await mount();
  const board = screen.getByRole("region", { name: "Your arena" });
  expect(within(board).getByRole("region", { name: "Your champion" })).toBeTruthy();
  expect(within(board).queryByLabelText("Opponent hand")).toBeNull();
  expect(within(board).getByLabelText("Board theme").closest(".ga-scene-inventory")).toBeTruthy();
  expect(within(board).queryByRole("button", { name: /Inspect.*Loaded/ })).toBeNull();
});

function handSelectionFixture(
  min: number,
  max: number,
  role: "cost" | "target" = "cost",
  ordered = false,
) {
  const self = fixture.table.seats.find((seat) => seat.perspective === "bottom")!;
  const hand = fixture.table.zones.find((zone) => zone.id === `${self.id}:hand`)!;
  const [source, ...paymentIds] = hand.entityIds;
  const original = fixture.interactionView!.actions.find((action) => action.enabled)!;
  const action: import("@tcg/protocol").InteractionAction = {
    ...original,
    id: "direct-hand-selection",
    intent: "activate",
    inputs: [
      {
        id: "hand-cards",
        kind: "entity-selection",
        text: { key: "Choose hand cards" },
        role,
        entityKinds: ["card"],
        ordered,
        min,
        max,
        candidates: paymentIds.map((id) => ({
          entity: { kind: "card", instanceId: id },
          enabled: true,
        })),
      },
    ],
  };
  const value: GrandArchiveHarnessFixture = {
    ...fixture,
    interactionView: { ...fixture.interactionView!, actions: [action] },
    interactions: [
      {
        ...fixture.interactions[0]!,
        id: action.id,
        sourceEntityId: source,
        label: "Activate test card",
        movePreview: { ...fixture.interactions[0]!.movePreview, command: "activate-card" },
      },
    ],
  };
  return { value, source: source!, paymentIds };
}
function boardCard(id: string) {
  const card = document.querySelector<HTMLButtonElement>(
    `.ga-scene-card-control[data-entity-id="${id}"] button`,
  );
  if (!card) throw new Error(`Missing card ${id}`);
  return card;
}
async function startHandSelection(
  min: number,
  max: number,
  role: "cost" | "target" = "cost",
  ordered = false,
) {
  const selection = handSelectionFixture(min, max, role, ordered);
  const mounted = await mount(selection.value);
  fireEvent.click(boardCard(selection.source));
  fireEvent.click(await screen.findByRole("button", { name: "Activate test card" }));
  await waitFor(() =>
    expect(screen.queryByRole("button", { name: "Close card inspection" })).toBeNull(),
  );
  return { ...selection, ...mounted };
}
it("shows every anonymous opponent hand card and only authorized revealed faces", async () => {
  const opponent = fixture.table.seats.find((seat) => seat.perspective === "top")!;
  const original = fixture.entities.find(
    (entity) => entity.face === "public" && entity.kind === "card",
  )!;
  const revealed = {
    ...original,
    id: "revealed-hand",
    ownerId: opponent.id,
    title: "Authorized reveal",
  };
  const revealedFixture = {
    ...fixture,
    entities: [...fixture.entities, revealed],
    table: {
      ...fixture.table,
      zones: fixture.table.zones.map((zone) =>
        zone.id === `${opponent.id}:hand` ? { ...zone, entityIds: [revealed.id], count: 16 } : zone,
      ),
    },
  };
  await mount(revealedFixture);
  const hand = screen.getByLabelText("Opponent hand");
  expect(
    grandArchiveBoardProjection(revealedFixture).cards.filter(
      (card) => card.owner === "opponent" && card.zone === "hand" && card.faceDown,
    ),
  ).toHaveLength(15);
  expect(within(hand).getByRole("button", { name: /^Authorized reveal,/ })).toBeTruthy();
  expect(hand.querySelector('[aria-label^="Drag "]')).toBeNull();
});
it("commits an exact multi-card hand payment on the last selected card without confirmation", async () => {
  const { submit, paymentIds } = await startHandSelection(2, 2);
  fireEvent.click(boardCard(paymentIds[0]!));
  expect(submit).not.toHaveBeenCalled();
  // Selection can be changed until the final required card commits the activation.
  fireEvent.click(boardCard(paymentIds[0]!));
  fireEvent.click(boardCard(paymentIds[1]!));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(boardCard(paymentIds[2]!));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { "hand-cards": [paymentIds[1], paymentIds[2]] } }),
  );
  expect(screen.queryByRole("button", { name: /Confirm/ })).toBeNull();
});
it("finishes a variable hand selection by tapping empty field without a confirmation dialog", async () => {
  const { submit, paymentIds } = await startHandSelection(0, 3);
  fireEvent.click(boardCard(paymentIds[0]!));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Scene background" }));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { "hand-cards": [paymentIds[0]] } }),
  );
});
it("allows an optional hand effect to choose zero through the same empty-field gesture", async () => {
  const { submit } = await startHandSelection(0, 3);
  fireEvent.click(screen.getByRole("button", { name: "Scene background" }));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: { "hand-cards": [] } }));
});

it("selects hand targets directly and commits on the final required target", async () => {
  const { submit, paymentIds } = await startHandSelection(2, 2, "target");
  fireEvent.click(boardCard(paymentIds[0]!));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(boardCard(paymentIds[1]!));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { "hand-cards": [paymentIds[0], paymentIds[1]] } }),
  );
});
it("keeps ordered hand choices in tap order without a second confirmation", async () => {
  const { submit, paymentIds } = await startHandSelection(2, 2, "target", true);
  fireEvent.click(boardCard(paymentIds[1]!));
  fireEvent.click(boardCard(paymentIds[0]!));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { "hand-cards": [paymentIds[1], paymentIds[0]] } }),
  );
});
it("keeps read-only hands inspectable and disables drag-to-play", async () => {
  render(
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop fixture={fixture} />
    </GrandArchiveSimulatorProviders>,
  );
  const hand = screen.getByLabelText("Your hand");
  expect(hand.querySelector('[aria-label^="Drag "]')).toBeNull();
  fireEvent.click(hand.querySelector("button")!);
  expect(await screen.findByRole("button", { name: "Close card inspection" })).toBeTruthy();
  expect(
    within(screen.getByLabelText("Inspected card actions"))
      .queryAllByRole("button")
      .every((button) => button.hasAttribute("disabled")),
  ).toBe(true);
});

it("inspects a concealed deck as a count without exposing faces or submitting", async () => {
  const { submit } = await mount();
  const opponent = screen.getByRole("region", { name: "Opponent arena" });
  fireEvent.click(within(opponent).getByRole("button", { name: /^Deck, \d+ cards$/ }));
  const inspection = await screen.findByRole("dialog");
  expect(within(inspection).getByText("Card identities are private.")).toBeTruthy();
  expect(inspection.querySelector("img")).toBeNull();
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(within(inspection).getByRole("button", { name: "Close Deck" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});

it("separates allies from equipment in both seats without moving the champion", async () => {
  const mixed = GRAND_ARCHIVE_VISUAL_FIXTURES.find((item) => item.id === "field-rows")!;
  const { container } = await mount(mixed);
  for (const side of ["Your", "Opponent"]) {
    const allies = screen.getByLabelText(`${side} allies`);
    const equipment = screen.getByLabelText(`${side} other permanents`);
    expect(within(allies).getByRole("button", { name: /^Port Smuggler,/ })).toBeTruthy();
    expect(within(allies).getByRole("button", { name: /^Woodland Squirrels,/ })).toBeTruthy();
    expect(within(allies).queryByRole("button", { name: /^CookTech Knife,/ })).toBeNull();
    expect(within(equipment).getByRole("button", { name: /^CookTech Knife,/ })).toBeTruthy();
    expect(
      within(screen.getByRole("region", { name: `${side} champion` })).getByRole("button"),
    ).toBeTruthy();
  }
  expect(
    container.querySelectorAll(".ga-scene-card-controls [data-entity-id]").length,
  ).toBeGreaterThan(0);
});

it("advances an empty optional weapon selection before answering required attack targets", async () => {
  const selection = handSelectionFixture(0, 1, "target");
  const original = selection.value.interactionView!.actions[0]!;
  const input = original.inputs[0]!;
  const action = {
    ...original,
    inputs: [
      { ...input, id: "weapons" },
      { ...input, id: "attack-targets", min: 1, max: 1 },
    ],
  };
  const { submit } = await mount({
    ...selection.value,
    interactionView: { ...selection.value.interactionView!, actions: [action] },
  });
  fireEvent.click(boardCard(selection.source));
  fireEvent.click(await screen.findByRole("button", { name: "Activate test card" }));
  fireEvent.click(await screen.findByRole("button", { name: "No weapon" }));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(boardCard(selection.paymentIds[0]!));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({
      values: { weapons: [], "attack-targets": [selection.paymentIds[0]] },
    }),
  );
});

it.each([false, true])(
  "waits for correction or explicit retry after rejecting hand selection ordered=%s",
  async (ordered) => {
    const { submit, paymentIds } = await startHandSelection(2, 2, "cost", ordered);
    submit.mockReturnValue(false);
    fireEvent.click(boardCard(paymentIds[0]!));
    fireEvent.click(boardCard(paymentIds[1]!));
    await screen.findByRole("button", { name: "Retry selection" });
    expect(submit).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Retry selection" }));
    expect(submit).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole("button", { name: "Reset selection" }));
    expect(submit).toHaveBeenCalledTimes(2);
    fireEvent.click(boardCard(paymentIds[1]!));
    fireEvent.click(boardCard(paymentIds[2]!));
    expect(submit).toHaveBeenCalledTimes(3);
  },
);

it("preserves board nodes, scroll and keyboard focus across authoritative state updates", async () => {
  const { rerender } = await mount();
  const hand = screen.getByLabelText("Your hand");
  const track = document.querySelector(".ga-scene-inventory__body")!;
  track.scrollLeft = 37;
  const pass = screen.getByRole("button", { name: "Pass Opportunity" });
  pass.focus();
  rerender(
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop
        fixture={{
          ...fixture,
          table: {
            ...fixture.table,
            status: {
              ...fixture.table.status,
              stateVersion: fixture.table.status.stateVersion + 1,
            },
          },
        }}
        onSubmitProtocolInteraction={() => true}
      />
    </GrandArchiveSimulatorProviders>,
  );
  expect(screen.getByLabelText("Your hand")).toBe(hand);
  expect(track.scrollLeft).toBe(37);
  expect(screen.getByRole("button", { name: "Pass Opportunity" })).toBe(pass);
  expect(document.activeElement).toBe(pass);
});

it("offers image recovery after a board image fails", async () => {
  await mount();
  fireEvent.click(screen.getByRole("button", { name: "Fail texture" }));
  const retry = await screen.findByRole("button", { name: "Retry images" });
  expect(screen.getByText("1 card/table image(s) unavailable")).toBeTruthy();
  fireEvent.click(retry);
  expect(screen.getByLabelText("Texture retry").textContent).toBe("1");
});

it("projects every selected card and its ordered position before the last pick", async () => {
  const { paymentIds } = await startHandSelection(3, 3, "target", true);
  fireEvent.click(boardCard(paymentIds[1]!));
  fireEvent.click(boardCard(paymentIds[0]!));
  expect(screen.getByLabelText("Selected scene cards").textContent).toBe(
    `${paymentIds[1]},${paymentIds[0]}`,
  );
  expect(
    document.querySelector(`[data-entity-id="${paymentIds[1]}"] .ga-scene-selection-order`)
      ?.textContent,
  ).toBe("1");
  expect(
    document.querySelector(`[data-entity-id="${paymentIds[0]}"] .ga-scene-selection-order`)
      ?.textContent,
  ).toBe("2");
});

it("keeps the board mounted and clears selection when the viewer and actor change", async () => {
  const { value, paymentIds, rerender, submit } = await startHandSelection(3, 3);
  fireEvent.click(boardCard(paymentIds[0]!));
  const board = screen.getByTestId("grand-archive-three-board");
  const nextViewer = value.table.seats.find((seat) => seat.perspective === "top")!.id;
  rerender(
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop
        fixture={{
          ...value,
          table: {
            ...value.table,
            seats: value.table.seats.map((seat) => ({
              ...seat,
              perspective: seat.id === nextViewer ? "bottom" : "top",
              label: seat.id === nextViewer ? "Opponent" : "You",
            })),
          },
          interactionView: { ...value.interactionView!, actorId: nextViewer, actions: [] },
          interactions: [],
        }}
        onSubmitProtocolInteraction={submit}
      />
    </GrandArchiveSimulatorProviders>,
  );
  expect(screen.getByTestId("grand-archive-three-board")).toBe(board);
  expect(screen.getByLabelText("Selected scene cards").textContent).toBe("");
  expect(screen.queryByText("You choosing")).toBeNull();
  expect(screen.getAllByText("Opponent choosing").length).toBeGreaterThan(0);
  expect(submit).not.toHaveBeenCalled();
});

it("projects native opening metadata without exposing deck identities", () => {
  const pregame = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "pregame-action")!;
  const projection = grandArchiveBoardProjection(pregame);
  expect(projection.opening).toEqual({
    pregame: true,
    turn: pregame.table.status.turn ?? 0,
    stateVersion: pregame.table.status.stateVersion,
  });
  expect(
    projection.cards
      .filter((card) => card.zone === "main-deck")
      .every((card) => card.faceDown && !card.faceUrl),
  ).toBe(true);
});

it("opens an overflow field card for inspection without taking a native action", async () => {
  const server = findGrandArchiveNativeFixture("native-crowded-board")!.createServer();
  const player = grandArchivePlayerId("p1");
  expect(server.runtime.waitState().kind).toBe("materialization-choice");
  const before = server.runtime.state;
  const current = grandArchiveHarnessFixture(
    "native-crowded-board",
    "Crowded board",
    "Native crowded field inspection",
    projectGrandArchiveSimulator(server.program, before, player),
  );
  const { submit } = await mount(current);
  fireEvent.click(screen.getByRole("button", { name: "Your field (+3 more), 9 cards" }));
  const field = await screen.findByRole("dialog", { name: "Your field (+3 more) · 9" });
  fireEvent.click(within(field).getByRole("button", { name: /Luxera.s Map/ }));
  const inspection = await screen.findByRole("dialog", { name: /Luxera.s Map/ });
  expect(within(inspection).getByRole("button", { name: "Close card inspection" })).toBeTruthy();
  expect(submit).not.toHaveBeenCalled();
  expect(server.runtime.state).toBe(before);
});

it("starts native materialization from the visible phase chooser and pays its legal cost", async () => {
  const server = findGrandArchiveNativeFixture("native-recollection")!.createServer();
  const player = grandArchivePlayerId("p1");
  const projection = projectGrandArchiveSimulator(server.program, server.runtime.state, player);
  const current = grandArchiveHarnessFixture(
    "native-recollection",
    "Recollection",
    "Native materialization",
    projection,
  );
  const action = current.interactionView!.actions.find((entry) =>
    entry.text.key.startsWith("Materialize Rai"),
  )!;
  const { submit } = await mount(current);
  submit.mockImplementation(
    (submission) =>
      server.submitInteraction(player, submission, {
        gameId: "board-materialization",
        sourceAuthority: "client",
      }).success,
  );
  expect(screen.getByRole("region", { name: "Materialization choices" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Choose material" }));
  const dialog = await screen.findByRole("dialog", { name: "Choose a card to materialize" });
  fireEvent.click(within(dialog).getByRole("button", { name: /^Select Rai/ }));
  for (const cost of action.inputs) {
    if (cost.kind !== "entity-selection" || cost.role !== "cost" || cost.min === 0) continue;
    const payment = await screen.findByRole("dialog", { name: "Choose payment cards" });
    for (const candidate of cost.candidates.slice(0, cost.min)) {
      const name = current.entities.find(
        (entity) => entity.id === candidate.entity.instanceId,
      )!.title;
      fireEvent.click(within(payment).getByRole("button", { name: `Select ${name}` }));
    }
  }
  await waitFor(() => expect(submit).toHaveBeenCalledOnce());
  expect(server.runtime.state.zones[player].memory).toHaveLength(2);
  expect(server.runtime.state.zones[player].banishment).toHaveLength(1);
});

it("offers Preserve return in the visible materialization chooser and returns the card to hand", async () => {
  const server = findGrandArchiveNativeFixture("native-preserve")!.createServer();
  const player = grandArchivePlayerId("p1");
  const advance = (label?: string) => {
    const wait = server.runtime.waitState();
    if (!("playerId" in wait)) throw new Error(`No actor in ${wait.kind}`);
    const view = server.getInteractionView(wait.playerId);
    const action = view.actions.find((entry) =>
      label ? entry.text.key.startsWith(label) : entry.intent === "pass",
    );
    if (!action) throw new Error(`Missing native action: ${label ?? "pass"}`);
    const values: Record<string, InteractionSubmissionValue> = {};
    for (const input of action.inputs) {
      if (input.kind === "entity-selection" && input.role === "cost" && input.required)
        values[input.id] = input.candidates
          .slice(0, input.min)
          .map((card) => card.entity.instanceId);
    }
    expect(
      server.submitInteraction(
        wait.playerId,
        buildInteractionSubmission({ view, action, values }),
        {
          gameId: "board-preserve",
          sourceAuthority: "client",
        },
      ).success,
    ).toBe(true);
  };
  advance("Activate Tera Sight");
  for (let step = 0; step < 60; step++) {
    const wait = server.runtime.waitState();
    if (wait.kind === "materialization-choice" && wait.playerId === player) break;
    advance();
  }
  const preserved = Object.values(server.runtime.state.objects).find(
    (card) => card.ownerId === player && card.states.has("preserved"),
  )!;
  expect(preserved.zone).toBe("material-deck");
  const current = grandArchiveHarnessFixture(
    "native-preserve",
    "Preserve",
    "Native Preserve return",
    projectGrandArchiveSimulator(server.program, server.runtime.state, player),
  );
  const { submit } = await mount(current);
  submit.mockImplementation(
    (submission) =>
      server.submitInteraction(player, submission, {
        gameId: "board-preserve",
        sourceAuthority: "client",
      }).success,
  );
  fireEvent.click(screen.getByRole("button", { name: "Choose materialization action" }));
  const dialog = await screen.findByRole("dialog", { name: "Choose a materialization action" });
  expect(
    within(dialog).getByText("Return a preserved card to your hand instead of materializing."),
  ).toBeTruthy();
  expect(within(dialog).queryByText(/before it enters the field/)).toBeNull();
  fireEvent.click(within(dialog).getByRole("button", { name: /^Select Return Tera Sight/ }));
  await waitFor(() => expect(submit).toHaveBeenCalledOnce());
  expect(server.runtime.state.zones[player].hand).toContain(preserved.id);
  expect(server.runtime.state.objects[preserved.id]!.states.has("preserved")).toBe(false);
});

it("arranges only the local hand and resets it for a new fixture without native submission", async () => {
  const { submit, rerender } = await mount();
  const self = fixture.table.seats.find((seat) => seat.perspective === "bottom")!;
  const hand = fixture.table.zones.find(
    (zone) => zone.ownerId === self.id && zone.id.endsWith(":hand"),
  )!;
  const before = JSON.stringify(fixture);
  const ids = hand.entityIds;
  expect(ids.length).toBeGreaterThan(1);
  const card = document.querySelector<HTMLButtonElement>(`button[data-sim-entity-id="${ids[0]}"]`)!;
  fireEvent.click(card);
  await screen.findByRole("button", { name: "Move right" });
  fireEvent.click(screen.getByRole("button", { name: "Move right" }));
  expect(screen.getByLabelText("Scene hand order").textContent).toBe(
    [ids[1], ids[0], ...ids.slice(2)].join(","),
  );
  expect(screen.getByText(`Position 2 of ${ids.length}`)).toBeTruthy();
  expect(JSON.stringify(fixture)).toBe(before);
  expect(submit).not.toHaveBeenCalled();
  rerender(
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop
        fixture={{ ...fixture, id: "new-local-hand" }}
        onSubmitProtocolInteraction={submit}
      />
    </GrandArchiveSimulatorProviders>,
  );
  expect(screen.getByLabelText("Scene hand order").textContent).toBe(ids.join(","));
});

it("skips a genuinely optional spatial payment before the next required input", async () => {
  const selection = handSelectionFixture(1, 1, "cost");
  const original = selection.value.interactionView!.actions[0]!;
  const input = original.inputs[0]!;
  const action = {
    ...original,
    inputs: [
      { ...input, id: "optional-payment", required: false },
      { ...input, id: "required-target", role: "target" as const, required: true },
    ],
  };
  const { submit } = await mount({
    ...selection.value,
    interactionView: { ...selection.value.interactionView!, actions: [action] },
  });
  fireEvent.click(boardCard(selection.source));
  fireEvent.click(await screen.findByRole("button", { name: "Activate test card" }));
  fireEvent.click(await screen.findByRole("button", { name: "Skip payment" }));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(boardCard(selection.paymentIds[0]!));
  await waitFor(() => expect(submit).toHaveBeenCalledOnce());
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { "required-target": [selection.paymentIds[0]] } }),
  );
});
