import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraLoreGuardian: CharacterCard = {
  id: "124",
  cardType: "character",
  name: "Aurora",
  version: "Lore Guardian",
  fullName: "Aurora - Lore Guardian",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "004",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aurora.)\nPRESERVER Opponents can't choose your items for abilities or effects.\nROYAL INVENTORY {E} one of your items — Look at the top card of your deck and put it on either the top or the bottom of your deck.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 140,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8a04e29b3d058277b73ebe312aa9cf6677675652",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   exertItemCost,
//   shiftAbility,
//   wardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const auroraLoreGuardian: LorcanitoCharacterCard = {
//   id: "i4c",
//   name: "Aurora",
//   title: "Lore Guardian",
//   characteristics: ["hero", "floodborn", "princess"],
//   text: "**Shift** 2 _(You may pay 2 ink to play this on top of one of your characters named Aurora.)_\n\n\n**GUARDIAN** Opponents can't choose your items.\n\n\n**ROYAL INVENTORY** {E} one of your items – look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//   type: "character",
//   abilities: [
//     shiftAbility(2, "Aurora"),
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "GUARDIAN",
//       text: "Opponents can't choose your items.",
//       gainedAbility: wardAbility,
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "item" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//     },
//     {
//       type: "activated",
//       name: "ROYAL INVENTORY",
//       costs: [exertItemCost(1)],
//       text: "{E} one of your items – look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//       effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Koni",
//   number: 140,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550605,
//   },
//   rarity: "super_rare",
// };
//
