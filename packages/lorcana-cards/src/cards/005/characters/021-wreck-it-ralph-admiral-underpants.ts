import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphAdmiralUnderpants: CharacterCard = {
  abilities: [
    {
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
      id: "147-1",
      name: "I'VE GOT THE COOLEST FRIEND",
      text: "I'VE GOT THE COOLEST FRIEND When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 21,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 7,
  externalIds: {
    ravensburger: "90be88771bf33875d53ee455138650dd821cd7ba",
  },
  franchise: "Wreck It Ralph",
  fullName: "Wreck-It Ralph - Admiral Underpants",
  id: "147",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Wreck-It Ralph",
  set: "005",
  strength: 6,
  text: "I'VE GOT THE COOLEST FRIEND When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.",
  version: "Admiral Underpants",
  willpower: 7,
};
