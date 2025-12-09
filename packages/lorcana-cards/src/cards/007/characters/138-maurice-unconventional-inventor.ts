import type { CharacterCard } from "@tcg/lorcana";

export const mauriceUnconventionalInventor: CharacterCard = {
  id: "sgs",
  cardType: "character",
  name: "Maurice",
  version: "Unconventional Inventor",
  fullName: "Maurice - Unconventional Inventor",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice's Machine, you may also banish chosen character with 2 {S} or less.",
  cost: 4,
  strength: 5,
  willpower: 2,
  lore: 1,
  cardNumber: 138,
  inkable: true,
  externalIds: {
    ravensburger: "6698a30b59037423babb442467706c9fb7964d3a",
  },
  abilities: [
    {
      id: "sgs-1",
      text: "HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice's Machine, you may also banish chosen character with 2 {S} or less.",
      name: "HOW ON EARTH DID THAT HAPPEN?",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Mentor", "Inventor"],
};
