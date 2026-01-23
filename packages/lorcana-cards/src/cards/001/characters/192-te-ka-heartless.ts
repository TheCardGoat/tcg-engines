import type { CharacterCard } from "@tcg/lorcana-types";

export const teKaHeartless: CharacterCard = {
  id: "pfr",
  cardType: "character",
  name: "Te Ka",
  version: "Heartless",
  fullName: "Te Ka - Heartless",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**SEEK THE HEART** During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 192,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**SEEK THE HEART** During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
      id: "pfr-1",
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    },
  ],
  classifications: ["Dreamborn", "Villain", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const teKaHeartless: LorcanitoCharacterCard = {
//   id: "pfr",
//   name: "Te Ka",
//   title: "Heartless",
//   characteristics: ["dreamborn", "villain", "deity"],
//   text: "**SEEK THE HEART** During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
//   type: "character",
//   abilities: [
//     wheneverBanishesAnotherCharacterInChallenge({
//       effects: [
//         {
//           type: "lore",
//           amount: 2,
//           modifier: "add",
//           target: self,
//         },
//       ],
//     }),
//   ],
//   flavour: "Maui: Ever defeat a lava monster? \nMoana: No. Have you?",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Andrew Trabbold",
//   number: 192,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508954,
//   },
//   rarity: "legendary",
// };
//
