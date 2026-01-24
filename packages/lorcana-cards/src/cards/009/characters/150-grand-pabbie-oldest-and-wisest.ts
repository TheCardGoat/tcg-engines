import type { CharacterCard } from "@tcg/lorcana-types";

export const grandPabbieOldestAndWisest: CharacterCard = {
  id: "qlg",
  cardType: "character",
  name: "Grand Pabbie",
  version: "Oldest and Wisest",
  fullName: "Grand Pabbie - Oldest and Wisest",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "009",
  text: "ANCIENT INSIGHT Whenever you remove 1 or more damage from one of your characters, gain 2 lore.",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  cardNumber: 150,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "5fda7961be7e170285551784dcfb8f728e92a982",
  },
  abilities: [
    {
      id: "qlg-1",
      type: "triggered",
      name: "ANCIENT INSIGHT",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "ANCIENT INSIGHT Whenever you remove 1 or more damage from one of your characters, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};
