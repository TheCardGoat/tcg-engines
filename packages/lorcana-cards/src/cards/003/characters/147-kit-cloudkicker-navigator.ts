import type { CharacterCard } from "@tcg/lorcana-types";

export const kitCloudkickerNavigator: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "jtu-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      id: "jtu-2",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
  ],
  cardNumber: 147,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "47773147eebaaca874ca1bcb4a9b47503e4dc810",
  },
  franchise: "Talespin",
  fullName: "Kit Cloudkicker - Navigator",
  id: "jtu",
  inkType: ["sapphire"],
  inkable: true,
  lore: 3,
  name: "Kit Cloudkicker",
  set: "003",
  strength: 2,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Kit Cloudkicker.)\nWard (Opponents can't choose this character except to challenge.)",
  version: "Navigator",
  willpower: 5,
};
