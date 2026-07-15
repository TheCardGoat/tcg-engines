// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

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
    lore: 0,
    deck: 30,
    hand: 5,
    discard: 0,
    resourcesUsed: 0,
    resourcesTotal: 3,
    boardCount: 0,
    ready: 0,
    exerted: 0,
    played: 0,
    resourcesPlaced: 0,
    quests: 0,
    challenges: 0,
    moves: 0,
    abilities: 0,
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
  it("invokes onBackToMatchmaking when the back button is clicked", () => {
    const onBack = vi.fn();
    render(
      <MatchOverviewModal
        result={stubResult()}
        onClose={() => {}}
        onBackToMatchmaking={onBack}
        onDownloadReplay={() => {}}
        onSaveReplay={() => {}}
        onReportBug={() => {}}
        onShareFeedback={() => {}}
      />,
    );

    const button = screen.getByRole("button", { name: /back to matchmaking/i });
    fireEvent.click(button);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("does not render when result is null", () => {
    const { container } = render(
      <MatchOverviewModal
        result={null}
        onClose={() => {}}
        onBackToMatchmaking={() => {}}
        onDownloadReplay={() => {}}
        onSaveReplay={() => {}}
        onReportBug={() => {}}
        onShareFeedback={() => {}}
      />,
    );
    // Dialog is closed — no modal content should be visible.
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
});
