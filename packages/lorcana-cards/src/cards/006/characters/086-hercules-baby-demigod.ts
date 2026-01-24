import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesBabyDemigod: CharacterCard = {
  id: "844",
  cardType: "character",
  name: "Hercules",
  version: "Baby Demigod",
  fullName: "Hercules - Baby Demigod",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)\nSTRONG LIKE HIS DAD 3 {I} - Deal 1 damage to chosen damaged character.",
  cost: 6,
  strength: 6,
  willpower: 3,
  lore: 2,
  cardNumber: 86,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "1d3e9a6a745129558b1f73e99dcf845eebef5469",
  },
  abilities: [
    {
      id: "844-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "844-2",
      type: "action",
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
      text: "STRONG LIKE HIS DAD 3 {I} - Deal 1 damage to chosen damaged character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
