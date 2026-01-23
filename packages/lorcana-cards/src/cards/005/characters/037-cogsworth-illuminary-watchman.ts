import type { CharacterCard } from "@tcg/lorcana-types";

export const cogsworthIlluminaryWatchman: CharacterCard = {
  id: "1n5",
  cardType: "character",
  name: "Cogsworth",
  version: "Illuminary Watchman",
  fullName: "Cogsworth - Illuminary Watchman",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "005",
  text: "TIME TO MOVE IT! When you play this character, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 37,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d53b466012ff4e0996263ae54a024db42cbfed5b",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AbilityEffect,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const cogsworthIlluminaryWatchman: LorcanitoCharacterCard = {
//   id: "xha",
//   missingTestCase: true,
//   name: "Cogsworth",
//   title: "Illuminary Watchman",
//   characteristics: ["dreamborn", "ally"],
//   text: "**TIME TO MOVE IT!** When you play this character, chosen character gains **Rush** this turn. _(They can challenge the turn they’re played.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "**TIME TO MOVE IT!**",
//       text: "When you play this character, chosen character gains **Rush** this turn. _(They can challenge the turn they’re played.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "rush",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   flavour: "Step to it! Time is of the essence.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 1,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 37,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561610,
//   },
//   rarity: "common",
// };
//
