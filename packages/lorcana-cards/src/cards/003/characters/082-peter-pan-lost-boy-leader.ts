import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanLostBoyLeader: CharacterCard = {
  id: "9ku",
  cardType: "character",
  name: "Peter Pan",
  version: "Lost Boy Leader",
  fullName: "Peter Pan - Lost Boy Leader",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "003",
  text: "I CAME TO LISTEN TO THE STORIES Once per turn, when this character moves to a location, gain lore equal to that location's {L}.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 82,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2285e2c33a254aaef5023dfa9eb28a60fcdce67e",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenMovesToALocation } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const peterPanLostBoyLeader: LorcanitoCharacterCard = {
//   id: "twu",
//   name: "Peter Pan",
//   title: "Lost Boy Leader",
//   characteristics: ["hero", "dreamborn"],
//   text: "**I CAME TO LISTEN TO THE STORIES** Once per turn, when this character moves to a location, gain lore equal to that location's {L}.",
//   type: "character",
//   abilities: [
//     whenMovesToALocation({
//       name: "I Came to Listen to the Stories",
//       text: "Once per turn, when this character moves to a location, gain lore equal to that location's {L}.",
//       oncePerTurn: true,
//       effects: [
//         {
//           type: "lore",
//           modifier: "add",
//           target: self,
//           resolveAmountBeforeCreatingLayer: true,
//           amount: {
//             dynamic: true,
//             targetLocation: { attribute: "lore" },
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "The Illumineers needed someone to find a missing spellbook, and Peter was the first to volunteer.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Grace Tran",
//   number: 82,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 531823,
//   },
//   rarity: "rare",
// };
//
