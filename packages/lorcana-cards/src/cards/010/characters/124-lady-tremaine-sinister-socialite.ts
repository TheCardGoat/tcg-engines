import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineSinisterSocialite: CharacterCard = {
  id: "a1d",
  cardType: "character",
  name: "Lady Tremaine",
  version: "Sinister Socialite",
  fullName: "Lady Tremaine - Sinister Socialite",
  inkType: ["ruby"],
  franchise: "Cinderella",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nEXPEDIENT SCHEMES Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 124,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "242d9e84ef714b95089283f0534b5f2a23b01f50",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   LorcanitoCharacterCard,
//   PlayEffect,
// } from "@lorcanito/lorcana-engine";
// import { boostAbility } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// const actionWithCostFiveOrLess: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "type", value: "action" },
//     { filter: "zone", value: "discard" },
//     { filter: "owner", value: "self" },
//     {
//       filter: "attribute",
//       value: "cost",
//       comparison: { operator: "lte", value: 5 },
//     },
//   ],
// };
//
// const playEffect: PlayEffect = {
//   type: "play",
//   forFree: true,
//   bottomCardAfterPlaying: true,
//   target: actionWithCostFiveOrLess,
// };
//
// export const ladyTremaineSinisterSocialite: LorcanitoCharacterCard = {
//   id: "pz6",
//   name: "Lady Tremaine",
//   title: "Sinister Socialite",
//   characteristics: ["storyborn", "villain", "whisper"],
//   text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nEXPEDIENT SCHEMES Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.",
//   type: "character",
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 5,
//   willpower: 4,
//   illustrator: "Mariana Moreno",
//   number: 124,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658881,
//   },
//   rarity: "super_rare",
//   lore: 2,
//   abilities: [
//     boostAbility(2),
//     wheneverQuests({
//       name: "EXPEDIENT SCHEMES",
//       text: "Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.",
//       optional: true,
//       conditions: [
//         {
//           type: "has-put-a-card-under-this-turn",
//         },
//       ],
//       effects: [playEffect],
//     }),
//   ],
// };
//
