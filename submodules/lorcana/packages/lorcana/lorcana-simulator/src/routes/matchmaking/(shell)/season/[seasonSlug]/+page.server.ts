import { error, redirect } from "@sveltejs/kit";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { serverJsonOrNull } from "$lib/data/server/server-json.js";
import { getHistoricSeason } from "$lib/features/matchmaking/content/historic-seasons.js";
import { getServerApiOrigin } from "$lib/server/fetch-with-cf.js";
import type { PageServerLoad } from "./$types";

type RankSeason = {
  seasonId: string;
  name: string;
  slug: string;
  startsAt: string;
  endsAt: string | null;
  contentJson: Record<string, unknown>;
  isActive: boolean;
  isPrimary: boolean;
};

export const load: PageServerLoad = async ({ params }) => {
  const historicSeason = getHistoricSeason(params.seasonSlug);
  if (historicSeason) return { season: historicSeason };

  const apiOrigin = getServerApiOrigin(getApiOrigin());
  const season = await serverJsonOrNull<RankSeason>(
    `${apiOrigin}/v1/rank-seasons/lorcana/ladder/${encodeURIComponent(params.seasonSlug)}`,
  );
  if (!season) error(404, "Season not found");

  if (params.seasonSlug === "current" && season.slug !== "current") {
    redirect(302, `/matchmaking/season/${season.slug}`);
  }

  return { season };
};
