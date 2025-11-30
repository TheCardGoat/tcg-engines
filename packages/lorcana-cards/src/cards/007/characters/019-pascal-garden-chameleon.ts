import type { CharacterCard } from "@tcg/lorcana";

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
  cardNumber: "019",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 3,
  inkable: false,
  vanilla: false,
  externalIds: {
    ravensburger: "dbbfc68f60125a864a3dff7e2bf4693570e24611",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1oz-ability-1",
      text: "Evasive (Only characters with Evasive can challenge this character.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
