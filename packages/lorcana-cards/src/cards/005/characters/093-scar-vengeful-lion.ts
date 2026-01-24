import type { CharacterCard } from "@tcg/lorcana-types";

export const scarVengefulLion: CharacterCard = {
  id: "15b",
  cardType: "character",
  name: "Scar",
  version: "Vengeful Lion",
  fullName: "Scar - Vengeful Lion",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "Ward (Opponents can't choose this character except to challenge.)\nLIFE'S NOT FAIR, IS IT? Whenever one of your characters challenges a damaged character, you may draw a card.",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  cardNumber: 93,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "94e713f1c1f184e73a082487f65cd724657ffbec",
  },
  abilities: [
    {
      id: "15b-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "15b-2",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "LIFE'S NOT FAIR, IS IT? Whenever one of your characters challenges a damaged character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
