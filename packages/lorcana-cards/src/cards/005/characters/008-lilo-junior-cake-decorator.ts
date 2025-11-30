import type { CharacterCard } from "@tcg/lorcana";

export const liloJuniorCakeDecorator: CharacterCard = {
  id: "183",
  cardType: "character",
  name: "Lilo",
  version: "Junior Cake Decorator",
  fullName: "Lilo - Junior Cake Decorator",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "005",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "008",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "9f1e57fa50cfe2c903d722580bbf99ab2cb544aa",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "183a1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
