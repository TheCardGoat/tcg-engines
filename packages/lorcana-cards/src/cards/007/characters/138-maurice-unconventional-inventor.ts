import type { CharacterCard } from "@tcg/lorcana-types";

export const mauriceUnconventionalInventor: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["item"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "sgs-1",
      name: "HOW ON EARTH DID THAT HAPPEN?",
      text: "HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice's Machine, you may also banish chosen character with 2 {S} or less.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 138,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Inventor"],
  cost: 4,
  externalIds: {
    ravensburger: "6698a30b59037423babb442467706c9fb7964d3a",
  },
  franchise: "Beauty and the Beast",
  fullName: "Maurice - Unconventional Inventor",
  id: "sgs",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Maurice",
  set: "007",
  strength: 5,
  text: "HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice's Machine, you may also banish chosen character with 2 {S} or less.",
  version: "Unconventional Inventor",
  willpower: 2,
};
