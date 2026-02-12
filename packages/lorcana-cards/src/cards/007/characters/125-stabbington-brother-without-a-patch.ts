import type { CharacterCard } from "@tcg/lorcana-types";

export const stabbingtonBrotherWithoutAPatch: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "103-1",
      text: "Rush GET 'EM! Your other characters named Stabbington Brother gain Rush.",
      type: "action",
    },
  ],
  cardNumber: 125,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "81f21ee6476f7c8c81ebff1d297c52457d8fc8e4",
  },
  franchise: "Tangled",
  fullName: "Stabbington Brother - Without a Patch",
  id: "103",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Stabbington Brother",
  set: "007",
  strength: 3,
  text: "Rush (This character can challenge the turn they're played.) GET 'EM! Your other characters named Stabbington Brother gain Rush.",
  version: "Without a Patch",
  willpower: 4,
};
