import type { CharacterCard } from "@tcg/lorcana-types";

export const maxGoofChartTopper: CharacterCard = {
  id: "iz6",
  cardType: "character",
  name: "Max Goof",
  version: "Chart Topper",
  fullName: "Max Goof - Chart Topper",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Max Goof.)\nNUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 77,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4464e161e9005aebccdd3136b9446adeb92d8d6d",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   LorcanitoCharacterCard,
//   PlayEffect,
// } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// const songFromDiscard: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "owner", value: "self" },
//     { filter: "zone", value: "discard" },
//     { filter: "characteristics", value: ["song"] },
//     {
//       filter: "attribute",
//       value: "cost",
//       ignoreBonuses: true,
//       comparison: { operator: "lte", value: 4 },
//     },
//   ],
// };
//
// const playEffect: PlayEffect = {
//   type: "play",
//   forFree: true,
//   bottomCardAfterPlaying: true,
//   target: songFromDiscard,
// };
//
// export const maxGoofChartTopper: LorcanitoCharacterCard = {
//   id: "o1c",
//   missingTestCase: false,
//   name: "Max Goof",
//   title: "Chart Topper",
//   characteristics: ["floodborn", "hero"],
//   text: "Shift 4\nNUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 4,
//   willpower: 5,
//   illustrator: "Max Ulrichney",
//   number: 77,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649228,
//   },
//   rarity: "legendary",
//   abilities: [
//     shiftAbility(4, "Max Goof"),
//     wheneverThisCharacterQuests({
//       name: "NUMBER ONE HIT",
//       text: "Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.",
//       optional: true,
//       effects: [playEffect],
//     }),
//   ],
//   lore: 2,
// };
//
