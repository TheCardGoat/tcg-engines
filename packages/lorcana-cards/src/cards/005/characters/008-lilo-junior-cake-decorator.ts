import type { CharacterCard } from "@tcg/lorcana-types";

export const liloJuniorCakeDecorator: CharacterCard = {
  abilities: [
    {
      id: "183-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 8,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "9f1e57fa50cfe2c903d722580bbf99ab2cb544aa",
  },
  franchise: "Lilo and Stitch",
  fullName: "Lilo - Junior Cake Decorator",
  id: "183",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Lilo",
  set: "005",
  strength: 1,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Junior Cake Decorator",
  willpower: 3,
};
