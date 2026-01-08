import type { CharacterCard } from "@tcg/lorcana-types";

export const taffytaMuttonfudgeCrowdFavorite: CharacterCard = {
  id: "1a4",
  cardType: "character",
  name: "Taffyta Muttonfudge",
  version: "Crowd Favorite",
  fullName: "Taffyta Muttonfudge - Crowd Favorite",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "SHOWSTOPPER When you play this character, if you have a location in play, each opponent loses 1 lore.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 114,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a6456a6446cdb4d9a61078c45ea55152f8bbcc31",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { youHaveLocationInPlay } from "@lorcanito/lorcana-engine/abilities/conditions";
// import { eachOpponentLosesXLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const taffytaMuttonfudgeCrowdFavorite: LorcanitoCharacterCard = {
//   id: "a55",
//   name: "Taffyta Muttonfudge",
//   title: "Crowd Favorite",
//   characteristics: ["storyborn", "ally", "racer"],
//   text: "**SHOWSTOPPER** When you play this character, if you have a location in play, each opponent loses 1 lore.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Showstopper",
//       text: "When you play this character, if you have a location in play, each opponent loses 1 lore.",
//       resolutionConditions: [youHaveLocationInPlay],
//       effects: [eachOpponentLosesXLore(1)],
//     },
//   ],
//   flavour: '"Never lose sight of where you\'re going. Second place."',
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Carlos Luzzi",
//   number: 114,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555269,
//   },
//   rarity: "common",
// };
//
