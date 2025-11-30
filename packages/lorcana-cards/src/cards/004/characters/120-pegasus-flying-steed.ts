import type { CharacterCard } from "@tcg/lorcana";

export const pegasusFlyingSteed: CharacterCard = {
  id: "dxe",
  cardType: "character",
  name: "Pegasus",
  version: "Flying Steed",
  fullName: "Pegasus - Flying Steed",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "004",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "120",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "3232a625c1ad1451c0bd29fcfbc149d3d2a38166",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "dxe-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
