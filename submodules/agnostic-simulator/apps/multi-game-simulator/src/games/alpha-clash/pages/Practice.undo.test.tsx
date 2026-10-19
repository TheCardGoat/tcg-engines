// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router";
import type { ComponentProps } from "react";
import type Arena from "../components/Arena3D/AlphaClashArena3D";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { createAlphaClashPracticeEngine } from "../practice-setup";
import { AlphaClashPracticePage } from "./Practice.page";
vi.mock("../practice-setup", async (original) => ({
  ...(await original<typeof import("../practice-setup")>()),
  createAlphaClashPracticeEngine: vi.fn(),
}));
// Retain the production controls and real adapter; only omit the WebGL canvas.
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
it.each(["Undo", "Undo turn"])(
  "the practice %s button restores the native checkpoint",
  async (label) => {
    const g = Spec.fromFixture({
      phase: { name: "expansion", step: "resource" },
      playerOne: { resource: 8 },
    });
    const engine = new AlphaClashServerEngine(g.state, { human: "player-one", bot: "player-two" });
    vi.mocked(createAlphaClashPracticeEngine).mockResolvedValue(engine);
    const start = structuredClone(engine.state);
    render(
      <MantineProvider env="test">
        <MemoryRouter
          initialEntries={[
            "/alpha-clash/simulator/practice?playerDeck=clarity-hyper-aggro&opponentDeck=absence-makati&mode=self",
          ]}
        >
          <AlphaClashPracticePage />
        </MemoryRouter>
      </MantineProvider>,
    );
    fireEvent.click(await screen.findByRole("button", { name: "Skip the Resource Step" }));
    await waitFor(() => expect(engine.state.phase.name).toBe("primary"));
    const primary = structuredClone(engine.state);
    fireEvent.click(await screen.findByRole("button", { name: "Open the Portal" }));
    await waitFor(() => expect(engine.state.portalOpen).toBe(true));
    const version = engine.getStateID();
    const button = screen.getByRole("button", { name: label });
    expect(button.hasAttribute("disabled")).toBe(false);
    fireEvent.click(button);
    await waitFor(() => expect(engine.getStateID()).toBe(version + 1));
    expect(engine.state).toEqual({ ...(label === "Undo" ? primary : start), stateID: version + 1 });
  },
);
