import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinSquirrel: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "put-on-bottom",
        target: "CHOSEN_CHARACTER",
      },
      id: "1qe-1",
      name: "LOOK BEFORE YOU LEAP When you play this character and",
      text: "LOOK BEFORE YOU LEAP When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 54,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "e0e05765aeabd996bd2063c5bcdb4298b19829c8",
  },
  franchise: "Sword in the Stone",
  fullName: "Merlin - Squirrel",
  id: "1qe",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Merlin",
  set: "002",
  strength: 2,
  text: "LOOK BEFORE YOU LEAP When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  version: "Squirrel",
  willpower: 1,
};
