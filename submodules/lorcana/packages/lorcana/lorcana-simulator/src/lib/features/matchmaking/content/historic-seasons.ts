export type HistoricSeason = Readonly<{
  seasonId: string;
  name: string;
  slug: string;
  startsAt: string;
  endsAt: string | null;
  contentJson: Record<string, unknown>;
  isActive: boolean;
  isPrimary: boolean;
}>;

const WILDS_UNKNOWN: HistoricSeason = {
  seasonId: "historic-wilds-unknown",
  name: "Wilds Unknown",
  slug: "wilds-unknown",
  startsAt: "2026-05-18T00:00:00.000Z",
  endsAt: "2026-07-13T00:00:00.000Z",
  contentJson: {
    summary:
      "A ranked season for Core Constructed and Infinity, with prizes for the top ladders and a monthly champion event.",
    timeline: [
      {
        date: "May 18, 2026",
        label: "Season opens",
        detail: "Ranked ladders begin for Core Constructed and Infinity.",
      },
      {
        date: "May 31, 2026",
        label: "May champion snapshot",
        detail: "Top players in each category are selected for the monthly champion event.",
      },
      {
        date: "June 30, 2026",
        label: "June champion snapshot",
        detail: "A second monthly field is built from the top players in each category.",
      },
      {
        date: "July 12, 2026",
        label: "Season closes",
        detail: "Final ranked placements are locked and season prizes are assigned.",
      },
    ],
    prizeStructure: [
      {
        format: "Best of 1",
        prizes: [
          { place: "1st place", reward: "1 Wilds Unknown booster box" },
          { place: "2nd and 3rd place", reward: "1 Illumineer's Trove each" },
        ],
      },
      {
        format: "Best of 3",
        prizes: [
          { place: "1st place", reward: "1 booster box and 1 Illumineer's Trove" },
          { place: "2nd place", reward: "1 booster box" },
          { place: "3rd place", reward: "1 Illumineer's Trove" },
        ],
      },
    ],
  },
  isActive: false,
  isPrimary: false,
};

export function getHistoricSeason(seasonSlug: string): HistoricSeason | null {
  return seasonSlug === WILDS_UNKNOWN.slug ? WILDS_UNKNOWN : null;
}

export function listHistoricSeasons(): readonly HistoricSeason[] {
  return [WILDS_UNKNOWN];
}
