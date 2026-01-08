import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomBucketBrigade: CharacterCard = {
  id: "zyc",
  cardType: "character",
  name: "Magic Broom",
  version: "Bucket Brigade",
  fullName: "Magic Broom - Bucket Brigade",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**SWEEP** When you play this character, you may shuffle a card from any discard into its player",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 47,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**SWEEP** When you play this character, you may shuffle a card from any discard into its player",
      id: "zyc-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Dreamborn", "Broom"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const magicBroomBucketBrigade: LorcanitoCharacterCard = {
//   id: "zyc",
//   name: "Magic Broom",
//   title: "Bucket Brigade",
//   characteristics: ["dreamborn", "broom"],
//   text: "**SWEEP** When you play this character, you may shuffle a card from any discard into its player's deck.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       optional: true,
//       name: "SWEEP",
//       text: "When you play this character, you may shuffle a card from any discard into its player's deck.",
//       effects: [
//         {
//           type: "shuffle",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [{ filter: "zone", value: "discard" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "In the immense story-forge known as the Great Illuminary, there is always work to be done.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Dav Augereau / Guykua Ruva",
//   number: 47,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493477,
//   },
//   rarity: "common",
// };
//
