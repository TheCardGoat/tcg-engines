import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyEmeraldChampion: CharacterCard = {
  id: "bau",
  cardType: "character",
  name: "Goofy",
  version: "Emerald Champion",
  fullName: "Goofy - Emerald Champion",
  inkType: ["emerald"],
  set: "010",
  text: "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.\nPROVIDE COVER Your other Emerald characters gain Ward. (Opponents can't choose them except to challenge.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 91,
  inkable: false,
  externalIds: {
    ravensburger: "28bab6167da4c29d12d6021e7e28f3cf48449adb",
  },
  abilities: [
    {
      id: "bau-1",
      text: "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.",
      name: "EVEN THE SCORE",
      type: "triggered",
      trigger: {
        event: "banish-in-challenge",
        timing: "whenever",
        on: {
          controller: "you",
          excludeSelf: true,
        },
        defender: {
          controller: "you",
        },
      },
      effect: {
        type: "banish",
        target: {
          ref: "attacker",
        },
      },
    },
    {
      id: "bau-2",
      text: "PROVIDE COVER Your other Emerald characters gain Ward.",
      name: "PROVIDE COVER",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: {
          selector: "all",
          owner: "you",
          filter: [{ type: "source", ref: "other" }],
          count: "all",
        },
      },
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   gainAbilityWhileHere,
//   wardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverOneOfYourCharactersIsBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { banishChallengingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const goofyEmeraldChampion: LorcanitoCharacterCard = {
//   id: "s1r",
//   name: "Goofy",
//   title: "Emerald Champion",
//   characteristics: ["dreamborn", "hero"],
//   text: "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character. PROVIDE COVER Your other Emerald characters gain Ward. (Opponents can't choose them except to challenge.)",
//   type: "character",
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   illustrator: "Lisa Parfenova",
//   number: 91,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658463,
//   },
//   rarity: "rare",
//   abilities: [
//     wheneverOneOfYourCharactersIsBanishedInAChallenge({
//       name: "EVEN THE SCORE",
//       text: "Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.",
//       triggerFilter: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "color", value: "emerald" },
//         { filter: "source", value: "other" },
//       ],
//       effects: [banishChallengingCharacter],
//     }),
//     gainAbilityWhileHere({
//       name: "PROVIDE COVER",
//       text: "Your other Emerald characters gain Ward.",
//       ability: wardAbility,
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "color", value: "emerald" },
//         ],
//       },
//     }),
//   ],
//   lore: 2,
// };
//
