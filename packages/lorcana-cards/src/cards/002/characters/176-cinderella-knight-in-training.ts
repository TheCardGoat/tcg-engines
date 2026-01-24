import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaKnightInTraining: CharacterCard = {
  id: "8ex",
  cardType: "character",
  name: "Cinderella",
  version: "Knight in Training",
  fullName: "Cinderella - Knight in Training",
  inkType: ["steel"],
  franchise: "Cinderella",
  set: "002",
  text: "HAVE COURAGE When you play this character, you may draw a card, then choose and discard a card.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 176,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1e54202930de5a3bff06a70d10c2b29821631820",
  },
  abilities: [
    {
      id: "8ex-1",
      type: "triggered",
      name: "HAVE COURAGE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      text: "HAVE COURAGE When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess", "Knight"],
};
