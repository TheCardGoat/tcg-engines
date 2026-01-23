import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoSteelChampion: CharacterCard = {
  id: "1g1",
  cardType: "character",
  name: "Pluto",
  version: "Steel Champion",
  fullName: "Pluto - Steel Champion",
  inkType: ["steel"],
  set: "010",
  text: "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.\nMAKE ROOM Whenever you play another Steel character, you may banish chosen item.",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 191,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "054d01b8c7262fc35deae953e21e415e967fe99b",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};
