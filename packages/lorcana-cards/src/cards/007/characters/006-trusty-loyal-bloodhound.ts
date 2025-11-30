import type { CharacterCard } from "@tcg/lorcana";

export const trustyLoyalBloodhound: CharacterCard = {
  id: "oyt",
  cardType: "character",
  name: "Trusty",
  version: "Loyal Bloodhound",
  fullName: "Trusty - Loyal Bloodhound",
  inkType: ["amber"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "006",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "59fb789b94c97942a564b6c0fd20a35b436b07c6",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "oyta1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
