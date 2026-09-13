// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

const { submitBugReport } = vi.hoisted(() => ({
  submitBugReport: vi.fn(async () => ({
    id: "bugrep-1",
    createdAt: "2026-08-13T12:00:00.000Z",
  })),
}));

vi.mock("./bugReportApi.ts", () => ({
  submitBugReport,
  buildBugTriageHref: (gameSlug: string, reportId: string) =>
    `https://tcg.online/${gameSlug}/bug-triage/${reportId}`,
}));

import { BugReportDialog } from "./BugReportDialog.tsx";

afterEach(() => {
  cleanup();
  submitBugReport.mockClear();
});

describe("BugReportDialog", () => {
  it("submits exact game and replay context and exposes the triage workspace", async () => {
    const user = userEvent.setup();
    render(
      <BugReportDialog
        open
        onOpenChange={() => {}}
        gameName="One Piece"
        source="one-piece-practice"
        context={{ gameSlug: "one-piece", turn: 3, stateVersion: 12, playerCount: 2 }}
      />,
    );

    const dialog = screen.getByRole("dialog");
    const describedBy = dialog.getAttribute("aria-describedby");
    expect(describedBy).not.toBeNull();
    expect(document.getElementById(describedBy ?? "")?.textContent).toContain(
      "The current game, turn, and replay position are attached automatically",
    );
    expect(document.activeElement).toBe(screen.getByLabelText("Bug details"));

    await user.type(screen.getByLabelText("Bug details"), "The Counter action was unavailable.");
    await user.click(screen.getByRole("button", { name: "Submit report" }));

    await waitFor(() => expect(submitBugReport).toHaveBeenCalledOnce());
    expect(submitBugReport).toHaveBeenCalledWith({
      description: "The Counter action was unavailable.",
      source: "one-piece-practice",
      context: { gameSlug: "one-piece", turn: 3, stateVersion: 12, playerCount: 2 },
    });
    expect(screen.getByRole("link", { name: "Open triage workspace" }).getAttribute("href")).toBe(
      "https://tcg.online/one-piece/bug-triage/bugrep-1",
    );
  });
});
