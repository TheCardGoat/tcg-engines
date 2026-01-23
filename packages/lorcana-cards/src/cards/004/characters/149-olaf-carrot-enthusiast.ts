import type { CharacterCard } from "@tcg/lorcana-types";

export const olafCarrotEnthusiast: CharacterCard = {
  id: "1da",
  cardType: "character",
  name: "Olaf",
  version: "Carrot Enthusiast",
  fullName: "Olaf - Carrot Enthusiast",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  text: "Shift: Discard an item card (You may discard an item card to play this on top of one of your characters named Olaf.)\nCARROTS ALL AROUND! Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 149,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b3fc93c88e4ea1c9c39db15bb3f974ab1d257511",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const olafCarrotEnthusiast: LorcanitoCharacterCard = {
//   id: "om0",
//   name: "Olaf",
//   title: "Carrot Enthusiast",
//   characteristics: ["floodborn", "ally"],
//   text: "**Shift: Discard an item card** _(You may discard an item card to play this on top of one of your characters named Olaf.)_\n\n**CARROTS ALL AROUND!** Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(
//       [
//         {
//           type: "card",
//           action: "discard",
//           amount: 1,
//           filters: [
//             { filter: "zone", value: "hand" },
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "item" },
//           ],
//         },
//       ],
//       "Olaf",
//       "**Shift: Discard an item card** _(You may discard an item card to play this on top of one of your characters named Olaf.)_",
//     ),
//     wheneverQuests({
//       optional: true,
//       name: "CARROTS ALL AROUND!",
//       text: "Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           target: yourOtherCharacters,
//           amount: {
//             dynamic: true,
//             sourceAttribute: "strength",
//           },
//           modifier: "add",
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 1,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Lauren Levering",
//   number: 149,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547767,
//   },
//   rarity: "uncommon",
// };
//
