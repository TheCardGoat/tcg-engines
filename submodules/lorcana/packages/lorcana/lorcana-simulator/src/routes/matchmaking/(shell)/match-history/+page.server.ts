import type { PageServerLoad } from "./$types";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { getServerApiOrigin } from "$lib/server/fetch-with-cf.js";
import { serverJsonOrNull } from "$lib/data/server/server-json.js";
import type {
  DeckRundownResponse,
  MatchListResponse,
  MilestonesResponse,
  MmrHistoryPoint,
  PlayingStreak,
  PlayerStats,
} from "$lib/features/match-history/types.js";
import {
  getDeckOptions,
  isValidDeckMask,
} from "$lib/features/match-history/deck-rundown-aggregate.js";

export const load: PageServerLoad = async ({ request }) => {
  const cookie = request.headers.get("cookie") ?? "";
  const authHeaders: Record<string, string> = cookie ? { cookie } : {};
  const apiOrigin = getServerApiOrigin(getApiOrigin());
  const base = `${apiOrigin}/v1/match-history/players/me`;

  const [stats, mmrHistory, playingStreak, milestones, matchListResult] = await Promise.all([
    serverJsonOrNull<PlayerStats>(`${base}/stats`, { headers: authHeaders }),
    serverJsonOrNull<MmrHistoryPoint[]>(`${base}/mmr-history`, { headers: authHeaders }),
    serverJsonOrNull<PlayingStreak>(`${base}/playing-streak`, { headers: authHeaders }),
    serverJsonOrNull<MilestonesResponse>(`${base}/milestones`, { headers: authHeaders }),
    serverJsonOrNull<MatchListResponse>(`${base}/matches?limit=20`, { headers: authHeaders }),
  ]);

  let deckRundown: DeckRundownResponse | null = null;
  if (matchListResult) {
    const opts = getDeckOptions(matchListResult.matches);
    const primary = opts.find((o) => isValidDeckMask(o.mask)) ?? null;
    if (primary) {
      const params = new URLSearchParams({ deckColorMask: String(primary.mask) });
      if (primary.deckListId) params.set("deckListId", primary.deckListId);
      deckRundown = await serverJsonOrNull<DeckRundownResponse>(`${base}/deck-rundown?${params}`, {
        headers: authHeaders,
      });
    }
  }

  return {
    stats,
    mmrHistory: mmrHistory ?? [],
    playingStreak,
    milestones: milestones ?? { milestones: [] },
    matchList: matchListResult ?? { matches: [], nextCursor: null },
    deckRundown,
  };
};
