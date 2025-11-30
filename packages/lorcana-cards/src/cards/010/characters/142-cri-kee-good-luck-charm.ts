import type { CharacterCard } from "@tcg/lorcana";

export const crikeeGoodLuckCharm: CharacterCard = {
  id: "1gx",
  cardType: "character",
  name: "Cri-Kee",
  version: "Good Luck Charm",
  fullName: "Cri-Kee - Good Luck Charm",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "010",
  text: "Alert (This character can challenge as if they had Evasive.)",
  cardNumber: "142",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "becfbb1f4251f07b2c92bee5465e8d8cbf12d90f",
  },
  keywords: ["Alert"],
  abilities: [
    {
      id: "1gx-ability-1",
      text: "Alert (This character can challenge as if they had Evasive.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
