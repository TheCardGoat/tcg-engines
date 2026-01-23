import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenCrownOfTheCouncil: CharacterCard = {
  id: "vdv",
  cardType: "character",
  name: "The Queen",
  version: "Crown of the Council",
  fullName: "The Queen - Crown of the Council",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "005",
  text: "Ward (Opponents can't choose this character except to challenge.)\nGATHERER OF THE WICKED When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 148,
  inkable: false,
  externalIds: {
    ravensburger: "711db291586153124e70c559ba0991a638fc6d4f",
  },
  abilities: [
    {
      id: "vdv-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "vdv-2",
      type: "triggered",
      name: "GATHERER OF THE WICKED",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "GATHERER OF THE WICKED When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const theQueenCrownOfTheCouncil: LorcanitoCharacterCard = {
//   id: "lr0",
//   name: "The Queen",
//   title: "Crown of the Council",
//   characteristics: ["queen", "sorcerer", "storyborn", "villain"],
//   text: "**Ward** _(Opponents can’t choose this character except to challenge.)_<br/>**GATHERER OF THE WICKED** When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
//   type: "character",
//   abilities: [
//     wardAbility,
//     {
//       type: "resolution",
//       name: "GATHERER OF THE WICKED",
//       text: "When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
//       effects: [
//         {
//           type: "scry",
//           amount: 3,
//           shouldRevealTutored: true,
//           target: self,
//           mode: "bottom",
//           limits: {
//             bottom: 3,
//             top: 0,
//             inkwell: 0,
//             hand: 3,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//             {
//               filter: "attribute",
//               value: "name",
//               comparison: { operator: "eq", value: "The Queen" },
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Lava Hijzelaar / Ellie Horie",
//   number: 148,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561969,
//   },
//   rarity: "rare",
// };
//
