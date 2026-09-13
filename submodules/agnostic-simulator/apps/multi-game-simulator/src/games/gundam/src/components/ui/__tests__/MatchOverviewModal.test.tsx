// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { MatchOverviewModal } from "../MatchOverviewModal.tsx";
import type { MatchResult, PlayerRecap } from "../MatchOverviewModal.tsx";

afterEach(cleanup);

/**
 * Minimal recap that satisfies the `PlayerRecap` shape — the modal
 * only reads a subset (name + stat fields) and renders defaults for
 * missing optional data. Values are arbitrary; the test is purely
 * about the footer buttons.
 */
function stubRecap(name: string): PlayerRecap {
  return {
    name,
    shields: 6,
    deck: 30,
    hand: 5,
    trash: 0,
    resourcesActive: 2,
    resourcesTotal: 3,
    unitsInPlay: 2,
    activeUnits: 1,
    restedUnits: 1,
    unitsDeployed: 3,
    basesDeployed: 1,
    commandsPlayed: 2,
    pilotsPaired: 1,
    attacks: 4,
    blocks: 1,
    moves: 0,
    effectsResolved: 3,
  };
}

function stubResult(): MatchResult {
  return {
    outcome: "victory",
    turn: 5,
    duration: "2:34",
    moves: 18,
    self: stubRecap("player_one"),
    opponent: stubRecap("player_two"),
  };
}

describe("MatchOverviewModal: footer wiring", () => {
  it("uses Gundam match terminology and statistics", () => {
    render(
      <MatchOverviewModal
        result={stubResult()}
        onClose={() => {}}
        onBackToMatchmaking={() => {}}
        onDownloadReplay={() => {}}
        onSaveReplay={() => {}}
        onSaveNotes={async () => ({ ok: true })}
        canSaveNotes
        onReportBug={() => {}}
        onShareFeedback={() => {}}
      />,
    );

    expect(screen.getAllByText("SHIELDS")).toHaveLength(2);
    expect(screen.getAllByText("UNIT / BASE DEPLOY")).toHaveLength(2);
    expect(screen.getAllByText("ATTACK / BLOCK")).toHaveLength(2);
    expect(screen.queryByText("LORE")).toBeNull();
    expect(screen.queryByText("QUESTS")).toBeNull();
    expect(screen.queryByText("CHALLENGES")).toBeNull();
    expect(screen.queryByRole("button", { name: /^rematch$/i })).toBeNull();
  });

  it("invokes onBackToMatchmaking when the back button is clicked", () => {
    const onBack = vi.fn();
    render(
      <MatchOverviewModal
        result={stubResult()}
        onClose={() => {}}
        onBackToMatchmaking={onBack}
        onDownloadReplay={() => {}}
        onSaveReplay={() => {}}
        onSaveNotes={async () => ({ ok: true })}
        canSaveNotes
        onReportBug={() => {}}
        onShareFeedback={() => {}}
      />,
    );

    const button = screen.getByRole("button", { name: /back to matchmaking/i });
    fireEvent.click(button);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders and invokes rematch only when the container supplies an exact recipe", () => {
    const onRematch = vi.fn();
    render(
      <MatchOverviewModal
        result={stubResult()}
        onClose={() => {}}
        onBackToMatchmaking={() => {}}
        onRematch={onRematch}
        onDownloadReplay={() => {}}
        onSaveReplay={() => {}}
        onSaveNotes={async () => ({ ok: true })}
        canSaveNotes
        onReportBug={() => {}}
        onShareFeedback={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /^rematch$/i }));
    expect(onRematch).toHaveBeenCalledTimes(1);
  });

  it("does not render when result is null", () => {
    const { container } = render(
      <MatchOverviewModal
        result={null}
        onClose={() => {}}
        onBackToMatchmaking={() => {}}
        onDownloadReplay={() => {}}
        onSaveReplay={() => {}}
        onSaveNotes={async () => ({ ok: true })}
        canSaveNotes
        onReportBug={() => {}}
        onShareFeedback={() => {}}
      />,
    );
    // Dialog is closed — no modal content should be visible.
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("saves private notes from the Notes tab", async () => {
    const onSaveNotes = vi.fn().mockResolvedValue({ ok: true });
    render(
      <MatchOverviewModal
        result={stubResult()}
        onClose={() => {}}
        onBackToMatchmaking={() => {}}
        onDownloadReplay={() => {}}
        onSaveReplay={() => {}}
        onSaveNotes={onSaveNotes}
        canSaveNotes
        onReportBug={() => {}}
        onShareFeedback={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /notes/i }));
    expect(screen.getByText("NOTES READY TO EDIT")).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Test match note" } });
    fireEvent.click(screen.getByRole("button", { name: /save notes/i }));

    await waitFor(() => expect(onSaveNotes).toHaveBeenCalledWith("Test match note"));
    expect(screen.getByText("NOTES SAVED")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /timeline/i }));
    fireEvent.click(screen.getByRole("button", { name: /notes/i }));

    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Test match note");
    expect(screen.getByText("NOTES SAVED")).toBeTruthy();
  });

  it("uses localized save errors", async () => {
    render(
      <MatchOverviewModal
        result={stubResult()}
        onClose={() => {}}
        onBackToMatchmaking={() => {}}
        onDownloadReplay={() => {}}
        onSaveReplay={() => {}}
        onSaveNotes={async () => ({ ok: false, error: "unauthenticated" })}
        canSaveNotes
        onReportBug={() => {}}
        onShareFeedback={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /notes/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Test match note" } });
    fireEvent.click(screen.getByRole("button", { name: /save notes/i }));

    expect(await screen.findByText("SIGN IN TO SAVE MATCH NOTES")).toBeTruthy();
  });
});
