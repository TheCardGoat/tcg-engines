import type { CharacterCard } from "@tcg/lorcana";

export const mrArrowLegacysFirstMate: CharacterCard = {
  id: "1am",
  cardType: "character",
  name: "Mr. Arrow",
  version: "Legacy's First Mate",
  fullName: "Mr. Arrow - Legacy's First Mate",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 182,
  inkable: true,
  externalIds: {
    ravensburger: "a814e468ab73333f21ba1a0d58cb731f9dcf1521",
  },
  keywords: [
    {
      type: "Resist",
      value: 1,
    },
  ],
  abilities: [
    {
      id: "1am-1",
      text: "Resist +1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien"],
};
