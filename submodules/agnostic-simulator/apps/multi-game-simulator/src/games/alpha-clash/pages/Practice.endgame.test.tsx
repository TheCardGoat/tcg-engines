// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter, useLocation } from "react-router";
import type { ComponentProps } from "react";
import type Arena from "../components/Arena3D/AlphaClashArena3D";
import { createAlphaClashPracticeEngine } from "../practice-setup";
import { AlphaClashPracticePage } from "./Practice.page";

// Start the routed practice page from a legal native pre-end fixture. Only the
// setup factory and WebGL presentation are replaced; the action and result are native.
vi.mock("../practice-setup", async (importOriginal) => {
  const original = await importOriginal<typeof import("../practice-setup")>();
  const { createAlphaClashVisualFixture } = await import("../visual-fixtures");
  return {
    ...original,
    createAlphaClashPracticeEngine: vi.fn(async () =>
      createAlphaClashVisualFixture("finish-deckout"),
    ),
  };
});
vi.mock("../components/Arena3D/AlphaClashArena3D", () => ({
  default: ({ controls }: ComponentProps<typeof Arena>) => <>{controls}</>,
}));
vi.mock("../components/useAlphaClashPresentation", () => ({
  useAlphaClashPresentation: () => ({
    busy: false,
    strike: null,
    finishStrike: vi.fn(),
    onSceneAnchors: vi.fn(),
  }),
}));
beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  });
});
afterEach(cleanup);
function Location() {
  return <output data-testid="location">{useLocation().search}</output>;
}

test("practice can replay with the same decks and mode, then return to setup", async () => {
  render(
    <MantineProvider>
      <MemoryRouter
        initialEntries={[
          "/alpha-clash/simulator/practice?playerDeck=clarity-hyper-aggro&opponentDeck=absence-makati&seed=first&mode=bot",
        ]}
      >
        <AlphaClashPracticePage />
        <Location />
      </MemoryRouter>
    </MantineProvider>,
  );
  fireEvent.click(await screen.findByRole("button", { name: "End turn" }));
  await screen.findByTestId("ac-post-game-summary");
  expect(screen.getByTestId("post-game-headline").textContent).toBe("Victory");
  fireEvent.click(screen.getByRole("button", { name: "Play again" }));
  await screen.findByRole("button", { name: "End turn" });
  expect(screen.queryByTestId("ac-post-game-summary")).toBeNull();
  expect(createAlphaClashPracticeEngine).toHaveBeenCalledTimes(2);
  const [first, second] = vi
    .mocked(createAlphaClashPracticeEngine)
    .mock.calls.map(([setup]) => setup);
  expect(second).toEqual({ ...first, seed: expect.any(String) });
  expect(second.seed).not.toBe(first.seed);
  expect(new URLSearchParams(screen.getByTestId("location").textContent ?? "").get("mode")).toBe(
    "bot",
  );
  fireEvent.click(screen.getByRole("button", { name: "End turn" }));
  await screen.findByTestId("ac-post-game-summary");
  fireEvent.click(screen.getByRole("button", { name: "Back to setup" }));
  await waitFor(() => expect(screen.getByTestId("location").textContent).toBe("?mode=bot"));
  expect(screen.queryByTestId("ac-post-game-summary")).toBeNull();
});
