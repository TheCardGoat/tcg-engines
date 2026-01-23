import type { CharacterCard } from "@tcg/lorcana-types";

export const lefouInstigator: CharacterCard = {
  id: "dx9",
  cardType: "character",
  name: "Lefou",
  version: "Instigator",
  fullName: "Lefou - Instigator",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**FAN THE FLAMES** When you play this character, ready chosen character. They can",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 112,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**FAN THE FLAMES** When you play this character, ready chosen character. They can",
      id: "dx9-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const lefouInstigator: LorcanitoCharacterCard = {
//   id: "dx9",
//   reprints: ["bmd"],
//   name: "Lefou",
//   title: "Instigator",
//   characteristics: ["dreamborn", "ally"],
//   text: "**FAN THE FLAMES** When you play this character, ready chosen character. They can't quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Fan the Flames",
//       text: "When you play this character, ready chosen character. They can't quest for the rest of this turn.",
//       effects: readyAndCantQuest({
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//         ],
//       }),
//     }),
//   ],
//   flavour: "All a mob needs is a push in the wrong direction.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Gaku Kumatori",
//   number: 112,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508356,
//   },
//   rarity: "rare",
// };
//
