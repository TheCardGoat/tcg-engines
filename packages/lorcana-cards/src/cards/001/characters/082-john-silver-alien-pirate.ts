import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverAlienPirate: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "a8j-1",
      text: "**PICK YOUR FIGHTS** When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can",
      type: "action",
    },
  ],
  cardNumber: 82,
  cardType: "character",
  classifications: ["Alien", "Storyborn", "Villain", "Pirate", "Captain"],
  cost: 6,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "John Silver - Alien Pirate",
  id: "a8j",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  name: "John Silver",
  set: "001",
  strength: 5,
  text: "**PICK YOUR FIGHTS** When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can",
  version: "Alien Pirate",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const johnSilverAlienPirate: LorcanitoCharacterCard = {
//   Id: "a8j",
//   Reprints: ["hsz"],
//
//   Name: "John Silver",
//   Title: "Alien Pirate",
//   Characteristics: ["alien", "storyborn", "villain", "pirate", "captain"],
//   Text: "**PICK YOUR FIGHTS** When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//   Type: "character",
//   Abilities: whenPlayAndWheneverQuests({
//     Name: "Pick Your Fights",
//     Text: "When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//     Effects: [
//       {
//         Type: "ability",
//         Ability: "reckless",
//         Modifier: "add",
//         Duration: "next_turn",
//         Target: {
//           Type: "card",
//           Value: 1,
//           Filters: [
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "opponent" },
//             { filter: "type", value: "character" },
//           ],
//         },
//       },
//     ],
//   }),
//   Flavour: "Don't be too put off by this . . . hunk of hardware.",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 6,
//   Strength: 5,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Jared Nickerl",
//   Number: 82,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507476,
//   },
//   Rarity: "legendary",
// };
//
