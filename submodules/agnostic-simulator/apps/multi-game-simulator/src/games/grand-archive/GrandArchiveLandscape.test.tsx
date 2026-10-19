// @vitest-environment jsdom
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { InteractionAction, InteractionSubmission } from "@tcg/protocol";
import { GrandArchiveSimulatorProviders } from "./App";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";

const renderer = vi.hoisted(() => ({ mounts: 0, unmounts: 0 }));
vi.mock("./board-renderer", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./board-renderer")>()),
  GrandArchiveBoard: (props: import("./board-renderer").GrandArchiveBoardProps) => {
    useEffect(() => {
      renderer.mounts++;
      return () => {
        renderer.unmounts++;
      };
    }, []);
    return (
      <output data-testid="landscape-scene">{props.projection.selectedCardIds?.join(",")}</output>
    );
  },
}));

let width = 844;
let height = 390;
const mediaListeners = new Map<string, Set<(event: { matches: boolean; media: string }) => void>>();
function matches(query: string) {
  return query.split(",").some((part) => {
    if (part.includes("prefers-reduced-motion")) return false;
    if (part.includes("orientation: portrait") && height <= width) return false;
    if (part.includes("orientation: landscape") && width <= height) return false;
    const maxWidth = part.match(/max-width:\s*(\d+)px/);
    const minWidth = part.match(/min-width:\s*(\d+)px/);
    const maxHeight = part.match(/max-height:\s*(\d+)px/);
    return (
      (!maxWidth || width <= Number(maxWidth[1])) &&
      (!minWidth || width >= Number(minWidth[1])) &&
      (!maxHeight || height <= Number(maxHeight[1]))
    );
  });
}
function rotate(nextWidth: number, nextHeight: number) {
  act(() => {
    width = nextWidth;
    height = nextHeight;
    vi.stubGlobal("innerWidth", width);
    vi.stubGlobal("innerHeight", height);
    for (const [query, listeners] of mediaListeners) {
      for (const listener of listeners) listener({ matches: matches(query), media: query });
    }
    window.dispatchEvent(new Event("resize"));
  });
}
beforeEach(() => {
  renderer.mounts = 0;
  renderer.unmounts = 0;
  mediaListeners.clear();
  vi.stubGlobal("WebGLRenderingContext", class {});
  vi.stubGlobal("matchMedia", (query: string) => {
    const listeners =
      mediaListeners.get(query) ?? new Set<(event: { matches: boolean; media: string }) => void>();
    mediaListeners.set(query, listeners);
    return {
      get matches() {
        return matches(query);
      },
      media: query,
      onchange: null,
      addEventListener: (
        _type: string,
        listener: (event: { matches: boolean; media: string }) => void,
      ) => listeners.add(listener),
      removeEventListener: (
        _type: string,
        listener: (event: { matches: boolean; media: string }) => void,
      ) => listeners.delete(listener),
      addListener: (listener: (event: { matches: boolean; media: string }) => void) =>
        listeners.add(listener),
      removeListener: (listener: (event: { matches: boolean; media: string }) => void) =>
        listeners.delete(listener),
      dispatchEvent: () => true,
    };
  });
  rotate(844, 390);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((item) => item.id === "opportunity")!;
function mount(value: GrandArchiveHarnessFixture = fixture) {
  const submit = vi.fn((_submission: InteractionSubmission) => true);
  const view = render(
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop fixture={value} onSubmitProtocolInteraction={submit} />
    </GrandArchiveSimulatorProviders>,
  );
  return { ...view, submit };
}
function boardCard(id: string) {
  const card = document.querySelector<HTMLButtonElement>(
    `.ga-scene-card-control[data-entity-id="${id}"] button`,
  );
  if (!card) throw new Error(`Missing board card ${id}`);
  return card;
}

it("blocks portrait gameplay, keeps the renderer mounted, and restores landscape input", async () => {
  rotate(390, 844);
  const { container, submit } = mount();
  const guard = await screen.findByRole("dialog", { name: "Turn to landscape" });
  expect(document.activeElement).toBe(guard);
  expect(container.querySelector(".ga-landscape-session")?.hasAttribute("inert")).toBe(true);
  expect(screen.queryByRole("button", { name: "Pass Opportunity" })).toBeNull();
  fireEvent.keyDown(window, { key: " ", code: "Space" });
  expect(submit).not.toHaveBeenCalled();
  const scene = screen.getByTestId("landscape-scene");
  expect(renderer.mounts).toBe(1);
  rotate(844, 390);
  await waitFor(() =>
    expect(screen.queryByRole("dialog", { name: "Turn to landscape" })).toBeNull(),
  );
  expect(container.querySelector(".ga-landscape-session")?.hasAttribute("inert")).toBe(false);
  expect(screen.getByTestId("landscape-scene")).toBe(scene);
  expect(renderer.unmounts).toBe(0);
  fireEvent.click(screen.getByRole("button", { name: "Pass Opportunity" }));
  expect(submit).toHaveBeenCalledOnce();
});

it("preserves a partial card selection across portrait and landscape", async () => {
  const self = fixture.table.seats.find((seat) => seat.perspective === "bottom")!;
  const hand = fixture.table.zones.find((zone) => zone.id === `${self.id}:hand`)!;
  const [source, first, second] = hand.entityIds;
  if (!source || !first || !second) throw new Error("Selection fixture needs three hand cards");
  const action: InteractionAction = {
    ...fixture.interactionView!.actions.find((entry) => entry.enabled)!,
    id: "landscape-selection",
    intent: "activate",
    inputs: [
      {
        id: "cards",
        kind: "entity-selection",
        text: { key: "Choose two cards" },
        role: "cost",
        entityKinds: ["card"],
        ordered: false,
        min: 2,
        max: 2,
        candidates: [first, second].map((id) => ({
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
        label: "Choose two cards",
        movePreview: { ...fixture.interactions[0]!.movePreview, command: "activate-card" },
      },
    ],
  };
  const { submit } = mount(value);
  fireEvent.click(boardCard(source));
  fireEvent.click(await screen.findByRole("button", { name: "Choose two cards" }));
  fireEvent.click(boardCard(first));
  expect(submit).not.toHaveBeenCalled();
  const scene = screen.getByTestId("landscape-scene");
  expect(scene.textContent).toContain(first);
  rotate(390, 844);
  await screen.findByRole("dialog", { name: "Turn to landscape" });
  fireEvent.keyDown(window, { key: "Escape", code: "Escape" });
  expect(submit).not.toHaveBeenCalled();
  rotate(844, 390);
  await waitFor(() =>
    expect(screen.queryByRole("dialog", { name: "Turn to landscape" })).toBeNull(),
  );
  expect(screen.getByTestId("landscape-scene")).toBe(scene);
  expect(scene.textContent).toContain(first);
  expect(renderer.mounts).toBe(1);
  expect(renderer.unmounts).toBe(0);
  fireEvent.click(boardCard(second));
  await waitFor(() => expect(submit).toHaveBeenCalledOnce());
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ actionId: action.id, values: { cards: [first, second] } }),
  );
});

it("keeps browser navigation keys available while blocking game activation and portal focus", async () => {
  rotate(390, 844);
  const { submit } = mount();
  const guard = await screen.findByRole("dialog", { name: "Turn to landscape" });
  expect(fireEvent.keyDown(window, { key: "l", code: "KeyL", ctrlKey: true })).toBe(true);
  expect(fireEvent.keyDown(window, { key: "+", code: "Equal", metaKey: true })).toBe(true);
  expect(fireEvent.keyDown(window, { key: "Tab", code: "Tab" })).toBe(true);
  expect(fireEvent.keyDown(window, { key: " ", code: "Space" })).toBe(false);
  expect(fireEvent.keyDown(window, { key: "Enter", code: "Enter" })).toBe(false);
  const portalButton = document.createElement("button");
  document.body.append(portalButton);
  try {
    act(() => portalButton.focus());
    expect(document.activeElement).toBe(guard);
    expect(submit).not.toHaveBeenCalled();
  } finally {
    portalButton.remove();
  }
});

it("isolates existing and newly mounted body portals, then restores their accessibility", async () => {
  const submit = vi.fn(() => true);
  const table = (latePortal = false) => (
    <GrandArchiveSimulatorProviders>
      <GrandArchiveTabletop fixture={fixture} onSubmitProtocolInteraction={submit} />
      {createPortal(
        <div
          data-testid="existing-choice"
          role="dialog"
          aria-label="Open card choice"
          aria-hidden={false}
        >
          <button>Confirm card choice</button>
        </div>,
        document.body,
      )}
      {latePortal
        ? createPortal(
            <div data-testid="late-choice" role="dialog" aria-label="Late card choice">
              <button>Confirm late choice</button>
            </div>,
            document.body,
          )
        : null}
    </GrandArchiveSimulatorProviders>
  );
  const view = render(table());
  const existing = screen.getByTestId("existing-choice");
  expect(screen.getByRole("dialog", { name: "Open card choice" })).toBe(existing);
  rotate(390, 844);
  await screen.findByRole("dialog", { name: "Turn to landscape" });
  expect(screen.queryByRole("dialog", { name: "Open card choice" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Confirm card choice" })).toBeNull();
  expect(existing.inert).toBe(true);
  view.rerender(table(true));
  const late = screen.getByTestId("late-choice");
  await waitFor(() => expect(late.inert).toBe(true));
  expect(screen.queryByRole("dialog", { name: "Late card choice" })).toBeNull();
  rotate(844, 390);
  await waitFor(() =>
    expect(screen.queryByRole("dialog", { name: "Turn to landscape" })).toBeNull(),
  );
  expect(screen.getByRole("dialog", { name: "Open card choice" })).toBe(existing);
  expect(existing.getAttribute("aria-hidden")).toBe("false");
  expect(existing.hasAttribute("inert")).toBe(false);
  expect(screen.getByRole("dialog", { name: "Late card choice" })).toBe(late);
  expect(late.hasAttribute("aria-hidden")).toBe(false);
  expect(late.hasAttribute("inert")).toBe(false);
  expect(submit).not.toHaveBeenCalled();
});
