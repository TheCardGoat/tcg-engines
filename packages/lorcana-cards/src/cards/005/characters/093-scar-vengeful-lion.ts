import type { CharacterCard } from "@tcg/lorcana-types";

export const scarVengefulLion: CharacterCard = {
  abilities: [
    {
      id: "15b-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "15b-2",
      text: "LIFE'S NOT FAIR, IS IT? Whenever one of your characters challenges a damaged character, you may draw a card.",
      type: "action",
    },
  ],
  cardNumber: 93,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "94e713f1c1f184e73a082487f65cd724657ffbec",
  },
  franchise: "Lion King",
  fullName: "Scar - Vengeful Lion",
  id: "15b",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Scar",
  set: "005",
  strength: 4,
  text: "Ward (Opponents can't choose this character except to challenge.)\nLIFE'S NOT FAIR, IS IT? Whenever one of your characters challenges a damaged character, you may draw a card.",
  version: "Vengeful Lion",
  willpower: 2,
};
