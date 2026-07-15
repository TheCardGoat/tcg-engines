import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyMusketeer: CharacterCard = {
  abilities: [
    {
      id: "11w-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: "CHOSEN_CHARACTER",
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "11w-2",
      name: "AND TWO FOR TEA!",
      text: "AND TWO FOR TEA! When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 4,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  cost: 5,
  externalIds: {
    ravensburger: "88974b7ccdf603a29b402df56365c9ac1c82289f",
  },
  fullName: "Goofy - Musketeer",
  id: "11w",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Goofy",
  set: "001",
  strength: 3,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nAND TWO FOR TEA! When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
  version: "Musketeer",
  willpower: 6,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const goofyMusketeer: LorcanitoCharacterCard = {
//   Id: "vf3",
//   Name: "Goofy",
//   Title: "Musketeer",
//   Characteristics: ["hero", "dreamborn", "musketeer"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n**AND TWO FOR TEA!** When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
//   Type: "character",
//   Abilities: [
//     BodyguardAbility,
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "AND TWO FOR TEA",
//       Text: "When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 2,
//           UpTo: true,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
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
//   Flavour: "„En gawrsh!",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 5,
//   Strength: 3,
//   Willpower: 6,
//   Lore: 1,
//   Illustrator: "Jochem Van Gool",
//   Number: 4,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 501751,
//   },
//   Rarity: "uncommon",
// };
//
