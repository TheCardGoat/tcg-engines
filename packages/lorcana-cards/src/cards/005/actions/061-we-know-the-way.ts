import type { ActionCard } from "@tcg/lorcana-types";

export const weKnowTheWay: ActionCard = {
  id: "3jr",
  cardType: "action",
  name: "We Know the Way",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "005",
  text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 61,
  inkable: true,
  externalIds: {
    ravensburger: "0cca9fb008e3df3430585d8838427da91697bdd4",
  },
  abilities: [
    {
      id: "3jr-1",
      text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "shuffle-into-deck",
            target: {
              selector: "chosen",
              filter: [{ type: "zone", zone: "discard" }],
              count: 1,
            },
          },
          {
            type: "reveal-top-card",
            target: "CONTROLLER",
          },
          {
            type: "conditional",
            condition: {
              type: "revealed-matches-named",
            },
            then: {
              type: "optional",
              effect: {
                type: "play-card",
                from: "deck",
                cost: "free",
              },
            },
            else: {
              type: "return-to-hand",
              target: { ref: "previous-target" },
            },
          },
        ],
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   LorcanitoActionCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// import {
//   thisCharacter,
//   topCardOfYourDeck,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import type {
//   RevealTopCardEffect,
//   ShuffleEffect,
// } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const targetWithSameName: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "owner", value: "self" },
//     {
//       filter: "top-deck",
//       value: "self",
//     },
//     {
//       filter: "attribute",
//       value: "name",
//       compareWithParentsTarget: true,
//       comparison: { operator: "eq", value: "target" },
//     },
//   ],
// };
//
// const revealTopCardAndPlay: RevealTopCardEffect = {
//   type: "reveal-top-card",
//   target: targetWithSameName,
//   useParentsTarget: true,
//   asOptionalLayer: true,
//   onTargetMatchEffects: [
//     {
//       type: "play",
//       forFree: true,
//       target: targetWithSameName,
//     },
//   ],
//   onTargetMatchFailureEffects: [
//     {
//       type: "move",
//       to: "hand",
//       target: topCardOfYourDeck,
//     },
//   ],
// };
//
// const shuffleFromDiscard: ShuffleEffect = {
//   type: "shuffle",
//   target: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "owner", value: "self" },
//       { filter: "zone", value: "discard" },
//     ],
//   },
//   afterEffect: [
//     {
//       type: "create-layer-based-on-target",
//       target: thisCharacter,
//       effects: [revealTopCardAndPlay],
//     },
//   ],
// };
//
// const weKnowTheWayAbility: ResolutionAbility = {
//   type: "resolution",
//   text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
//   effects: [shuffleFromDiscard],
// };
//
// export const weKnowTheWay: LorcanitoActionCard = {
//   id: "tc8",
//   name: "We Know The Way",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 3 or more can  {E} to sing this song for free.)_ Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
//   type: "action",
//   abilities: [weKnowTheWayAbility],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Jake Murphy",
//   number: 61,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560658,
//   },
//   rarity: "rare",
// };
//
