// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import {
  PendingResolutionCards,
  RESOLUTION_EXIT_MS,
  type PendingResolutionCard,
} from "./PendingResolutionCards";
import { CardPresentationPlane, CARD_PRESENTATION_LAYERS } from "./CardPresentationPlane";

function card(id: string): PendingResolutionCard {
  return {
    anchorId: `resolution:${id}`,
    label: "Resolving",
    entity: {
      id,
      title: id,
      subtitle: "",
      kind: "card",
      ownerId: "p1",
      face: "public",
      states: [],
      stats: [],
      traits: [],
    },
  };
}
let root: Root;
let container: HTMLDivElement | undefined;
const render = async (
  current: PendingResolutionCard | null,
  retained: PendingResolutionCard[] = [],
) => {
  if (!container) {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  }
  await act(async () =>
    root.render(
      <CardPresentationPlane>
        <PendingResolutionCards current={current} retained={retained} elevated />
      </CardPresentationPlane>,
    ),
  );
};
afterEach(async () => {
  await act(async () => root?.unmount());
  container?.remove();
  container = undefined;
  vi.useRealTimers();
});
describe("pending card presentation", () => {
  it("fades once after resolution and does not revive a stale card", async () => {
    vi.useFakeTimers();
    const a = card("A");
    await render(a);
    await render(null);
    expect(container?.querySelector('[data-resolution-phase="exiting"]')).not.toBeNull();
    await act(async () => vi.advanceTimersByTime(RESOLUTION_EXIT_MS));
    expect(container?.querySelector('[data-testid="pending-resolution-card"]')).toBeNull();
    await render(null, [card("B")]);
    expect(container?.querySelector('[data-testid="pending-resolution-card"]')).toBeNull();
  });
  it("keeps outgoing anchors without duplicating the visible card", async () => {
    const a = card("A"),
      b = card("B");
    await render(b, [a, b, a]);
    expect(container?.querySelectorAll("[data-sim-anchor-id]")).toHaveLength(2);
    expect(
      container?.querySelector('[data-resolution-phase="anchor"]')?.getAttribute("aria-hidden"),
    ).toBe("true");
    expect(
      container?.querySelector('[data-resolution-phase="pending"]')?.getAttribute("data-entity-id"),
    ).toBe("B");
  });
  it("cancels an old exit when another card takes the focus plane", async () => {
    vi.useFakeTimers();
    await render(card("A"));
    await render(null);
    await render(card("B"));
    await act(async () => vi.advanceTimersByTime(RESOLUTION_EXIT_MS));
    expect(
      container?.querySelector('[data-resolution-phase="pending"]')?.getAttribute("data-entity-id"),
    ).toBe("B");
    expect(container?.querySelector('[data-entity-id="A"]')).toBeNull();
  });
  it("keeps each card's side through retained anchors and the exit fade", async () => {
    vi.useFakeTimers();
    const local: PendingResolutionCard = { ...card("Local"), side: "left" };
    const rival: PendingResolutionCard = { ...card("Rival"), side: "right" };
    await render(rival, [local]);
    expect(
      container?.querySelector('[data-entity-id="Rival"]')?.getAttribute("data-resolution-side"),
    ).toBe("right");
    expect(
      container?.querySelector('[data-entity-id="Local"]')?.getAttribute("data-resolution-side"),
    ).toBe("left");
    await render(null, [local]);
    expect(
      container
        ?.querySelector('[data-resolution-phase="exiting"]')
        ?.getAttribute("data-resolution-side"),
    ).toBe("right");
    await act(async () => vi.advanceTimersByTime(RESOLUTION_EXIT_MS));
    expect(container?.querySelector('[data-entity-id="Rival"]')).toBeNull();
    expect(
      container?.querySelector('[data-entity-id="Local"]')?.getAttribute("data-resolution-side"),
    ).toBe("left");
  });
  it("uses a pointer-transparent focus plane above moving cards", async () => {
    await render(card("A"));
    const plane = container?.querySelector<HTMLElement>('[data-card-presentation-layer="focus"]');
    expect(plane?.style.pointerEvents).toBe("none");
    expect(Number(plane?.style.zIndex)).toBeGreaterThan(CARD_PRESENTATION_LAYERS.motion);
  });
  it("escapes an isolated board while retaining its screen coordinates", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
      new DOMRect(30, 40, 600, 400),
    );
    await render(null);
    await act(async () => root.render(<CardPresentationPlane portal data-testid="portal-plane" />));
    const plane = document.querySelector<HTMLElement>('[data-testid="portal-plane"]');
    expect(plane?.parentElement).toBe(document.body);
    expect(plane?.style.position).toBe("fixed");
    expect(plane?.style.left).toBe("30px");
    expect(plane?.style.top).toBe("40px");
    expect(plane?.style.width).toBe("600px");
    expect(plane?.style.height).toBe("400px");
    vi.restoreAllMocks();
  });
});
