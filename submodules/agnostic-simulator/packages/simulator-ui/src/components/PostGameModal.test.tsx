// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
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
