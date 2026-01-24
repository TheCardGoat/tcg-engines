import type { CharacterCard } from "@tcg/lorcana-types";

export const stabbingtonBrotherWithoutAPatch: CharacterCard = {
  id: "103",
  cardType: "character",
  name: "Stabbington Brother",
  version: "Without a Patch",
  fullName: "Stabbington Brother - Without a Patch",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "007",
  text: "Rush (This character can challenge the turn they're played.) GET 'EM! Your other characters named Stabbington Brother gain Rush.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 125,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "81f21ee6476f7c8c81ebff1d297c52457d8fc8e4",
  },
  abilities: [
    {
      id: "103-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
      },
      text: "Rush GET 'EM! Your other characters named Stabbington Brother gain Rush.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
