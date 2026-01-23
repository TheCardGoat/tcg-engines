import type { CharacterCard } from "@tcg/lorcana-types";

export const zeusMrLightningBolts: CharacterCard = {
  id: "lks",
  cardType: "character",
  name: "Zeus",
  version: "Mr. Lightning Bolts",
  fullName: "Zeus - Mr. Lightning Bolts",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "TARGET PRACTICE Whenever this character challenges another character, he gets +{S} equal to the {S} of chosen character this turn.",
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 2,
  cardNumber: 92,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4dc45f6ba32b0e07fb3f64d0c770408d7aec13aa",
  },
  abilities: [],
  classifications: ["Storyborn", "King", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   thisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const zeusMrLightningBolts: LorcanitoCharacterCard = {
//   id: "qfh",
//   name: "Zeus",
//   title: "Mr. Lightning Bolts",
//   characteristics: ["storyborn", "king", "deity"],
//   text: "**TARGET PRACTICE** Whenever this character challenges another character, he gets + {S} equal to the {S} of chosen character this turn.",
//   type: "character",
//   abilities: [
//     wheneverChallengesAnotherChar({
//       name: "Target Practice",
//       text: "Whenever this character challenges another character, he gets + {S} equal to the {S} of chosen character this turn.",
//       effects: [
//         {
//           type: "create-layer-based-on-target",
//           target: chosenCharacter,
//           // TODO: this is workign kind of by accident
//           // the dynamic amount from the parent effect forces this amount to be replaced.
//           resolveAmountBeforeCreatingLayer: true,
//           effects: [
//             {
//               type: "attribute",
//               attribute: "strength",
//               modifier: "add",
//               target: thisCharacter,
//               amount: {
//                 dynamic: true,
//                 target: { attribute: "strength" },
//               },
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   flavour: "Ha! Now watch your old man work!",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   willpower: 5,
//   lore: 2,
//   strength: 0,
//   illustrator: "Moniek Schilder",
//   number: 92,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550583,
//   },
//   rarity: "super_rare",
// };
//
