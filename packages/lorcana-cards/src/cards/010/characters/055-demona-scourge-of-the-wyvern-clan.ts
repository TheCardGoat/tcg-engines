import type { CharacterCard } from "@tcg/lorcana-types";

export const demonaScourgeOfTheWyvernClan: CharacterCard = {
  id: "4nl",
  cardType: "character",
  name: "Demona",
  version: "Scourge of the Wyvern Clan",
  fullName: "Demona - Scourge of the Wyvern Clan",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "010",
  text: "AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 55,
  inkable: true,
  externalIds: {
    ravensburger: "10c766afc5fa9f94ef0c2ad708688e101324896c",
  },
  abilities: [
    {
      id: "4nl-1",
      text: "AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3.",
      name: "AD SAXUM COMMUTATE",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "all",
              owner: "opponent",
              count: "all",
            },
          },
          {
            type: "draw-until-hand-size",
            size: 3,
          },
        ],
      },
    },
    {
      id: "4nl-2",
      text: "STONE BY DAY If you have {d} or more cards in your hand, this character can't ready.",
      name: "STONE BY DAY",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "greater-or-equal",
        value: 0,
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Gargoyle", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { stoneByDayAbility } from "@lorcanito/lorcana-engine/cards/010/abilities/stoneByDay";
// import {
//   drawCardsUntilYouHaveXCardsInHand,
//   exertAllOpposingCharacters,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const demonaScourgeOfTheWyvernClan: LorcanitoCharacterCard = {
//   id: "max",
//   name: "Demona",
//   title: "Scourge of the Wyvern Clan",
//   characteristics: ["storyborn", "villain", "gargoyle", "sorcerer"],
//   text: "AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3. STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 6,
//   strength: 5,
//   willpower: 6,
//   illustrator: "Leonardo Giammichele",
//   number: 55,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 657887,
//   },
//   rarity: "legendary",
//   lore: 2,
//   abilities: [
//     stoneByDayAbility,
//     whenYouPlayThisCharacter({
//       name: "AD SAXUM COMMUTATE",
//       text: "When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3.",
//       effects: [
//         exertAllOpposingCharacters,
//         drawCardsUntilYouHaveXCardsInHand(3, self),
//         drawCardsUntilYouHaveXCardsInHand(3, opponent),
//       ],
//     }),
//   ],
// };
//
