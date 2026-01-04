import type { CharacterCard } from "@tcg/lorcana-types";

export const skippyEnergeticRabbit: CharacterCard = {
  id: "1ma",
  cardType: "character",
  name: "Skippy",
  version: "Energetic Rabbit",
  fullName: "Skippy - Energetic Rabbit",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 87,
  inkable: true,
  externalIds: {
    ravensburger: "d1dd02f4399d22aed3de073b0011d0a9fa633020",
  },
  abilities: [
    {
      id: "1ma-1",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
