import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphAdmiralUnderpants: CharacterCard = {
  id: "147",
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Admiral Underpants",
  fullName: "Wreck-It Ralph - Admiral Underpants",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "I'VE GOT THE COOLEST FRIEND When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.",
  cost: 7,
  strength: 6,
  willpower: 7,
  lore: 2,
  cardNumber: 21,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "90be88771bf33875d53ee455138650dd821cd7ba",
  },
  abilities: [
    {
      id: "147-1",
      type: "triggered",
      name: "I'VE GOT THE COOLEST FRIEND",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "that card is a Princess character card",
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
      },
      text: "I'VE GOT THE COOLEST FRIEND When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
