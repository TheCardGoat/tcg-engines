// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MatchSessionSchema } from "@tcg/game-page-contract";
import { dorinthea } from "@tcg/flesh-and-blood-cards/cards/heroes/dorinthea";
import { registerFabCardDefinition } from "@tcg/flesh-and-blood-engine/simulator";
import { installBrowserShims } from "../../testing/browser-shims";
import { FabPreparationPage } from "./FabPreparation.page";
import { FabPresentationCatalogProvider } from "./FabPresentationCatalog";

const recovery = vi.hoisted(() => ({
  error: null as string | null,
  refresh: vi.fn(),
  refreshing: false,
}));
vi.mock("../../simulator/MatchSessionProvider", () => ({ useMatchSession: () => recovery }));
beforeEach(() => {
  installBrowserShims();
  recovery.error = null;
  recovery.refresh.mockReset();
});
afterEach(cleanup);

it("keeps preparation interactive for a waiting player and exposes recovery", () => {
  const hero = registerFabCardDefinition(dorinthea);
  const session = MatchSessionSchema.parse({
    schemaVersion: 2,
    revision: 1,
    phase: "preparation",
    gameId: "g1",
    match: {
      matchId: "m1",
      gameType: "flesh-and-blood",
      format: "best_of_1",
      matchType: "casual",
      status: "waiting",
      participants: [],
      gameIds: [],
    },
    viewer: {
      role: "player",
      userId: "u1",
      actorId: "p1",
      seat: 1,
      permissions: {
        act: true,
        chat: true,
        propose: false,
        useManualControls: false,
        concede: true,
        spectate: false,
        viewReplay: true,
        downloadReplay: false,
        forkReplay: false,
      },
    },
    preparation: {
      object: "game_pregame",
      kind: "fab",
      matchId: "m1",
      gameId: "g1",
      status: "waiting",
      playerId: "p1",
      deadlineAt: new Date(Date.now() + 60_000).toISOString(),
      turnOrder: { stage: "chosen", chooserId: "p1", firstPlayerId: "p1", source: "player" },
      pool: {
        format: "silverAge",
        heroId: hero.canonicalId,
        entries: [],
        cardDefinitions: { [hero.canonicalId]: hero },
      },
      selection: { deck: [], equipment: {} },
      locked: false,
      opponentReady: false,
      player: { playerId: "p1", label: "You" },
      opponent: { playerId: "p2", label: "Opponent" },
    },
  });
  if (session.phase !== "preparation") throw new Error("Expected preparation");
  const page = () => (
    <MantineProvider>
      <FabPresentationCatalogProvider>
        <FabPreparationPage session={session} />
      </FabPresentationCatalogProvider>
    </MantineProvider>
  );
  const { rerender } = render(page());
  expect(screen.getByRole("heading", { name: "Starting deck" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Refresh match" })).toBeNull();

  recovery.error = "Could not refresh the match.";
  rerender(page());
  expect(screen.getByRole("alert").textContent).toBe(recovery.error);
  fireEvent.click(screen.getByRole("button", { name: "Refresh match" }));
  expect(recovery.refresh).toHaveBeenCalledOnce();

  recovery.error = null;
  rerender(page());
  expect(screen.queryByRole("button", { name: "Refresh match" })).toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();

  const waitingSession = MatchSessionSchema.parse({
    ...session,
    preparation: {
      ...session.preparation,
      turnOrder: { stage: "choosing", chooserId: "p2" },
    },
  });
  if (waitingSession.phase !== "preparation") throw new Error("Expected preparation");
  rerender(
    <MantineProvider>
      <FabPresentationCatalogProvider>
        <FabPreparationPage session={waitingSession} />
      </FabPresentationCatalogProvider>
    </MantineProvider>,
  );
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(screen.getByRole("status", { name: "Waiting for the first-player choice" })).toBeTruthy();
  expect(screen.getByTestId("fab-pregame-sideboard").hasAttribute("inert")).toBe(false);
  expect((screen.getByRole("button", { name: "Reset" }) as HTMLButtonElement).disabled).toBe(false);
});
