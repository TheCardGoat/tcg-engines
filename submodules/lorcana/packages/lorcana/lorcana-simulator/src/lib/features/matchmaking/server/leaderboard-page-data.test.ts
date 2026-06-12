import { describe, expect, it } from "bun:test";
import {
  loadLeaderboardPageData,
  type CasualLeaderboardResponse,
  type CompetitiveLeaderboardResponse,
  type LeaderboardJsonFetcher,
  type MatchmakingContextFetcher,
} from "./leaderboard-page-data";

const API_ORIGIN = "https://api.example.test";
const NOW = new Date("2026-05-27T12:00:00Z");

describe("loadLeaderboardPageData", () => {
  it("defaults to the active infinity ranked board", async () => {
    const seenUrls: string[] = [];
    const fetchJson = leaderboardFetcher(seenUrls);

    const data = await loadLeaderboardPageData({
      url: new URL("https://sim.example.test/matchmaking/leaderboard"),
      apiOrigin: API_ORIGIN,
      now: NOW,
      fetchJson,
      fetchMatchmakingContext: forbiddenContextFetcher,
    });

    expect(data.tab).toBe("competitive");
    expect(data.formatId).toBe("infinity");
    expect(data.month).toBe("2026-05");
    expect(seenUrls).toHaveLength(3);
    expect(seenUrls[0]).toContain("/v1/leaderboards/lorcana/page/competitive?");
    expect(seenUrls[0]).toContain("formatId=infinity");
    expect(seenUrls[1]).toContain("formatId=core-constructed");
    expect(seenUrls[2]).toContain("/v1/leaderboards/lorcana/page/casual?");
    expect(seenUrls[2]).toContain("month=2026-05");
  });

  it("respects an explicit casual tab", async () => {
    const seenUrls: string[] = [];

    const data = await loadLeaderboardPageData({
      url: new URL("https://sim.example.test/matchmaking/leaderboard?tab=casual"),
      apiOrigin: API_ORIGIN,
      now: NOW,
      fetchJson: leaderboardFetcher(seenUrls),
      fetchMatchmakingContext: forbiddenContextFetcher,
    });

    expect(data.tab).toBe("casual");
    expect(seenUrls).toHaveLength(2);
    expect(seenUrls[0]).toContain("formatId=infinity");
    expect(seenUrls[1]).toContain("/v1/leaderboards/lorcana/page/casual?");
  });

  it("respects an explicit core constructed ranked format", async () => {
    const seenUrls: string[] = [];

    const data = await loadLeaderboardPageData({
      url: new URL("https://sim.example.test/matchmaking/leaderboard?formatId=core-constructed"),
      apiOrigin: API_ORIGIN,
      now: NOW,
      fetchJson: leaderboardFetcher(seenUrls),
      fetchMatchmakingContext: forbiddenContextFetcher,
    });

    expect(data.tab).toBe("competitive");
    expect(data.formatId).toBe("core-constructed");
    expect(seenUrls[0]).toContain("formatId=core-constructed");
  });

  it("forwards region to ranked and casual requests", async () => {
    const seenUrls: string[] = [];

    const data = await loadLeaderboardPageData({
      url: new URL("https://sim.example.test/matchmaking/leaderboard?region=EU"),
      apiOrigin: API_ORIGIN,
      now: NOW,
      fetchJson: leaderboardFetcher(seenUrls),
      fetchMatchmakingContext: forbiddenContextFetcher,
    });

    expect(data.region).toBe("EU");
    expect(seenUrls).toHaveLength(3);
    expect(
      seenUrls.every((requestUrl) => new URL(requestUrl).searchParams.get("region") === "EU"),
    ).toBeTrue();
  });

  it("forwards the active game profile id when an authenticated context is available", async () => {
    const seenUrls: string[] = [];
    const seenCookies: Array<string | null> = [];
    const fetchMatchmakingContext: MatchmakingContextFetcher = async (init) => {
      seenCookies.push(
        init?.headers instanceof Headers ? init.headers.get("cookie") : "session=abc",
      );
      return { activeGameProfileId: "gp_active" } as Awaited<ReturnType<MatchmakingContextFetcher>>;
    };

    await loadLeaderboardPageData({
      url: new URL("https://sim.example.test/matchmaking/leaderboard?tab=casual"),
      apiOrigin: API_ORIGIN,
      now: NOW,
      cookie: "session=abc",
      fetchJson: leaderboardFetcher(seenUrls),
      fetchMatchmakingContext,
    });

    expect(seenCookies).toEqual(["session=abc"]);
    expect(
      seenUrls.every(
        (requestUrl) => new URL(requestUrl).searchParams.get("gameProfileId") === "gp_active",
      ),
    ).toBeTrue();
  });

  it("renders graceful public data when unauthenticated requests fail", async () => {
    const seenUrls: string[] = [];
    let contextCalls = 0;

    const data = await loadLeaderboardPageData({
      url: new URL("https://sim.example.test/matchmaking/leaderboard?tab=casual"),
      apiOrigin: API_ORIGIN,
      now: NOW,
      fetchJson: async (requestUrl) => {
        seenUrls.push(requestUrl);
        return { data: null, error: { url: requestUrl, message: "offline" } };
      },
      fetchMatchmakingContext: async () => {
        contextCalls += 1;
        throw new Error("should not fetch public context");
      },
    });

    expect(contextCalls).toBe(0);
    expect(seenUrls).toHaveLength(2);
    expect(data.tab).toBe("casual");
    expect(data.competitive).toBeNull();
    expect(data.casual).toBeNull();
    expect(data.errors).toHaveLength(2);
    expect(data.errors.every((error) => error.message === "offline")).toBeTrue();
  });
});

function leaderboardFetcher(seenUrls: string[]): LeaderboardJsonFetcher {
  return async <T>(requestUrl: string) => {
    seenUrls.push(requestUrl);
    const url = new URL(requestUrl);
    const isCasual = url.pathname.endsWith("/casual");
    if (isCasual) {
      return { data: casualBoard(url.searchParams.get("region")) as T };
    }

    const formatId = url.searchParams.get("formatId") ?? "infinity";
    return { data: competitiveBoard(formatId, url.searchParams.get("region")) as T };
  };
}

function competitiveBoard(formatId: string, region: string | null): CompetitiveLeaderboardResponse {
  const gamesPlayed = formatId === "infinity" ? 40 : 12;
  return {
    type: "competitive",
    formatId,
    region,
    seasonId: "season_2026_05",
    total: formatId === "infinity" ? 12 : 4,
    currentUser: null,
    entries: [
      {
        rank: 1,
        gameProfileId: `gp_${formatId}`,
        displayName: "Ariel",
        region,
        mmr: formatId === "infinity" ? 1510 : 1302,
        gamesPlayed,
        gamesWon: Math.floor(gamesPlayed * 0.7),
        losses: Math.ceil(gamesPlayed * 0.3),
        winStreak: 3,
        bracket: "platinum",
      },
    ],
  };
}

function casualBoard(region: string | null): CasualLeaderboardResponse {
  return {
    type: "casual",
    month: "2026-05",
    region,
    total: 8,
    currentUser: null,
    entries: [
      {
        rank: 1,
        gameProfileId: "gp_casual",
        displayName: "Mulan",
        region,
        goatScore: 88.5,
        badges: ["hot-streak"],
        gamesPlayedMonth: 18,
        activeDaysMonth: 7,
        currentStreak: 4,
      },
    ],
  };
}

const forbiddenContextFetcher: MatchmakingContextFetcher = async () => {
  throw new Error("unexpected matchmaking context fetch");
};
