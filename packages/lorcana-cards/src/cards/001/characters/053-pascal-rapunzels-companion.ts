import type { CharacterCard } from "@tcg/lorcana-types";

export const pascalRapunzelsCompanion: CharacterCard = {
  id: "1f9",
  cardType: "character",
  name: "Pascal",
  version: "Rapunzel’s Companion",
  fullName: "Pascal - Rapunzel’s Companion",
  inkType: ["amethyst"],
  franchise: "Tangled",
  set: "001",
  text: "CAMOUFLAGE While you have another character in play, this character gains Evasive. (Only characters with Evasive can challenge them.)",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 53,
  inkable: true,
  externalIds: {
    ravensburger: "b814a14e2ffdfc65f2f3431f069419dede125422",
  },
  abilities: [
    {
      id: "1f9-1",
      text: "CAMOUFLAGE While you have another character in play, this character gains Evasive.",
      name: "CAMOUFLAGE",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const pascalRapunzelCompanion: LorcanitoCharacterCard = {
//   id: "c2y",
//   name: "Pascal",
//   title: "Rapunzel's Companion",
//   characteristics: ["storyborn", "ally"],
//   text: "**CAMOUFLAGE** While you have another character in play, this character gains **Evasive**. _(Only characters\rwith Evasive can challenge them.)_",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGains({
//       name: "Camouflage",
//       text: "While you have another character in play, this character gains **Evasive**. _(Only characters\rwith Evasive can challenge them.)_",
//       ability: evasiveAbility,
//       conditions: [
//         {
//           type: "not-alone",
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "A true friend is always there for you, whether you can\rsee them or not.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 1,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Brian Weisz",
//   number: 53,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493488,
//   },
//   rarity: "uncommon",
// };
//
