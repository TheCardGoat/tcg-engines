import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinSquirrel: CharacterCard = {
  id: "1qe",
  cardType: "character",
  name: "Merlin",
  version: "Squirrel",
  fullName: "Merlin - Squirrel",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "LOOK BEFORE YOU LEAP When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 54,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e0e05765aeabd996bd2063c5bcdb4298b19829c8",
  },
  abilities: [
    {
      id: "1qe-1",
      type: "triggered",
      name: "LOOK BEFORE YOU LEAP When you play this character and",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "put-on-bottom",
        target: "CHOSEN_CHARACTER",
      },
      text: "LOOK BEFORE YOU LEAP When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};
