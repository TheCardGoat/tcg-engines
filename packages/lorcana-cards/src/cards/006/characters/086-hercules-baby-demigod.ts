import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesBabyDemigod: CharacterCard = {
  abilities: [
    {
      id: "844-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
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
      id: "844-2",
      text: "STRONG LIKE HIS DAD 3 {I} - Deal 1 damage to chosen damaged character.",
      type: "action",
    },
  ],
  cardNumber: 86,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 6,
  externalIds: {
    ravensburger: "1d3e9a6a745129558b1f73e99dcf845eebef5469",
  },
  franchise: "Hercules",
  fullName: "Hercules - Baby Demigod",
  id: "844",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Hercules",
  set: "006",
  strength: 6,
  text: "Ward (Opponents can't choose this character except to challenge.)\nSTRONG LIKE HIS DAD 3 {I} - Deal 1 damage to chosen damaged character.",
  version: "Baby Demigod",
  willpower: 3,
};
