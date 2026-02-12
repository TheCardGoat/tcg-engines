import type { CharacterCard } from "@tcg/lorcana-types";

export const wasabiAlwaysPrepared: CharacterCard = {
  abilities: [
    {
      id: "aik-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 158,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Inventor"],
  cost: 5,
  externalIds: {
    ravensburger: "25e61d810205cf763e55f3f76c58fe35a4785e2a",
  },
  franchise: "Big Hero 6",
  fullName: "Wasabi - Always Prepared",
  id: "aik",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  name: "Wasabi",
  set: "008",
  strength: 3,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Always Prepared",
  willpower: 5,
};
