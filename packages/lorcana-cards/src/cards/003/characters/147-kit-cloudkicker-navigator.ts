import type { CharacterCard } from "@tcg/lorcana-types";

export const kitCloudkickerNavigator: CharacterCard = {
  id: "jtu",
  cardType: "character",
  name: "Kit Cloudkicker",
  version: "Navigator",
  fullName: "Kit Cloudkicker - Navigator",
  inkType: ["sapphire"],
  franchise: "Talespin",
  set: "003",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Kit Cloudkicker.)\nWard (Opponents can't choose this character except to challenge.)",
  cost: 6,
  strength: 2,
  willpower: 5,
  lore: 3,
  cardNumber: 147,
  inkable: true,
  externalIds: {
    ravensburger: "47773147eebaaca874ca1bcb4a9b47503e4dc810",
  },
  abilities: [
    {
      id: "jtu-1",
      text: "Shift",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "jtu-2",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
