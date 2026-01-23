import type { CharacterCard } from "@tcg/lorcana-types";

export const isabelaMadrigalGoldenChild: CharacterCard = {
  id: "qop",
  cardType: "character",
  name: "Isabela Madrigal",
  version: "Golden Child",
  fullName: "Isabela Madrigal - Golden Child",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLADIES FIRST During your turn, if no other character has quested this turn, this character gets +3 {L}.\nLEAVE IT TO ME Whenever this character quests, your other characters can't quest for the rest of this turn.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 45,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "602e3638bdc1ac3933b370be9d140955b16e7df6",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { whileNoOtherCharacterHasQuestedThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const isabelaMadrigalGoldenChild: LorcanitoCharacterCard = {
//   id: "fal",
//   name: "Isabela Madrigal",
//   title: "Golden Child",
//   characteristics: ["storyborn", "ally", "madrigal"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**LADIES FIRST** During your turn, if no other character has quested this turn, this character gets +3 {L}.\n\n\n**LEAVE IT TO ME** Whenever this character quests, your other characters can't quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     whileNoOtherCharacterHasQuestedThisCharacterGets({
//       name: "Ladies First",
//       text: "During your turn, if no other character has quested this turn, this character gets +3 {L}.",
//       amount: 3,
//       attribute: "lore",
//     }),
//     wheneverQuests({
//       name: "LEAVE IT TO ME",
//       text: "Whenever this character quests, your other characters can't quest for the rest of this turn.",
//       effects: [
//         {
//           type: "restriction",
//           restriction: "quest",
//           duration: "turn",
//           target: yourOtherCharacters,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Otto Paredes",
//   number: 45,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 548204,
//   },
//   rarity: "rare",
// };
//
