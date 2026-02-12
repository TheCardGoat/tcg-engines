import type { CharacterCard } from "@tcg/lorcana-types";

export const jimHawkinsRiggingSpecialist: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "woa-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "woa-2",
      name: "BATTLE STATION",
      text: "BATTLE STATION When you play this character, you may deal 1 damage to chosen character or location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 183,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "75c2f2b59b5e5ac1e89500e05b1f13ffb995b892",
  },
  franchise: "Treasure Planet",
  fullName: "Jim Hawkins - Rigging Specialist",
  id: "woa",
  inkType: ["steel"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Jim Hawkins",
  set: "006",
  strength: 5,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jim Hawkins.)\nBATTLE STATION When you play this character, you may deal 1 damage to chosen character or location.",
  version: "Rigging Specialist",
  willpower: 5,
};
