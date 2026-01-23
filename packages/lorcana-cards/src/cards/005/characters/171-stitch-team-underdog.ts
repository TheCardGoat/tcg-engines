import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchTeamUnderdog: CharacterCard = {
  id: "jmz",
  cardType: "character",
  name: "Stitch",
  version: "Team Underdog",
  fullName: "Stitch - Team Underdog",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "005",
  text: "HEAVE HO! When you play this character, you may deal 2 damage to chosen character.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 171,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "46c74815d938940a1435bdae976105ce9951db9f",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Alien"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const stitchTeamUnderdog: LorcanitoCharacterCard = {
//   id: "ovo",
//   missingTestCase: true,
//   name: "Stitch",
//   title: "Team Underdog",
//   characteristics: ["hero", "alien", "storyborn"],
//   text: "**HEAVE HO!** When you play this character, you may deal 2 damage to chosen character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "HEAVE HO!",
//       text: "When you play this character, you may deal 2 damage to chosen character.",
//       effects: [dealDamageEffect(2, chosenCharacter)],
//     },
//   ],
//   flavour:
//     "He's not the biggest glimmer on the team, but he still packs a wallop.",
//   colors: ["steel"],
//   cost: 4,
//   strength: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Karen Hellon",
//   number: 171,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 557295,
//   },
//   rarity: "uncommon",
// };
//
