import type { CharacterCard } from "@tcg/lorcana-types";

export const jimHawkinsRiggingSpecialist: CharacterCard = {
  id: "woa",
  cardType: "character",
  name: "Jim Hawkins",
  version: "Rigging Specialist",
  fullName: "Jim Hawkins - Rigging Specialist",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jim Hawkins.)\nBATTLE STATION When you play this character, you may deal 1 damage to chosen character or location.",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 183,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "75c2f2b59b5e5ac1e89500e05b1f13ffb995b892",
  },
  abilities: [
    {
      id: "woa-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "woa-2",
      type: "triggered",
      name: "BATTLE STATION",
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
      text: "BATTLE STATION When you play this character, you may deal 1 damage to chosen character or location.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
