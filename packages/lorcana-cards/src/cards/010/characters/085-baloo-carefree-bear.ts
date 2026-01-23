import type { CharacterCard } from "@tcg/lorcana-types";

export const balooCarefreeBear: CharacterCard = {
  id: "1vf",
  cardType: "character",
  name: "Baloo",
  version: "Carefree Bear",
  fullName: "Baloo - Carefree Bear",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Baloo.)\nROLL WITH IT When you play this character, choose one:\n- Each player draws a card.\n- Each player chooses and discards a card.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 85,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f304562c399fc869cd5b049872d5cbb222aac97d",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally"],
};
