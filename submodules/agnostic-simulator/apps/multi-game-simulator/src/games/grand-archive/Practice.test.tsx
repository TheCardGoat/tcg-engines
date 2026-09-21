// @vitest-environment jsdom
import {
  grandArchiveCards,
  savageSlash,
  spiritOfWind,
  spiritOfFire,
  libraryWitch,
} from "@tcg/grand-archive-cards";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveServerEngine } from "@tcg/grand-archive-server-adapter";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GrandArchivePracticePage } from "./Practice.page";
import { GrandArchiveSimulatorProviders } from "./App";
import {
  clearGrandArchivePracticeSession,
  persistGrandArchivePracticeSession,
} from "./practice-session";

// Completing pregame projects the full real-catalog legal action list. These
// flows include that work (and replay for undo), unlike component-only tests.
const FULL_ENGINE_INTERACTION_TIMEOUT = 60_000;

describe("Grand Archive Standard practice", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/grand-archive/simulator/practice");
    clearGrandArchivePracticeSession();
    vi.spyOn(Math, "random").mockReturnValue(0.25);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it(
    "steps a restored bot attack decision with distinct match and decision versions",
    async () => {
      const fixture = GrandArchiveTestEngine.startFixture({
        playerOne: { id: "p1", champion: spiritOfFire, zones: { field: [libraryWitch] } },
        playerTwo: {
          id: "p2",
          champion: spiritOfWind,
          zones: { hand: [savageSlash, libraryWitch, libraryWitch] },
        },
        firstPlayer: "playerTwo",
        definitions: grandArchiveCards,
      });
      const slash = fixture.player("p2").card(savageSlash);
      fixture
        .player("p2")
        .executeLegal(
          (candidate) =>
            candidate.command.move === "activate-card" &&
            candidate.command.cardId === slash.objectId,
          "activate attack",
        );
      for (let count = 0; count < 8 && !fixture.state.decision; count++) {
        const holder = fixture.state.opportunity?.holderId;
        if (!holder) throw new Error("Expected Opportunity");
        fixture.player(holder).pass();
      }
      expect(fixture.state.decision?.kind).toBe("declare-resolved-attack");
      const initialVersion = fixture.state.stateVersion;
      expect(fixture.state.decision!.stateVersion).toBeLessThan(initialVersion);
      const server = new GrandArchiveServerEngine(
        fixture.program,
        new GrandArchiveMatchRuntime(fixture.program, fixture.state),
      );
      expect(persistGrandArchivePracticeSession(server, "first-legal", "step")).toBe(true);
      const { container } = render(
        <GrandArchiveSimulatorProviders>
          <GrandArchivePracticePage />
        </GrandArchiveSimulatorProviders>,
      );
      fireEvent.click(screen.getByTestId("ga-practice-bot-next"));
      await waitFor(() => {
        const view = JSON.parse(container.querySelector("output")!.textContent!) as {
          stateVersion: number;
        };
        expect(view.stateVersion).toBeGreaterThan(initialVersion);
      });
      expect(screen.queryByText(/command payload is malformed|stale state version/i)).toBeNull();
    },
    FULL_ENGINE_INTERACTION_TIMEOUT,
  );

  it(
    "keeps the human projection private while stepping an authoritative bot move",
    () => {
      const { container } = render(
        <GrandArchiveSimulatorProviders>
          <GrandArchivePracticePage />
        </GrandArchiveSimulatorProviders>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
      fireEvent.click(screen.getByTestId("ga-practice-bot-pause"));
      const after = JSON.parse(container.querySelector("output")!.textContent!) as {
        stateVersion: number;
        selfId: string;
      };
      expect(after.stateVersion).toBeGreaterThan(0);
      expect(screen.queryByRole("button", { name: /complete pre-game actions/i })).toBeNull();
      expect(after.selfId).toBe("p1");
      expect(screen.getByRole("region", { name: "Your match status" }).textContent).toContain(
        "You",
      );
      fireEvent.click(screen.getByTestId("ga-practice-bot-next"));
      const stepped = JSON.parse(container.querySelector("output")!.textContent!) as {
        stateVersion: number;
        selfId: string;
      };
      expect(stepped.stateVersion).toBeGreaterThan(after.stateVersion);
      expect(stepped.selfId).toBe("p1");
    },
    FULL_ENGINE_INTERACTION_TIMEOUT,
  );

  it("pauses automation when the player takes over the opponent seat", () => {
    const { container } = render(
      <GrandArchiveSimulatorProviders>
        <GrandArchivePracticePage />
      </GrandArchiveSimulatorProviders>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
    fireEvent.click(screen.getByTestId("ga-practice-bot-pause"));
    fireEvent.click(screen.getByTestId("ga-practice-bot-take-control"));
    const controlled = JSON.parse(container.querySelector("output")!.textContent!) as {
      selfId: string;
    };
    expect(controlled.selfId).toBe("p2");
    expect(screen.getAllByText("Manual control").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Concede" }));
    expect(screen.getByRole("alertdialog", { name: "Concede this match?" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Concede match" }));
    const finished = JSON.parse(container.querySelector("output")!.textContent!) as {
      status: string;
      winnerIds: string[];
    };
    expect(finished.status).toBe("finished");
    expect(finished.winnerIds).toEqual(["p1"]);
    fireEvent.click(screen.getByRole("tab", { name: "Now" }));
    expect(screen.getAllByText(/Game over/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("dialog", { name: "Defeat" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Inspect board" }));
    expect(screen.queryByRole("dialog", { name: "Defeat" })).toBeNull();
  }, 15_000);

  it("keeps automation unavailable in play-both-sides mode", () => {
    window.history.replaceState(null, "", "/grand-archive/simulator/practice?mode=self");
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchivePracticePage />
      </GrandArchiveSimulatorProviders>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
    expect(screen.getByTestId("ga-practice-self-play-status").textContent).toContain(
      "seats switch automatically",
    );
    expect(screen.queryByTestId("ga-practice-bot-play")).toBeNull();
    expect(screen.queryByTestId("ga-practice-bot-next")).toBeNull();
    expect(screen.queryByTestId("ga-practice-bot-strategy")).toBeNull();
  }, 15_000);

  it(
    "undoes the bot response without stranding the player in empty pregame",
    () => {
      const { container } = render(
        <GrandArchiveSimulatorProviders>
          <GrandArchivePracticePage />
        </GrandArchiveSimulatorProviders>,
      );

      fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
      fireEvent.click(screen.getByTestId("ga-practice-bot-pause"));
      fireEvent.click(screen.getByTestId("ga-practice-bot-next"));
      fireEvent.click(screen.getByTestId("ga-practice-bot-play"));
      fireEvent.click(screen.getByRole("button", { name: "Undo last accepted move" }));

      const restored = JSON.parse(container.querySelector("output")!.textContent!) as {
        stateVersion: number;
      };
      expect(restored.stateVersion).toBe(1);
      expect(screen.queryByRole("button", { name: /complete pre-game actions/i })).toBeNull();
    },
    FULL_ENGINE_INTERACTION_TIMEOUT,
  );

  it("starts a fresh engine-validated matchup from the deck setup", () => {
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchivePracticePage />
      </GrandArchiveSimulatorProviders>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
    fireEvent.click(screen.getByRole("button", { name: "Opponent controls" }));
    const setupTrigger = screen.getByRole("button", { name: "New deck matchup" });
    setupTrigger.focus();
    fireEvent.click(setupTrigger);
    expect(screen.getByRole("dialog", { name: "New deck matchup" })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close deck setup" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "New deck matchup" })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Opponent controls" }));
    fireEvent.click(screen.getByRole("button", { name: "Opponent controls" }));
    fireEvent.click(screen.getByRole("button", { name: "New deck matchup" }));
    fireEvent.click(screen.getByRole("button", { name: "Start matchup" }));
    expect(screen.queryByRole("dialog", { name: "New deck matchup" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Review your starting decks" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
  }, 15_000);

  it("keeps local practice chat in the History dock and restores it with the session", async () => {
    const view = render(
      <GrandArchiveSimulatorProviders>
        <GrandArchivePracticePage />
      </GrandArchiveSimulatorProviders>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
    expect(screen.queryByRole("tab", { name: "Chat" })).toBeNull();
    const openChat = screen.getByRole("button", { name: "Open local practice chat" });
    fireEvent.click(openChat);
    const textbox = screen.getByRole("textbox", { name: "Local practice chat" });
    expect(document.activeElement).toBe(textbox);
    fireEvent.change(textbox, {
      target: { value: "Check the opening sequence" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send local practice message" }));
    expect(screen.getByText("Check the opening sequence")).toBeTruthy();

    fireEvent.keyDown(textbox, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("textbox", { name: "Local practice chat" })).toBeNull();
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Open local practice chat" }),
      );
    });

    fireEvent.click(screen.getByRole("tab", { name: "Now" }));
    fireEvent.click(screen.getByRole("tab", { name: "History" }));
    expect(screen.getByText("Check the opening sequence")).toBeTruthy();

    view.unmount();
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchivePracticePage />
      </GrandArchiveSimulatorProviders>,
    );
    expect(screen.getByText("Check the opening sequence")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Confirm selection" })).toBeNull();
  });
});

it("replays the saved starter matchup and strategy after a refresh", async () => {
  window.sessionStorage.clear();
  window.history.replaceState(
    null,
    "",
    "/grand-archive/simulator/practice?playerDeck=lorraine-pnp-1-4&opponentDeck=rai-pnp-1-4&strategy=value-extract",
  );
  const first = render(
    <GrandArchiveSimulatorProviders>
      <GrandArchivePracticePage />
    </GrandArchiveSimulatorProviders>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
  expect(window.location.search).toBe("");
  first.unmount();
  render(
    <GrandArchiveSimulatorProviders>
      <GrandArchivePracticePage />
    </GrandArchiveSimulatorProviders>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Concede" }));
  fireEvent.click(screen.getByRole("button", { name: "Concede match" }));
  fireEvent.click(screen.getByRole("button", { name: "Play again" }));
  expect(screen.getByRole("heading", { name: "Review your starting decks" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
  const { restoreGrandArchivePracticeSession } = await import("./practice-session");
  const { practiceSetupFromSearch } = await import("./practice-setup");
  const { practicePreparationPool, restartPracticePreparation } =
    await import("./practice-preparation");
  const original = practiceSetupFromSearch(
    "?playerDeck=lorraine-pnp-1-4&opponentDeck=rai-pnp-1-4&strategy=value-extract",
  )!;
  const restored = restoreGrandArchivePracticeSession(() => original.server);
  expect(restored.kind).toBe("restored");
  if (restored.kind !== "restored") throw new Error("Missing restarted practice");
  expect(restored.strategyId).toBe("value-extract");
  for (const id of ["p1", "p2"])
    expect(
      practicePreparationPool(restartPracticePreparation(restored.server), id).registered,
    ).toEqual(practicePreparationPool(original.server, id).registered);
  cleanup();
  window.sessionStorage.clear();
  window.history.replaceState(null, "", "/grand-archive/simulator/practice");
}, 60_000);
