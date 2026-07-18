import type { PageServerLoad } from "./$types";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { serverJsonOrNull } from "$lib/data/server/server-json.js";
import { listHistoricSeasons } from "$lib/features/matchmaking/content/historic-seasons.js";
import { getServerApiOrigin } from "$lib/server/fetch-with-cf.js";

type RankSeason = {
  seasonId: string;
  name: string;
  slug: string;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  isPrimary: boolean;
};

export const load: PageServerLoad = async () => {
  const apiOrigin = getServerApiOrigin(getApiOrigin());
  const apiSeasons =
    (await serverJsonOrNull<RankSeason[]>(`${apiOrigin}/v1/rank-seasons/lorcana/ladder`)) ?? [];
  const historicSeasons = listHistoricSeasons();
  const apiSlugs = new Set(apiSeasons.map((season) => season.slug));

  return {
    seasons: [
      ...apiSeasons,
      ...historicSeasons.filter((season) => !apiSlugs.has(season.slug)),
    ].sort((left, right) => new Date(right.startsAt).getTime() - new Date(left.startsAt).getTime()),
  };
};
