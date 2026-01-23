import type { CharacterCard } from "@tcg/lorcana-types";

export const mowgliManCub: CharacterCard = {
  id: "mea",
  cardType: "character",
  name: "Mowgli",
  version: "Man Cub",
  fullName: "Mowgli - Man Cub",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "010",
  text: "HAVE A BETTER LOOK When you play this character, chosen opponent reveals their hand and discards a non-character card of their choice.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 19,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "50b8acc5a7f2a8afabe9284202005b34f69e21e1",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};
