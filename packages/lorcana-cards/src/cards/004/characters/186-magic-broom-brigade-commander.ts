import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomBrigadeCommander: CharacterCard = {
  id: "pct",
  cardType: "character",
  name: "Magic Broom",
  version: "Brigade Commander",
  fullName: "Magic Broom - Brigade Commander",
  inkType: ["steel"],
  franchise: "Fantasia",
  set: "004",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nARMY OF BROOMS This character gets +2 {S} for each other character named Magic Broom you have in play.",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 186,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5b62db7d0c2cf0af385d111c8e065a46ee86e2da",
  },
  abilities: [],
  classifications: ["Dreamborn", "Broom"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { propertyStaticAbilities } from "@lorcanito/lorcana-engine/abilities/propertyStaticAbilities";
//
// export const magicBroomBrigadeCommander: LorcanitoCharacterCard = {
//   id: "arp",
//   missingTestCase: true,
//   name: "Magic Broom",
//   title: "Brigade Commander",
//   characteristics: ["dreamborn", "broom"],
//   text: "**Resist** +1 _(Damage dealt to this character is reduced by 1.)_\n\n**ARMY OF BROOMS** This character gets +2 {S} for each other Broom character you have in play.",
//   type: "character",
//   abilities: [
//     resistAbility(1),
//     propertyStaticAbilities({
//       name: "Army Of Brooms",
//       text: "This character gets +1 {S} for each other Broom character you have in play.",
//       attribute: "strength",
//       amount: {
//         dynamic: true,
//         excludeSelf: true,
//         filterMultiplier: 2,
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: ["broom"] },
//         ],
//       },
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 2,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Otto Paredes",
//   number: 186,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550618,
//   },
//   rarity: "super_rare",
// };
//
