// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GrandArchiveSimulatorProviders } from "./App";
import { grandArchiveBoardProjection } from "./GrandArchiveBoard";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((item) => item.id === "opportunity")!;
vi.mock("./board-renderer", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./board-renderer")>()),
  GrandArchiveBoard: (props: import("./board-renderer").GrandArchiveBoardProps) => (
    <div>
      <button onClick={() => props.events?.onBackgroundPick?.()}>Scene background</button>
      <button onClick={() => props.onAssetStatus?.({ loading: 0, failed: ["card.png"] })}>
        Fail texture
      </button>
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
it("opens direct card inspection without submitting a move", async () => {
  const { submit } = await mount();
  const card = within(screen.getByRole("region", { name: "Your champion" })).getByRole("button");
  fireEvent.click(card);
  expect(await screen.findByRole("button", { name: "Close card inspection" })).toBeTruthy();
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
  expect(within(board).queryByRole("combobox")).toBeNull();
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
