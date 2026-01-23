import type { CharacterCard } from "@tcg/lorcana-types";

export const marshmallowTerrifyingSnowman: CharacterCard = {
  id: "1fi",
  cardType: "character",
  name: "Marshmallow",
  version: "Terrifying Snowman",
  fullName: "Marshmallow - Terrifying Snowman",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "004",
  text: "BEHEMOTH This character gets +1 {S} for each card in your hand.",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 1,
  cardNumber: 51,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b9b57c518d4487484cbb0f68ce8ace42b5dfc9e7",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { forEachCardInYourHand } from "@lorcanito/lorcana-engine/abilities/amounts";
// import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";
//
// export const marshmallowTerrifyingSnowman: LorcanitoCharacterCard = {
//   id: "np5",
//   missingTestCase: true,
//   name: "Marshmallow",
//   title: "Terrifying Snowman",
//   characteristics: ["storyborn", "ally"],
//   text: "**BEHEMOTH** This character gets +1 {S} for each card in your hand.",
//   type: "character",
//   abilities: [
//     propertyStaticAbilities({
//       name: "Behemoth",
//       text: "This character gets +1 {S} for each card in your hand.",
//       attribute: "strength",
//       amount: forEachCardInYourHand,
//     }),
//   ],
//   flavour: "You're very strong. Do you work out? −Olaf",
//   colors: ["amethyst"],
//   cost: 3,
//   willpower: 3,
//   strength: 0,
//   lore: 1,
//   illustrator: "Simone Buonfantion",
//   number: 51,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549442,
//   },
//   rarity: "uncommon",
// };
//
