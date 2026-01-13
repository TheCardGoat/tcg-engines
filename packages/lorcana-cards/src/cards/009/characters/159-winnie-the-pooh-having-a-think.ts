import type { CharacterCard } from "@tcg/lorcana-types";

export const winnieThePoohHavingAThink: CharacterCard = {
  id: "18k",
  cardType: "character",
  name: "Winnie the Pooh",
  version: "Having a Think",
  fullName: "Winnie the Pooh - Having a Think",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "009",
  text: "HUNNY POT Whenever this character quests, you may put a card from your hand into your inkwell facedown.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 159,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a0ac5d7c21c80cd3df94d836790d6e371f81ae76",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { winnieThePoohHavingAThink as winnieThePoohHavingAThinkAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/161-winnie-the-pooh-having-a-think";
//
// export const winnieThePoohHavingAThink: LorcanitoCharacterCard = {
//   ...winnieThePoohHavingAThinkAsOrig,
//   id: "vvd",
//   reprints: [winnieThePoohHavingAThinkAsOrig.id],
//   number: 159,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650094,
//   },
// };
//
