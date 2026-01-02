import type { CharacterCard } from "@tcg/lorcana-types";

export const liloJuniorCakeDecorator: CharacterCard = {
  id: "183",
  cardType: "character",
  name: "Lilo",
  version: "Junior Cake Decorator",
  fullName: "Lilo - Junior Cake Decorator",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "005",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 8,
  inkable: true,
  externalIds: {
    ravensburger: "9f1e57fa50cfe2c903d722580bbf99ab2cb544aa",
  },
  abilities: [
    {
      id: "183-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
