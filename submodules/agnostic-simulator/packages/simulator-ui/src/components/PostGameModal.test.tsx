// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import confetti from "canvas-confetti";

import { PostGameModal } from "./PostGameModal";

vi.mock("canvas-confetti", () => {
  const fn = vi.fn();
  return {
    default: Object.assign(fn, { reset: vi.fn() }),
  };
});

describe("PostGameModal", () => {
  test("renders the first match-detail section in the initial HTML", () => {
    const html = renderToStaticMarkup(
      <PostGameModal
        open
        outcome="win"
        sections={[
          { id: "overview", label: "Overview", content: <p>Match overview</p> },
          { id: "turns", label: "Turns", content: <p>Turn details</p> },
        ]}
      />,
    );

    expect(html).toContain("Match overview");
    expect(html).not.toContain("Turn details");
  });

  beforeEach(() => {
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn(() => 1),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test("compact details are always visible and allow section selection", async () => {
    const view = await renderClient(
      <PostGameModal
        open
        layout="compact"
        outcome="loss"
        sections={[
          { id: "overview", label: "Overview", content: <p>Match overview</p> },
          { id: "turns", label: "Turns", content: <p>Turn details</p> },
        ]}
      />,
    );
    expect(view.container.querySelector("details")).toBeNull();
    expect(view.container.querySelector("summary")).toBeNull();
    expect(view.container.querySelector('section[aria-label="Match details"]')?.textContent).toContain("Match overview");
    const turns = Array.from(view.container.querySelectorAll("button")).find(
      (button) => button.textContent === "Turns",
    );
    await act(async () => turns?.click());
    expect(view.container.textContent).toContain("Turn details");
    expect(view.container.textContent).not.toContain("Match overview");
    expect(view.container.querySelector("summary")).toBeNull();
    view.unmount();
  });

  test("keeps win confetti running after the celebration key is recorded", async () => {
    const view = await renderClient(
      <PostGameModal
        open
        outcome="win"
        reason="Gig victory: first to 6 gigs"
        celebrationKey="game-1:12:player"
      />,
    );

    expect(confetti).toHaveBeenCalled();
    expect(confetti.reset).not.toHaveBeenCalled();
    view.unmount();
  });

  test("does not relaunch confetti for the same finished game key", async () => {
    const view = await renderClient(
      <PostGameModal
        open
        outcome="win"
        reason="Gig victory: first to 6 gigs"
        celebrationKey="game-1:12:player"
      />,
    );

    const initialCalls = vi.mocked(confetti).mock.calls.length;

    await view.render(
      <PostGameModal
        open
        outcome="win"
        reason="Gig victory: first to 6 gigs"
        celebrationKey="game-1:12:player"
      />,
    );

    expect(confetti).toHaveBeenCalledTimes(initialCalls);
    view.unmount();
  });
});

async function renderClient(element: ReactElement): Promise<{
  container: HTMLDivElement;
  root: Root;
  render: (next: ReactElement) => Promise<void>;
  unmount: () => void;
}> {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  const render = async (next: ReactElement) => {
    await act(async () => {
      root.render(next);
    });
  };

  await render(element);

  return {
    container,
    root,
    render,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}
