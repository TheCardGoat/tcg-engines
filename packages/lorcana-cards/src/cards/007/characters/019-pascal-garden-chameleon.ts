import type { CharacterCard } from "@tcg/lorcana-types";

export const pascalGardenChameleon: CharacterCard = {
  id: "1oz",
  cardType: "character",
  name: "Pascal",
  version: "Garden Chameleon",
  fullName: "Pascal - Garden Chameleon",
  inkType: ["amber", "amethyst"],
  franchise: "Tangled",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 3,
  cardNumber: 19,
  inkable: false,
  externalIds: {
    ravensburger: "dbbfc68f60125a864a3dff7e2bf4693570e24611",
  },
  abilities: [
    {
      id: "1oz-1",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
