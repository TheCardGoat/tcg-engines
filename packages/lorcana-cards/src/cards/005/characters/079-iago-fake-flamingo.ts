import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoFakeFlamingo: CharacterCard = {
  id: "1y2",
  cardType: "character",
  name: "Iago",
  version: "Fake Flamingo",
  fullName: "Iago - Fake Flamingo",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nIN DISGUISE Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 79,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fdddc0b41d647d7e1127afeec42899e1a0966861",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youPayXLessToPlayNextActionThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const iagoFakeFlamingo: LorcanitoCharacterCard = {
//   id: "ebj",
//   missingTestCase: true,
//   name: "Iago",
//   title: "Fake Flamingo",
//   characteristics: ["storyborn", "ally"],
//   text: "**IN DISGUISE** Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     wheneverQuests({
//       name: "In Disguise",
//       text: "Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
//       effects: [youPayXLessToPlayNextActionThisTurn(2)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Hadjie Joos / Pix Smith",
//   number: 79,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559625,
//   },
//   rarity: "rare",
// };
//
