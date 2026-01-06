import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarLampThief: CharacterCard = {
  id: "eye",
  cardType: "character",
  name: "Jafar",
  version: "Lamp Thief",
  fullName: "Jafar - Lamp Thief",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "009",
  text: "I AM YOUR MASTER NOW When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 59,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "35e65e00328e23cb522209e460c94442dcdfae23",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
