import type { CharacterCard } from "@tcg/lorcana";

export const wasabiAlwaysPrepared: CharacterCard = {
  id: "aik",
  cardType: "character",
  name: "Wasabi",
  version: "Always Prepared",
  fullName: "Wasabi - Always Prepared",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "008",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "158",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "25e61d810205cf763e55f3f76c58fe35a4785e2a",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "aik-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
};
