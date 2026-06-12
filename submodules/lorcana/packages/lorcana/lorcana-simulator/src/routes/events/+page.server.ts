import type { PageServerLoad } from "./$types";
import { z } from "zod";
import { DEFAULT_OG_IMAGE } from "$lib/config/site";
import { getServerApiUrl } from "$lib/config/api.server";
import { getPublicOrigin } from "$lib/server/site";
import { serverFetch } from "$lib/server/fetch-with-cf";

const WinnerSchema = z.object({
  outcomeId: z.string(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  awardedAt: z.string(),
});

const PrizeSchema = z.object({
  rewardId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  type: z.enum(["giveaway_draw", "catalog_redemption", "manual_grant"]),
  winnerCount: z.number().int().min(1).default(1),
  winners: z.array(WinnerSchema).default([]),
});

const EventSchema = z.object({
  eventId: z.string(),
  gameSlug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  rewardType: z.enum(["giveaway_draw", "catalog_redemption", "manual_grant"]),
  featured: z.boolean(),
  rulesUrl: z.string().nullable(),
  startsAt: z.string(),
  endsAt: z.string(),
  participants: z.number(),
  prizes: z.array(PrizeSchema),
});

const ResponseSchema = z.object({
  events: z.array(EventSchema),
});

export type PublicEngagementEvent = z.infer<typeof EventSchema>;

async function loadEvents(): Promise<PublicEngagementEvent[]> {
  try {
    const response = await serverFetch(getServerApiUrl("/engagement/events/history?limit=100"));
    if (!response.ok) return [];
    const parsed = ResponseSchema.safeParse(await response.json());
    return parsed.success ? parsed.data.events : [];
  } catch {
    return [];
  }
}

export const load: PageServerLoad = async ({ url }) => {
  const origin = getPublicOrigin(url);
  const events = await loadEvents();

  const totalPrizes = events.reduce((sum, event) => sum + event.prizes.length, 0);
  const totalWinners = events.reduce(
    (sum, event) =>
      sum + event.prizes.reduce((prizeSum, prize) => prizeSum + prize.winners.length, 0),
    0,
  );
  const totalParticipants = events.reduce((sum, event) => sum + event.participants, 0);

  return {
    events,
    stats: {
      totalEvents: events.length,
      totalPrizes,
      totalWinners,
      totalParticipants,
    },
    seo: {
      title: "Events & Giveaways | The Card Goat Online",
      description:
        "See every community event we have run, the prizes we gave away, and the players who won. The Card Goat Online is proud to give back to the TCG community.",
      canonicalUrl: `${origin}/matchmaking/events`,
      ogImage: `${origin}${DEFAULT_OG_IMAGE}`,
    },
  };
};
