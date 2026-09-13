// @vitest-environment jsdom
import type { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReplayPlaybackV1 } from "@tcg/game-page-contract";
import { FabReplayPage } from "./Replay.page";

// The route owns transport behavior. The tabletop and card catalog are separate boundaries.
vi.mock("./FleshAndBloodTabletop", () => ({
  FleshAndBloodTabletop: ({ replayControls }: { replayControls: ReactNode }) => (
    <main>{replayControls}</main>
  ),
}));
vi.mock("./FabPresentationCatalog", () => {
  const registry = { subscribe: () => () => {}, getSnapshot: () => ({ resolver: undefined }) };
  return {
    FabPresentationCatalogProvider: ({ children }: { children: ReactNode }) => children,
    useFabPresentationRegistry: () => registry,
  };
});
vi.mock("./useFabCardPresentation", () => ({ useFabCardPresentation: () => {} }));
vi.mock("./projection", () => ({
  isFabViewerResourcesShape: () => false,
  coerceFabPresentationState: (state: unknown) => state,
}));
vi.mock("./use-fab-event-log", () => ({
  appendFabEngineLogRecords: () => [],
  useFabMatchHistory: () => [],
}));

const playback: ReplayPlaybackV1 = {
  schemaVersion: 1,
  trust: "server_authoritative",
  publishedAt: "2026-09-07T00:00:00.000Z",
  replay: {
    version: 3,
    gameType: "flesh-and-blood",
    gameId: "test",
    matchId: "match",
    seed: "seed",
    participants: [],
    initialState: { turnNumber: 1 },
    checkpoints: [],
    steps: [1, 2, 2].map((turnNumber, index) => ({
      acceptedMove: {
        stateVersion: index + 1,
        turnNumber,
        actorId: "p1",
        moveId: "pass",
        timestamp: index + 1,
      },
      patches: [
        {
          op: "replace",
          path: "",
          value: {
            turnNumber,
            ...(index === 2
              ? { result: { kind: "win", winnerId: "p1", reason: "lethal damage" } }
              : {}),
          },
        },
      ],
      logs: [],
    })),
    metadata: { totalMoves: 3, totalTurns: 2, createdAt: "2026-09-07T00:00:00.000Z" },
  },
};

function openReplay() {
  return render(
    <MantineProvider>
      <MemoryRouter initialEntries={["/replay/test"]}>
        <Routes>
          <Route path="/replay/:gameId" element={<FabReplayPage />} />
        </Routes>
      </MemoryRouter>
    </MantineProvider>,
  );
}
const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("FAB replay route", () => {
  it("navigates turn boundaries, clamps speed, and only forks playable positions", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () => new Response(JSON.stringify(playback)),
    );
    openReplay();
    await screen.findByRole("region", { name: "Replay player" });
    expect(screen.getByRole("slider", { name: "Replay position" })).toBeTruthy();
    expect(screen.getByText("Move 0 / 3")).toBeTruthy();
    // The initial board is already turn 1, so next turn enters turn 2.
    click("Next turn");
    expect(screen.getByText("Move 2 / 3")).toBeTruthy();
    click("Previous turn");
    expect(screen.getByText("Move 1 / 3")).toBeTruthy();
    click("Previous move");
    expect(screen.getByText("Move 0 / 3")).toBeTruthy();
    click("Decrease playback speed");
    click("Decrease playback speed");
    expect(screen.getByText("3.2s / move")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Decrease playback speed" }).hasAttribute("disabled"),
    ).toBe(true);
    for (let i = 0; i < 4; i += 1) click("Increase playback speed");
    expect(screen.getByText("0.2s / move")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Increase playback speed" }).hasAttribute("disabled"),
    ).toBe(true);
    click("Next turn");
    click("Next move");
    expect(screen.getByRole("button", { name: "Fork game" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByText("Step back to fork a playable position.")).toBeTruthy();
    click("Previous move");
    expect(screen.getByRole("link", { name: "Fork game" }).getAttribute("href")).toContain(
      "/fork?step=2",
    );
    click("Previous turn");
    click("Previous move");
    vi.useFakeTimers();
    click("Play");
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByText("Move 1 / 3")).toBeTruthy();
    click("Pause");
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("Move 1 / 3")).toBeTruthy();
  });

  it("keeps recovery actions inside the error card and retries the request", async () => {
    const fetcher = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
      .mockImplementation(async () => new Response(JSON.stringify(playback)));
    openReplay();
    const retry = await screen.findByRole("button", { name: "Retry" });
    expect(within(screen.getByRole("status")).getByRole("button", { name: "Retry" })).toBe(retry);
    fireEvent.click(retry);
    await screen.findByRole("region", { name: "Replay player" });
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
  });
});
