import type { CharacterCard } from "@tcg/lorcana-types";

export const archimedesElectrifiedOwl: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "oah-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      id: "oah-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      id: "oah-3",
      keyword: "Challenger",
      text: "Challenger +3",
      type: "keyword",
      value: 3,
    },
  ],
  cardNumber: 47,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "578bdd170d24c10c27b0de9d21eb62b130201c69",
  },
  franchise: "Sword in the Stone",
  fullName: "Archimedes - Electrified Owl",
  id: "oah",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Archimedes",
  set: "005",
  strength: 1,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Archimedes.)\nEvasive (Only characters with Evasive can challenge this character.)\nChallenger +3 (While challenging, this character gets +3 {S}.)",
  version: "Electrified Owl",
  willpower: 4,
};
