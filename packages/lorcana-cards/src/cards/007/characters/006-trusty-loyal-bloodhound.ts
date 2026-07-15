import type { CharacterCard } from "@tcg/lorcana-types";

export const trustyLoyalBloodhound: CharacterCard = {
  abilities: [
    {
      id: "oyt-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 6,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "59fb789b94c97942a564b6c0fd20a35b436b07c6",
  },
  franchise: "Lady and the Tramp",
  fullName: "Trusty - Loyal Bloodhound",
  id: "oyt",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Trusty",
  set: "007",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Loyal Bloodhound",
  willpower: 2,
};
