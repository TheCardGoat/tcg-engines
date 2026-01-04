import type { CharacterCard } from "@tcg/lorcana-types";

export const wasabiAlwaysPrepared: CharacterCard = {
  id: "aik",
  cardType: "character",
  name: "Wasabi",
  version: "Always Prepared",
  fullName: "Wasabi - Always Prepared",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "008",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 158,
  inkable: true,
  externalIds: {
    ravensburger: "25e61d810205cf763e55f3f76c58fe35a4785e2a",
  },
  abilities: [
    {
      id: "aik-1",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
};
