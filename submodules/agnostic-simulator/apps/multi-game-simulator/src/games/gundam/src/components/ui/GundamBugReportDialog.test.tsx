// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

const { submitBugReport } = vi.hoisted(() => ({
  submitBugReport: vi.fn(async () => ({
    id: "bugrep-gundam-1",
    createdAt: "2026-08-13T12:00:00.000Z",
  })),
}));

vi.mock("../../../../../runtime/bugReportApi.ts", () => ({
  submitBugReport,
  buildBugTriageHref: (_gameSlug: string, reportId: string) =>
    `https://tcg.online/gundam/bug-triage/${reportId}`,
}));

import { GundamBugReportDialog } from "./GundamBugReportDialog.tsx";

afterEach(() => {
  cleanup();
  submitBugReport.mockClear();
});

describe("GundamBugReportDialog", () => {
  it("submits the player description with replay-identifying game context", async () => {
    const user = userEvent.setup();
    render(
      <GundamBugReportDialog
        open
        onOpenChange={() => {}}
        context={{
          gameSlug: "gundam",
          gameId: "game-1",
          matchId: "match-1",
          turn: 6,
          stateVersion: 27,
          playerCount: 2,
          platform: "desktop",
        }}
      />,
    );

    await user.type(
      screen.getByLabelText("Bug details"),
      "Gundam could not attack after being linked.",
    );
    await user.click(screen.getByRole("button", { name: "Submit report" }));

    await waitFor(() => expect(submitBugReport).toHaveBeenCalledOnce());
    expect(submitBugReport).toHaveBeenCalledWith({
      description: "Gundam could not attack after being linked.",
      source: "simulator",
      context: {
        gameSlug: "gundam",
        gameId: "game-1",
        matchId: "match-1",
        turn: 6,
        stateVersion: 27,
        playerCount: 2,
        platform: "desktop",
      },
    });
    expect(
      (await screen.findByRole("link", { name: "Open triage workspace" })).getAttribute("href"),
    ).toBe("https://tcg.online/gundam/bug-triage/bugrep-gundam-1");
  });
});
