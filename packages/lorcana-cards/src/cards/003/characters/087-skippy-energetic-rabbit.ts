import type { CharacterCard } from "@tcg/lorcana";

export const skippyEnergeticRabbit: CharacterCard = {
  id: "1m8",
  cardType: "character",
  name: "Skippy",
  version: "Energetic Rabbit",
  fullName: "Skippy - Energetic Rabbit",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cardNumber: "087",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "d1dd02f4399d22aed3de073b0011d0a9fa633020",
  },
  keywords: ["Ward"],
  abilities: [
    {
      id: "1m8a1",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
