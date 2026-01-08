import type { CharacterCard } from "@tcg/lorcana-types";

export const hiramFlavershamToymaker: CharacterCard = {
  id: "slt",
  cardType: "character",
  name: "Hiram Flaversham",
  version: "Toymaker",
  fullName: "Hiram Flaversham - Toymaker",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "ARTIFICER When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
  cost: 4,
  strength: 1,
  willpower: 6,
  lore: 1,
  cardNumber: 149,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "671965c7095dd8a31d791f102a4dc3e789f6a21b",
  },
  abilities: [],
  classifications: ["Storyborn", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenItemOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const hiramFlavershamToymaker: LorcanitoCharacterCard = {
//   id: "fap",
//   name: "Hiram Flaversham",
//   title: "Toymaker",
//   characteristics: ["storyborn", "inventor"],
//   text: "**ARTIFICER** When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
//   type: "character",
//   abilities: [
//     ...whenPlayAndWheneverQuests({
//       name: "Artificer",
//       text: "When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
//       optional: true,
//       dependentEffects: true,
//       effects: [
//         {
//           type: "banish",
//           target: chosenItemOfYours,
//         },
//         {
//           type: "draw",
//           amount: 2,
//           target: self,
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "His creations are even more wondrous with the Illuminary's resources at his fingertips.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 1,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Leonardo Giammichele",
//   number: 149,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527277,
//   },
//   rarity: "rare",
// };
//
