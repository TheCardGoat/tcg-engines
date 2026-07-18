export type SeasonStanding = Readonly<{
  place: 1 | 2 | 3;
  playerName: string;
  tier: "silver" | "platinum" | "diamond";
}>;

export type SeasonFormatResults = Readonly<{
  formatName: string;
  standings: readonly SeasonStanding[];
}>;

export type SeasonResults = Readonly<{
  formats: readonly SeasonFormatResults[];
}>;

const WILDS_UNKNOWN_RESULTS: SeasonResults = {
  formats: [
    {
      formatName: "Infinity",
      standings: [
        {
          place: 1,
          playerName: "Trusty Ham Hands",
          tier: "platinum",
        },
        {
          place: 2,
          playerName: "urbaro",
          tier: "platinum",
        },
        {
          place: 3,
          playerName: "Arashinbo",
          tier: "silver",
        },
      ],
    },
    {
      formatName: "Core Constructed",
      standings: [
        {
          place: 1,
          playerName: "Donald Duck In The Moment",
          tier: "diamond",
        },
        {
          place: 2,
          playerName: "Maldah",
          tier: "diamond",
        },
        {
          place: 3,
          playerName: "Trusty Ham Hands",
          tier: "diamond",
        },
      ],
    },
  ],
};

export function getSeasonResults(seasonSlug: string): SeasonResults | null {
  return seasonSlug === "wilds-unknown" ? WILDS_UNKNOWN_RESULTS : null;
}
