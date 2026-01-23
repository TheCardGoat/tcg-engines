import type { CharacterCard } from "@tcg/lorcana-types";

export const jasperCommonCrook: CharacterCard = {
  id: "agw",
  cardType: "character",
  name: "Jasper",
  version: "Common Crook",
  fullName: "Jasper - Common Crook",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**PUPPYNAPPING** Whenever this character quests, chosen opposing character can",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 81,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const jasperCommonCrook: LorcanitoCharacterCard = {
//   id: "agw",
//   name: "Jasper",
//   title: "Common Crook",
//   characteristics: ["storyborn", "ally"],
//   text: "**PUPPYNAPPING** Whenever this character quests, chosen opposing character can't quest during their next turn.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Puppynapping",
//       text: "Whenever this character quests, chosen opposing character can't quest during their next turn.",
//       effects: [
//         {
//           type: "restriction",
//           restriction: "quest",
//           duration: "next_turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Now, look here, Horace, I warned you about thinkin.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Jochem Van Gool",
//   number: 81,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507498,
//   },
//   rarity: "uncommon",
// };
//
