// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, expect, it, vi } from "vite-plus/test";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router";
import type { LiveBoardState } from "../components/board-types";
import { AlphaClashPracticePage } from "./Practice.page";
let visibleBoard: LiveBoardState | undefined;
// Keep the actual arena, its target picker and ordinary controls; omit WebGL only.
vi.mock("../components/Arena3D/Scene", () => ({
  ArenaScene: ({ board }: { board: LiveBoardState }) => {
    visibleBoard = board;
    return <div>Board scene</div>;
  },
}));
beforeAll(async () => {
  // Load the lazy arena before measuring the UI, rather than timing module transformation.
  await import("../components/Arena3D/AlphaClashArena3D");
});
it("offers effect-play sources and a working decline on the board", async () => {
  render(
    <MantineProvider env="test">
      <MemoryRouter>
        <AlphaClashPracticePage fixtureId="effect-play-declarations" />
      </MemoryRouter>
    </MantineProvider>,
  );
  await screen.findByText("Board scene", {}, { timeout: 10_000 });
  expect(
    await screen.findByRole("button", { name: "Play Recovery contract from Oblivion (1)" }),
  ).toBeDefined();
  expect(
    screen.getByRole("button", { name: "Play Recovery contract from Oblivion (2)" }),
  ).toBeDefined();
  fireEvent.click(screen.getByRole("button", { name: "Decline recovery play" }));
  await waitFor(() =>
    expect(screen.queryByRole("button", { name: "Decline recovery play" })).toBeNull(),
  );
  expect(screen.getByRole("button", { name: "End turn" }).hasAttribute("disabled")).toBe(false);
  expect(
    visibleBoard?.cards.filter(
      (card) => card.name === "Recovery contract" && card.zone === "oblivion",
    ),
  ).toHaveLength(2);
});
beforeEach(() => {
  visibleBoard = undefined;
  window.localStorage.removeItem("alpha-clash.auto-pay");
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  });
});
afterEach(cleanup);
it("plays the selected recovery instance with discard, X and automatic added-cost payment", async () => {
  render(
    <MantineProvider env="test">
      <MemoryRouter>
        <AlphaClashPracticePage fixtureId="effect-play-declarations" />
      </MemoryRouter>
    </MantineProvider>,
  );
  fireEvent.click(
    await screen.findByRole("button", { name: "Play Recovery contract from Oblivion (2)" }),
  );
  fireEvent.click(await screen.findByRole("button", { name: "Additional (required)" }));
  fireEvent.click(await screen.findByRole("button", { name: "Show choices" }));
  fireEvent.click(await screen.findByLabelText("Select Haven, Hiding in Plain Sight"));
  fireEvent.change(await screen.findByRole("spinbutton", { name: "Amount" }), {
    target: { value: "2" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Confirm amount" }));
  await waitFor(() =>
    expect(
      visibleBoard?.cards.filter(
        (card) => card.name === "Recovery contract" && card.zone === "clash",
      ),
    ).toHaveLength(1),
  );
  expect(visibleBoard?.cards.find((card) => card.instanceId === "player-one-20")?.zone).toBe(
    "clash",
  );
  expect(visibleBoard?.cards.find((card) => card.instanceId === "player-one-19")?.zone).toBe(
    "oblivion",
  );
  expect(visibleBoard?.players["player-one"].handSize).toBe(0);
  expect(
    visibleBoard?.cards.filter(
      (card) => card.controller === "player-one" && card.zone === "resource" && card.ready,
    ),
  ).toHaveLength(0);
});
it.each([
  ["token-weapons", "Badge"],
  ["activation-nested-x", "Nested X contract"],
])("renders %s with ordinary card controls", async (fixtureId, name) => {
  render(
    <MantineProvider env="test">
      <MemoryRouter>
        <AlphaClashPracticePage fixtureId={fixtureId} />
      </MemoryRouter>
    </MantineProvider>,
  );
  await screen.findByText("Board scene", {}, { timeout: 10_000 });
  await waitFor(() => expect(visibleBoard?.cards.some((card) => card.name === name)).toBe(true));
  expect(screen.getByRole("button", { name: "Start Clash" }).hasAttribute("disabled")).toBe(false);
});
