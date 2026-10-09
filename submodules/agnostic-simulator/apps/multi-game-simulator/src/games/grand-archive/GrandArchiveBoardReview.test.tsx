// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GrandArchiveSimulatorProviders } from "./App";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import { useGrandArchiveCardPreview } from "./GrandArchiveCardPreview";
import { GrandArchiveBoardControls } from "./GrandArchiveBoardControls";
import { GrandArchiveInteractionLayer } from "./GrandArchiveInteractionLayer";
import { GrandArchiveBoard, grandArchiveBoardProjection } from "./GrandArchiveBoard";
import { grandArchivePhysicalCards } from "./grand-archive-physical-cards";
import type { GrandArchiveFeedbackSnapshot } from "./grand-archive-feedback";
import { useGrandArchiveFeedback } from "./useGrandArchiveFeedback";
const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "opportunity")!;
vi.mock("./board-renderer", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./board-renderer")>();
  return {
    ...actual,
    GrandArchiveBoard: ({
      projection,
      events,
    }: import("./board-renderer").GrandArchiveBoardProps) => (
      <div>
        {projection.cards.map((card) => (
          <button
            key={card.id}
            aria-label={`Table card ${card.id}`}
            aria-pressed={projection.selectedCardId === card.id}
            data-candidate={projection.candidateCardIds?.includes(card.id)}
            onClick={() => events?.onCardPick?.(card.id)}
          >
            {card.id}
          </button>
        ))}
      </div>
    ),
  };
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
function HoverPublicCard() {
  const preview = useGrandArchiveCardPreview();
  const card = fixture.entities.find((entity) => entity.face === "public")!;
  return <button onPointerEnter={() => preview.show(card)}>Hover public card</button>;
}
function mount() {
  const submit = vi.fn(() => true);
  const undo = vi.fn();
  render(
    <GrandArchiveSimulatorProviders>
      <GrandArchiveInteractionLayer fixture={fixture} onSubmit={submit}>
        <GrandArchiveBoardControls fixture={fixture} canAct canUndo onUndo={undo} />
        <HoverPublicCard />
      </GrandArchiveInteractionLayer>
    </GrandArchiveSimulatorProviders>,
  );
  return { submit, undo };
}
describe("board review regressions", () => {
  it.each(["face-down", "face-up", undefined])(
    "honors %s memory facing independently of viewer access",
    (facing) => {
      const owner = fixture.table.seats.find((seat) => seat.perspective === "bottom")!.id;
      const entity = fixture.entities.find(
        (card) => card.ownerId === owner && card.face === "public",
      )!;
      const projected = grandArchiveBoardProjection({
        ...fixture,
        entities: [{ ...entity, id: "memory-review", dataAttributes: { "data-facing": facing } }],
        table: {
          ...fixture.table,
          zones: [
            {
              id: `${owner}:memory`,
              ownerId: owner,
              label: "Memory",
              role: "resource",
              visibility: "private",
              entityIds: ["memory-review"],
              count: 1,
              hint: "",
            },
          ],
        },
      });
      expect(projected.cards.find((card) => card.id === "memory-review")?.faceDown).toBe(
        facing !== "face-up",
      );
    },
  );
  it("correlates the native current lineage with its physical host without changing its identity", () => {
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
    const field = fixture.table.zones.find((zone) => zone.id.endsWith(":field"))!;
    const physical = grandArchivePhysicalCards({
      entities: [host, current],
      zones: [
        { ...field, entityIds: [host.id] },
        { ...field, id: `${field.ownerId}:inner-lineage`, entityIds: [current.id] },
      ],
    });
    expect(physical.displayEntityIds.get(current.id)).toBe(host.id);
    expect(physical.cards.map((card) => card.entity.id)).toEqual([host.id]);
    expect(current.id).toBe("native-current");
  });
  it("does not intercept modified Space or redo shortcuts", () => {
    const { submit, undo } = mount();
    for (const modifiers of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
      { shiftKey: true },
    ]) {
      fireEvent.keyDown(window, { key: " ", code: "Space", ...modifiers });
    }
    fireEvent.keyDown(window, { key: "z", ctrlKey: true, shiftKey: true });
    fireEvent.keyDown(window, { key: "z", ctrlKey: true, altKey: true });
    expect(submit).not.toHaveBeenCalled();
    expect(undo).not.toHaveBeenCalled();
    fireEvent.keyDown(window, { key: "z", ctrlKey: true });
    expect(undo).toHaveBeenCalledOnce();
    fireEvent.keyDown(window, { key: " ", code: "Space" });
    expect(submit).toHaveBeenCalledOnce();
  });
  it.each(["dialog", "alertdialog", "menu"])("respects an open %s", (role) => {
    const { submit, undo } = mount();
    render(<div role={role}>Open overlay</div>);
    fireEvent.keyDown(window, { key: " ", code: "Space" });
    fireEvent.keyDown(window, { key: "z", ctrlKey: true });
    expect(submit).not.toHaveBeenCalled();
    expect(undo).not.toHaveBeenCalled();
  });
  it("keeps shortcuts active for a passive hover preview", () => {
    const { submit } = mount();
    fireEvent.pointerEnter(screen.getByRole("button", { name: "Hover public card" }));
    const preview = screen.getByRole("dialog", { name: /^Card preview:/ });
    expect(preview.getAttribute("data-ga-overlay")).toBe("card-preview");
    fireEvent.keyDown(window, { key: " ", code: "Space" });
    expect(submit).toHaveBeenCalledOnce();
  });
  it("makes unavailable Undo reasons reachable on keyboard focus", async () => {
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveInteractionLayer fixture={fixture}>
          <GrandArchiveBoardControls fixture={fixture} canAct onUndo={() => {}} canUndo={false} />
        </GrandArchiveInteractionLayer>
      </GrandArchiveSimulatorProviders>,
    );
    const group = screen.getByRole("group", { name: "Undo unavailable" });
    expect(group.tabIndex).toBe(0);
    fireEvent.focus(group);
    expect((await screen.findByRole("tooltip")).textContent).toBe("No undoable move available.");
  });
  it("retains only recent feedback during a long match", () => {
    const baseline: GrandArchiveFeedbackSnapshot = { ...fixture, eventLog: [] };
    const { result, rerender } = renderHook(({ snapshot }) => useGrandArchiveFeedback(snapshot), {
      initialProps: { snapshot: baseline },
    });
    const events: import("@tcg/simulator-contract").SimulatorEventLogEntry[] = Array.from(
      { length: 205 },
      (_, index) => ({
        id: `review-${index}`,
        message: `Move ${index}`,
        turn: 1,
        phase: "main",
        timestamp: String(index),
        tags: ["move"],
      }),
    );
    // Incremental batches exercise retention across confirmed snapshots.
    for (let count = 1; count <= events.length; count++) {
      rerender({
        snapshot: {
          ...baseline,
          table: {
            ...baseline.table,
            status: { ...baseline.table.status, stateVersion: count + 1 },
          },
          eventLog: events.slice(0, count),
        },
      });
    }
    expect(result.current.history).toHaveLength(200);
    expect(result.current.history[0]?.label).toBe("Move 5");
    expect(result.current.history.at(-1)?.label).toBe("Move 204");
  });
});
