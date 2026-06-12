import { beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("$lib/config/public-url-config.js", () => ({
  getApiOrigin: () => "https://api.example.test",
}));

const { fetchMetaInsightsSnapshot } = await import("./meta-insights-api.js");

describe("meta-insights-api", () => {
  beforeEach(() => {
    globalThis.fetch = mock(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/v1/meta/lorcana/periods")) {
        return jsonResponse({
          object: "list",
          data: [
            {
              id: "2026-W20",
              periodType: "week",
              startDate: "2026-05-11",
              endDate: "2026-05-17",
              label: "Week 20",
              isClosed: true,
            },
          ],
        });
      }

      if (url.includes("/activity")) {
        return jsonResponse({
          object: "meta.activity",
          period: {
            id: "2026-W20",
            periodType: "week",
            startDate: "2026-05-11",
            endDate: "2026-05-17",
            label: "Week 20",
            isClosed: true,
          },
          totalGames: 12,
          totalMatches: 6,
          distinctPlayers: 4,
          avgTurns: null,
          avgDurationSec: null,
          winRateOtp: null,
          winRateOtd: null,
          gamesOtp: 0,
          gamesOtd: 0,
          gamesPerDay: [],
          avgGamesPerDay: null,
        });
      }

      if (url.includes("/color-pairs/matchups")) {
        return jsonResponse({
          object: "meta.color_pair_matchups",
          period: null,
          colorPairs: [],
          cells: [],
        });
      }

      if (url.includes("/color-pairs")) {
        return jsonResponse({
          object: "meta.color_pairs",
          period: null,
          data: [],
          totalGames: 0,
        });
      }

      if (url.includes("/peak-hours")) {
        return jsonResponse({
          object: "meta.peak_hours",
          period: null,
          buckets: [{ hourUtc: 13, games: 5 }],
        });
      }

      return new Response("not found", { status: 404 });
    }) as unknown as typeof fetch;
  });

  it("requests the selected segment and skips extended endpoints for compact panels", async () => {
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof mock>;

    const result = await fetchMetaInsightsSnapshot({
      periodId: "2026-W20",
      formatId: "infinity",
      bestOf: "1",
      matchupMinGames: 50,
      includeExtended: false,
    });

    expect(result.periods).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.example.test/v1/meta/lorcana/activity?periodId=2026-W20&formatId=infinity&bestOf=1&eventId=*&bracketId=all",
      { credentials: "include" },
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "https://api.example.test/v1/meta/lorcana/color-pairs?periodId=2026-W20&formatId=infinity&bestOf=1&eventId=*&bracketId=all",
      { credentials: "include" },
    );
  });

  it("omits bestOf for all queues and includes extended meta requests for full panels", async () => {
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof mock>;

    await fetchMetaInsightsSnapshot({
      periodId: "all",
      formatId: "*",
      bestOf: "all",
      matchupMinGames: 25,
      includeExtended: true,
    });

    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      "https://api.example.test/v1/meta/lorcana/peak-hours?periodId=all&formatId=*&eventId=*&bracketId=all",
      { credentials: "include" },
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      5,
      "https://api.example.test/v1/meta/lorcana/color-pairs/matchups?periodId=all&formatId=*&eventId=*&bracketId=all&minGames=25",
      { credentials: "include" },
    );
  });
});

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    headers: { "content-type": "application/json" },
  });
}
