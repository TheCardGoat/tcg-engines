import type { CanonicalCard } from "../../types";

export const theQueenRegalMonarch: CanonicalCard = {
  id: "1tz",
  name: "The Queen",
  version: "Regal Monarch",
  fullName: "The Queen - Regal Monarch",
  cardType: "character",
  inkType: "amber",
  franchise: "Snow White",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "edc8d296f601e44b6311621379644a538907c472",
    cultureInvariantId: 1943,
  },
  classifications: ["Storyborn", "Villain", "Queen"],
  printings: [
    {
      set: "set9",
      collectorNumber: 7,
      id: "set9-007",
    },
    {
      set: "set2",
      collectorNumber: 27,
      id: "set2-027",
    },
  ],
};
