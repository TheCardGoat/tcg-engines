import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimCheatingSpellcaster: CharacterCard = {
  id: "1rw",
  cardType: "character",
  name: "Madam Mim",
  version: "Cheating Spellcaster",
  fullName: "Madam Mim - Cheating Spellcaster",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "007",
  text: "PLAY ROUGH Whenever this character quests, exert chosen opposing character.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 56,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e64deb540e72f37a0acc06a08a062edf3bb60304",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const madamMimCheatingSpellcaster: LorcanitoCharacterCard = {
//   id: "hsi",
//   name: "Madam Mim",
//   title: "Cheating Spellcaster",
//   characteristics: ["storyborn", "villain", "sorcerer"],
//   text: "PLAY ROUGH Whenever this character quests, exert chosen opposing character.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "PLAY ROUGH",
//       text: "Whenever this character quests, exert chosen opposing character.",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 6,
//   strength: 4,
//   willpower: 5,
//   illustrator: "Jocelyn Sepulveda",
//   number: 56,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619435,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
