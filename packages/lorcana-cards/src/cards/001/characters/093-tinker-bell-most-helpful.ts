import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellMostHelpful: CharacterCard = {
  id: "xkn",
  cardType: "character",
  name: "Tinker Bell",
  version: "Most Helpful",
  fullName: "Tinker Bell - Most Helpful",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PIXIE DUST** When you play this character, chosen character gains **Evasive** this turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 93,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PIXIE DUST** When you play this character, chosen character gains **Evasive** this turn.",
      id: "xkn-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const tinkerBellMostHelpful: LorcanitoCharacterCard = {
//   id: "xkn",
//   reprints: ["rxt"],
//   name: "Tinker Bell",
//   title: "Most Helpful",
//   characteristics: ["storyborn", "ally", "fairy"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PIXIE DUST** When you play this character, chosen character gains **Evasive** this turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Pixie Dust",
//       text: "When you play this character, chosen character gains **Evasive** this turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "evasive",
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//     evasiveAbility,
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Caner Soylu",
//   number: 93,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508775,
//   },
//   rarity: "common",
// };
//
