// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { GameTable } from "./GameTable.tsx";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("GameTable", () => {
  it("fills its bounded shell without growing past the viewport", () => {
    const { container } = render(<GameTable>board</GameTable>);
    const table = container.querySelector<HTMLElement>("[data-sim-board]");

    expect(table).not.toBeNull();
    expect(table!.className).toContain("h-full");
    expect(table!.className).toContain("min-h-0");
    expect(table!.className).toContain("overflow-hidden");
  });

  it("aligns the mobile board to the viewer after seat heights settle", async () => {
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 320 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 568 });

    let resizeCallback: ResizeObserverCallback | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    try {
      const { container } = render(
        <GameTable>
          <div data-seat-side="top" />
          <div data-seat-side="bottom" />
        </GameTable>,
      );
      await waitFor(() => expect(resizeCallback).toBeDefined());
      const table = container.querySelector<HTMLElement>("[data-sim-board]")!;

      act(() => frames.splice(0).forEach((frame) => frame(0)));
      expect(disconnect).not.toHaveBeenCalled();

      Object.defineProperty(table, "scrollHeight", { configurable: true, value: 650 });
      Object.defineProperty(table, "clientHeight", { configurable: true, value: 460 });
      act(() => {
        resizeCallback?.([], {} as ResizeObserver);
        frames.splice(0).forEach((frame) => frame(0));
      });

      expect(table.scrollTop).toBe(190);
      expect(disconnect).not.toHaveBeenCalled();

      Object.defineProperty(table, "scrollHeight", { configurable: true, value: 740 });
      act(() => {
        resizeCallback?.([], {} as ResizeObserver);
        frames.splice(0).forEach((frame) => frame(0));
      });
      expect(table.scrollTop).toBe(280);

      table.scrollTop = 40;
      act(() => table.dispatchEvent(new Event("scroll")));
      Object.defineProperty(table, "scrollHeight", { configurable: true, value: 800 });
      act(() => {
        resizeCallback?.([], {} as ResizeObserver);
        frames.splice(0).forEach((frame) => frame(0));
      });
      expect(table.scrollTop).toBe(40);
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
      Object.defineProperty(window, "innerHeight", { configurable: true, value: originalHeight });
    }
  });

  it("exposes offscreen empty boards through accurately named mobile edge controls", async () => {
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 320 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 568 });

    let resizeCallback: ResizeObserverCallback | undefined;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback;
        }
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    try {
      const { container } = render(
        <GameTable>
          <div data-seat-side="top" />
          <div data-seat-side="bottom" />
        </GameTable>,
      );
      await waitFor(() => expect(resizeCallback).toBeDefined());
      const table = container.querySelector<HTMLElement>("[data-sim-board]")!;
      Object.defineProperty(table, "scrollHeight", { configurable: true, value: 650 });
      Object.defineProperty(table, "clientHeight", { configurable: true, value: 460 });
      const scrollTo = vi.fn((options: ScrollToOptions) => {
        table.scrollTop = options.top as number;
        table.dispatchEvent(new Event("scroll"));
      });
      Object.defineProperty(table, "scrollTo", {
        configurable: true,
        value: scrollTo,
      });

      act(() => {
        resizeCallback?.([], {} as ResizeObserver);
        frames.splice(0).forEach((frame) => frame(0));
      });

      const rivalCue = await waitFor(() =>
        container.querySelector<HTMLButtonElement>('[aria-label="View rival board"]'),
      );
      expect(rivalCue).not.toBeNull();
      fireEvent.click(rivalCue!);
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "smooth" });
      expect(
        container.querySelector<HTMLButtonElement>('[aria-label="View your board"]'),
      ).not.toBeNull();

      fireEvent.click(
        container.querySelector<HTMLButtonElement>('[aria-label="View your board"]')!,
      );
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 190, behavior: "smooth" });

      const blockingDialog = document.createElement("section");
      blockingDialog.setAttribute("role", "dialog");
      blockingDialog.setAttribute("aria-modal", "true");
      table.append(blockingDialog);
      await waitFor(() => {
        expect(container.querySelector('[aria-label="View rival board"]')).toBeNull();
        expect(container.querySelector('[aria-label="View your board"]')).toBeNull();
      });
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
      Object.defineProperty(window, "innerHeight", { configurable: true, value: originalHeight });
    }
  });

  it("hides a field cue when that battlefield is already materially visible", async () => {
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 320 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 568 });

    let resizeCallback: ResizeObserverCallback | undefined;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback;
        }
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    try {
      const { container } = render(
        <GameTable>
          <div data-seat-side="top">
            <div data-seat-row="resources" />
            <div data-seat-row="field">
              <div data-sim-entity-id="rival-unit" />
            </div>
          </div>
          <div data-seat-side="bottom">
            <div data-seat-row="field" />
          </div>
        </GameTable>,
      );
      await waitFor(() => expect(resizeCallback).toBeDefined());
      const table = container.querySelector<HTMLElement>("[data-sim-board]")!;
      const rivalField = container.querySelector<HTMLElement>(
        '[data-seat-side="top"] [data-seat-row="field"]',
      )!;
      const rivalResources = container.querySelector<HTMLElement>(
        '[data-seat-side="top"] [data-seat-row="resources"]',
      )!;
      const viewerField = container.querySelector<HTMLElement>(
        '[data-seat-side="bottom"] [data-seat-row="field"]',
      )!;
      Object.defineProperty(table, "scrollHeight", { configurable: true, value: 650 });
      Object.defineProperty(table, "clientHeight", { configurable: true, value: 460 });
      vi.spyOn(table, "getBoundingClientRect").mockReturnValue({ top: 50 } as DOMRect);
      const rivalFieldRect = vi.spyOn(rivalField, "getBoundingClientRect").mockReturnValue({
        top: -100,
        bottom: 80,
        height: 180,
      } as DOMRect);
      vi.spyOn(rivalResources, "getBoundingClientRect").mockReturnValue({
        top: -60,
        bottom: 40,
        height: 100,
      } as DOMRect);
      vi.spyOn(viewerField, "getBoundingClientRect").mockReturnValue({
        top: 300,
        bottom: 480,
        height: 180,
      } as DOMRect);

      act(() => {
        resizeCallback?.([], {} as ResizeObserver);
        frames.splice(0).forEach((frame) => frame(0));
      });

      expect(
        container.querySelector<HTMLButtonElement>('[aria-label="View rival field"]'),
      ).not.toBeNull();
      expect(
        container.querySelector<HTMLButtonElement>('[aria-label="Return to your field"]'),
      ).toBeNull();

      container.querySelector<HTMLElement>('[data-sim-entity-id="rival-unit"]')!.remove();
      rivalFieldRect.mockReturnValue({ top: 100, bottom: 280, height: 180 } as DOMRect);
      act(() => table.dispatchEvent(new Event("scroll")));

      expect(
        container.querySelector<HTMLButtonElement>('[aria-label="View rival board"]'),
      ).not.toBeNull();
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
      Object.defineProperty(window, "innerHeight", { configurable: true, value: originalHeight });
    }
  });

  it("prioritizes an actionable battlefield over the hand in a short viewport", async () => {
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 667 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 375 });

    let resizeCallback: ResizeObserverCallback | undefined;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback;
        }
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    try {
      const { container } = render(
        <GameTable>
          <div data-seat-side="top" />
          <div data-seat-side="bottom">
            <div data-seat-row="field">
              <div data-fixed-slot-card-zone data-slot-count="1" />
              <div data-actionable="true" />
            </div>
            <div data-seat-row="hand">
              <div data-draggable="false" />
            </div>
          </div>
        </GameTable>,
      );
      await waitFor(() => expect(resizeCallback).toBeDefined());
      const table = container.querySelector<HTMLElement>("[data-sim-board]")!;
      const field = container.querySelector<HTMLElement>('[data-seat-row="field"]')!;
      const handCard = container.querySelector<HTMLElement>("[data-draggable]")!;
      Object.defineProperty(table, "scrollHeight", { configurable: true, value: 800 });
      Object.defineProperty(table, "clientHeight", { configurable: true, value: 300 });
      vi.spyOn(table, "getBoundingClientRect").mockReturnValue({
        top: 50,
      } as DOMRect);
      vi.spyOn(field, "getBoundingClientRect").mockImplementation(() => {
        const top = 390 - table.scrollTop;
        return { top, bottom: top + 180, height: 180 } as DOMRect;
      });
      vi.spyOn(handCard, "getBoundingClientRect").mockImplementation(() => {
        const top = 760 - table.scrollTop;
        return { top, bottom: top + 100, height: 100 } as DOMRect;
      });

      act(() => frames.splice(0).forEach((frame) => frame(0)));

      expect(table.scrollTop).toBe(340);

      handCard.dataset.draggable = "true";
      act(() => {
        resizeCallback?.([], {} as ResizeObserver);
        frames.splice(0).forEach((frame) => frame(0));
      });

      expect(table.scrollTop).toBe(340);
      expect(
        container.querySelector<HTMLButtonElement>('[aria-label="View your hand"]'),
      ).not.toBeNull();

      field.querySelector<HTMLElement>("[data-actionable]")!.dataset.actionable = "false";
      act(() => {
        resizeCallback?.([], {} as ResizeObserver);
        frames.splice(0).forEach((frame) => frame(0));
      });

      expect(table.scrollTop).toBe(500);

      handCard.dataset.draggable = "false";
      field.querySelector<HTMLElement>("[data-slot-count]")!.dataset.slotCount = "0";
      act(() => {
        resizeCallback?.([], {} as ResizeObserver);
        frames.splice(0).forEach((frame) => frame(0));
      });

      expect(table.scrollTop).toBe(500);
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
      Object.defineProperty(window, "innerHeight", { configurable: true, value: originalHeight });
    }
  });
});
