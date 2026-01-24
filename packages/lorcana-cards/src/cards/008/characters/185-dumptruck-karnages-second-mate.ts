import type { CharacterCard } from "@tcg/lorcana-types";

export const dumptruckKarnagesSecondMate: CharacterCard = {
  id: "vwi",
  cardType: "character",
  name: "Dumptruck",
  version: "Karnage's Second Mate",
  fullName: "Dumptruck - Karnage's Second Mate",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "008",
  text: "LET ME AT 'EM When you play this character, you may deal 1 damage to chosen character.",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  cardNumber: 185,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "72fae2c55a0cb5eaf11518898e0b51cd6f9ad21a",
  },
  abilities: [
    {
      id: "vwi-1",
      type: "triggered",
      name: "LET ME AT 'EM",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "LET ME AT 'EM When you play this character, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
};
