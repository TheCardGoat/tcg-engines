import type { CharacterCard } from "@tcg/lorcana";

export const iagoGiantSpectralParrot: CharacterCard = {
  id: "145",
  cardType: "character",
  name: "Iago",
  version: "Giant Spectral Parrot",
  fullName: "Iago - Giant Spectral Parrot",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nVanish (When an opponent chooses this character for an action, banish them.)",
  cost: 4,
  strength: 4,
  willpower: 6,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  externalIds: {
    ravensburger: "92a28806ab3fe41ff2c28195914ec78416311980",
  },
  abilities: [
    {
      id: "145-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "145-2",
      text: "Vanish",
      type: "keyword",
      keyword: "Vanish",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
};
