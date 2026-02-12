import type { CharacterCard } from "@tcg/lorcana-types";

export const pegasusFlyingSteed: CharacterCard = {
  abilities: [
    {
      id: "dxe-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 120,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "3232a625c1ad1451c0bd29fcfbc149d3d2a38166",
  },
  franchise: "Hercules",
  fullName: "Pegasus - Flying Steed",
  id: "dxe",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  name: "Pegasus",
  set: "004",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  version: "Flying Steed",
  willpower: 1,
};
