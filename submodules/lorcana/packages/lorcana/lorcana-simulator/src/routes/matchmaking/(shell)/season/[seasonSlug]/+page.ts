import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

// Matches the canonical season slug used by the backend `rank_seasons` row.
// The current row has slug `2026-WUN-RANKED`; the legacy `wilds-unknown`
// alias is kept so old links keep working until end of season.
const ALLOWED_SEASON_SLUGS = new Set(["2026-WUN-RANKED", "wilds-unknown"]);

export const load: PageLoad = ({ params }) => {
  if (!ALLOWED_SEASON_SLUGS.has(params.seasonSlug)) {
    error(404, "Season not found");
  }
};
