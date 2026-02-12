import type { CharacterCard } from "@tcg/lorcana-types";

export const noiOrphanedThief: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
      id: "r47-1",
      text: "HIDE AND SEEK While you have an item in play, this character gains Resist +1 and Ward.",
      type: "action",
    },
  ],
  cardNumber: 155,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "61bb59a811e9dbf0e06cdf338286eebc8a42ccc6",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Noi - Orphaned Thief",
  id: "r47",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Noi",
  set: "002",
  strength: 1,
  text: "HIDE AND SEEK While you have an item in play, this character gains Resist +1 and Ward. (Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)",
  version: "Orphaned Thief",
  willpower: 2,
};
