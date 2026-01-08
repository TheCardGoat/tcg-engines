import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyMusketeer: CharacterCard = {
  id: "11w",
  cardType: "character",
  name: "Goofy",
  version: "Musketeer",
  fullName: "Goofy - Musketeer",
  inkType: ["amber"],
  set: "001",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nAND TWO FOR TEA! When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 1,
  cardNumber: 4,
  inkable: true,
  externalIds: {
    ravensburger: "88974b7ccdf603a29b402df56365c9ac1c82289f",
  },
  abilities: [
    {
      id: "11w-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "11w-2",
      text: "AND TWO FOR TEA! When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
      name: "AND TWO FOR TEA!",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
          upTo: true,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const goofyMusketeer: LorcanitoCharacterCard = {
//   id: "vf3",
//   name: "Goofy",
//   title: "Musketeer",
//   characteristics: ["hero", "dreamborn", "musketeer"],
//   text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n**AND TWO FOR TEA!** When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
//   type: "character",
//   abilities: [
//     bodyguardAbility,
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "AND TWO FOR TEA",
//       text: "When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
//       optional: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "characteristics", value: ["musketeer"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "„En gawrsh!",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 3,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Jochem Van Gool",
//   number: 4,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 501751,
//   },
//   rarity: "uncommon",
// };
//
