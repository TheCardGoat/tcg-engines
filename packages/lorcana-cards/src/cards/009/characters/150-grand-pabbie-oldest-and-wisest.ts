import type { CharacterCard } from "@tcg/lorcana-types";

export const grandPabbieOldestAndWisest: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      id: "qlg-1",
      name: "ANCIENT INSIGHT",
      text: "ANCIENT INSIGHT Whenever you remove 1 or more damage from one of your characters, gain 2 lore.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 150,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 7,
  externalIds: {
    ravensburger: "5fda7961be7e170285551784dcfb8f728e92a982",
  },
  franchise: "Frozen",
  fullName: "Grand Pabbie - Oldest and Wisest",
  id: "qlg",
  inkType: ["sapphire"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Grand Pabbie",
  set: "009",
  strength: 3,
  text: "ANCIENT INSIGHT Whenever you remove 1 or more damage from one of your characters, gain 2 lore.",
  version: "Oldest and Wisest",
  willpower: 6,
};
