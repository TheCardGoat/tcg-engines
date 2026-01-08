import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenWickedAndVain: CharacterCard = {
  id: "y32",
  cardType: "character",
  name: "The Queen",
  version: "Wicked and Vain",
  fullName: "The Queen - Wicked and Vain",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**I SUMMON THEE** {E} − Draw a card.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 56,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**I SUMMON THEE** {E} − Draw a card.",
      id: "y32-1",
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Queen", "Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// export const theQueenWickedAndVain: LorcanitoCharacterCard = {
//   id: "y32",
//   reprints: ["k4l"],
//   name: "The Queen",
//   title: "Wicked and Vain",
//   characteristics: ["queen", "storyborn", "villain"],
//   text: "**I SUMMON THEE** {E} − Draw a card.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       responder: "self",
//       costs: [{ type: "exert" }],
//       name: "I Summon Thee",
//       text: "Draw a card.",
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour:
//     "Sublime beauty matched with peerless cunning. Is there any question who is fairest?",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 4,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Matthew Robert Davies",
//   number: 56,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508751,
//   },
//   rarity: "super_rare",
// };
//
