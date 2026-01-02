import type { CharacterCard } from "@tcg/lorcana-types";

export const archimedesElectrifiedOwl: CharacterCard = {
  id: "oah",
  cardType: "character",
  name: "Archimedes",
  version: "Electrified Owl",
  fullName: "Archimedes - Electrified Owl",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Archimedes.)\nEvasive (Only characters with Evasive can challenge this character.)\nChallenger +3 (While challenging, this character gets +3 {S}.)",
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 47,
  inkable: true,
  externalIds: {
    ravensburger: "578bdd170d24c10c27b0de9d21eb62b130201c69",
  },
  abilities: [
    {
      id: "oah-1",
      text: "Shift 3",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "oah-2",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "oah-3",
      text: "Challenger +3",
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
