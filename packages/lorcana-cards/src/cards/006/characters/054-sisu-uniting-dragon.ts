import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuUnitingDragon: CharacterCard = {
  id: "ojg",
  cardType: "character",
  name: "Sisu",
  version: "Uniting Dragon",
  fullName: "Sisu - Uniting Dragon",
  inkType: ["amethyst"],
  franchise: "Raya and the Last Dragon",
  set: "006",
  text: "TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 54,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "587243dff13c71d2996bab2b8c17b82e1f0179ae",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { revealTopOfDeckPutInHandOrDeck } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const sisuUnitingDragon: LorcanitoCharacterCard = {
//   id: "kkq",
//   name: "Sisu",
//   title: "Uniting Dragon",
//   characteristics: ["storyborn", "hero", "deity", "dragon"],
//   text: "TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Trust Builds Trust",
//       text: "Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.",
//       effects: revealTopOfDeckPutInHandOrDeck({
//         mode: "bottom",
//         tutorFilters: [
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: ["dragon"] },
//           { filter: "owner", value: "self" },
//         ],
//         onTargetMatchEffects: [
//           {
//             type: "create-layer-based-on-target",
//             filters: [{ filter: "characteristics", value: ["dragon"] }],
//             // TODO: get rid of target
//             target: thisCharacter,
//             effects: revealTopOfDeckPutInHandOrDeck({
//               mode: "bottom",
//               tutorFilters: [
//                 { filter: "type", value: "character" },
//                 { filter: "characteristics", value: ["dragon"] },
//                 { filter: "owner", value: "self" },
//               ],
//             }),
//           },
//         ],
//       }),
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Shannon Hallstein",
//   number: 54,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591978,
//   },
//   rarity: "super_rare",
// };
//
