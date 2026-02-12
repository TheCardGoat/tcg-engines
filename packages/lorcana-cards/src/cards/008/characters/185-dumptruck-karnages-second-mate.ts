import type { CharacterCard } from "@tcg/lorcana-types";

export const dumptruckKarnagesSecondMate: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "vwi-1",
      name: "LET ME AT 'EM",
      text: "LET ME AT 'EM When you play this character, you may deal 1 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 185,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Pirate"],
  cost: 1,
  externalIds: {
    ravensburger: "72fae2c55a0cb5eaf11518898e0b51cd6f9ad21a",
  },
  franchise: "Talespin",
  fullName: "Dumptruck - Karnage's Second Mate",
  id: "vwi",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Dumptruck",
  set: "008",
  strength: 0,
  text: "LET ME AT 'EM When you play this character, you may deal 1 damage to chosen character.",
  version: "Karnage's Second Mate",
  willpower: 1,
};
