import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaKnightInTraining: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          chosen: true,
          target: "CONTROLLER",
          type: "discard",
        },
        type: "optional",
      },
      id: "8ex-1",
      name: "HAVE COURAGE",
      text: "HAVE COURAGE When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 176,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess", "Knight"],
  cost: 2,
  externalIds: {
    ravensburger: "1e54202930de5a3bff06a70d10c2b29821631820",
  },
  franchise: "Cinderella",
  fullName: "Cinderella - Knight in Training",
  id: "8ex",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Cinderella",
  set: "002",
  strength: 2,
  text: "HAVE COURAGE When you play this character, you may draw a card, then choose and discard a card.",
  version: "Knight in Training",
  willpower: 2,
};
