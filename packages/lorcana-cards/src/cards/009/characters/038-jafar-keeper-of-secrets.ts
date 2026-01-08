import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarKeeperOfSecrets: CharacterCard = {
  id: "1u7",
  cardType: "character",
  name: "Jafar",
  version: "Keeper of Secrets",
  fullName: "Jafar - Keeper of Secrets",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "009",
  text: "HIDDEN WONDERS This character gets +1 {S} for each card in your hand.",
  cost: 4,
  strength: 0,
  willpower: 5,
  lore: 2,
  cardNumber: 38,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ee9d82aaf3c52ce93cf24d12435b7bbf781da971",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { jafarKeeperOfSecrets as ogJafarKeeperOfTheSecrets } from "@lorcanito/lorcana-engine/cards/001/characters/044-jafar-keeper-of-secrets";
//
// export const jafarKeeperOfSecrets: LorcanitoCharacterCard = {
//   ...ogJafarKeeperOfTheSecrets,
//   id: "f6f",
//   reprints: [ogJafarKeeperOfTheSecrets.id],
//   number: 38,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649985,
//   },
// };
//
