import type { ItemCard } from "@tcg/lorcana-types";

export const blessedBagpipes: ItemCard = {
  id: "a2n",
  cardType: "item",
  name: "Blessed Bagpipes",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "MCDUCK HEIRLOOM When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.\nBATTLE ANTHEM Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.",
  cost: 2,
  cardNumber: 101,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "244e0c0000d6488f1bcd68eec3bac2b5a565933e",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { boostTargetCharOrLocationWithBoostAbility } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { oneOfYourCharsOrLocationsWithACardUnderThem } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   whenChallenged,
//   whenYouPlayThis,
// } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { targetCardsGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const blessedBagpipes: LorcanitoItemCard = {
//   id: "hic",
//   name: "Blessed Bagpipes",
//   characteristics: ["item"],
//   text: "MCDUCK HEIRLOOM When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.\nBATTLE ANTHEM Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.",
//   type: "item",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Simone Buonfantino",
//   number: 101,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659598,
//   },
//   rarity: "uncommon",
//   abilities: [
//     whenYouPlayThis({
//       name: "MCDUCK HEIRLOOM",
//       text: "When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
//       optional: true,
//       effects: [boostTargetCharOrLocationWithBoostAbility],
//     }),
//     targetCardsGains({
//       name: "BATTLE ANTHEM",
//       text: "Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.",
//       target: oneOfYourCharsOrLocationsWithACardUnderThem,
//       ability: whenChallenged({
//         name: "BATTLE ANTHEM",
//         text: "Whenever this card is challenged, gain 1 lore.",
//         effects: [youGainLore(1)],
//       }),
//     }),
//   ],
// };
//
