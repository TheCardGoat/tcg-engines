import { describe, expect, it, vi } from "vite-plus/test";

import { buildBugReportContext, submitBugReport } from "./bugReportApi.ts";

describe("bug report API", () => {
  it("preserves distinct turn, state-version, and replay-cursor evidence", () => {
    expect(
      buildBugReportContext({
        gameSlug: "gundam",
        gameId: "game-1",
        matchId: "match-1",
        playerCount: 2,
        turn: 7,
        stateVersion: 42,
        replayCursor: 39,
        platform: "desktop",
      }),
    ).toEqual({
      gameSlug: "gundam",
      gameId: "game-1",
      matchId: "match-1",
      playerCount: 2,
      turn: 7,
      stateVersion: 42,
      replayCursor: 39,
      platform: "desktop",
    });
  });

  it("submits replay-identifying Gundam context to the shared feedback endpoint", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(JSON.stringify({ id: "bugrep-1", createdAt: "2026-08-13T12:00:00.000Z" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );

    await expect(
      submitBugReport(
        {
          description: "A unit could not attack.",
          source: "simulator",
          context: {
            gameSlug: "gundam",
            gameId: "game-1",
            matchId: "match-1",
            turn: 4,
            stateVersion: 18,
          },
        },
        fetcher,
      ),
    ).resolves.toEqual({ id: "bugrep-1", createdAt: "2026-08-13T12:00:00.000Z" });

    expect(fetcher).toHaveBeenCalledOnce();
    const [url, request] = fetcher.mock.calls[0]!;
    expect(url).toBe("https://api.tcg.online/v1/feedback/bug-reports");
    expect(JSON.parse(String(request?.body))).toEqual({
      description: "A unit could not attack.",
      source: "simulator",
      context: {
        gameSlug: "gundam",
        gameId: "game-1",
        matchId: "match-1",
        turn: 4,
        stateVersion: 18,
      },
    });
  });
});
