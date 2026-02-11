import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoGiantSpectralParrot: CharacterCard = {
  abilities: [
    {
      id: "145-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      id: "145-2",
      keyword: "Vanish",
      text: "Vanish",
      type: "keyword",
    },
  ],
  cardNumber: 49,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Illusion"],
  cost: 4,
  externalIds: {
    ravensburger: "92a28806ab3fe41ff2c28195914ec78416311980",
  },
  franchise: "Aladdin",
  fullName: "Iago - Giant Spectral Parrot",
  id: "145",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Iago",
  set: "007",
  strength: 4,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nVanish (When an opponent chooses this character for an action, banish them.)",
  version: "Giant Spectral Parrot",
  willpower: 6,
};
