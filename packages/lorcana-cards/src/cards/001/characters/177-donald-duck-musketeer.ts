import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckMusketeer: CharacterCard = {
  abilities: [
    {
      id: "1te-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
      },
      id: "1te-2",
      name: "STAY ALERT!",
      text: "STAY ALERT! During your turn, your Musketeer characters gain Evasive.",
      type: "static",
    },
  ],
  cardNumber: 177,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  cost: 4,
  externalIds: {
    ravensburger: "eb0f321c8ffffb426862310ebc9a55e6e2d2d5df",
  },
  fullName: "Donald Duck - Musketeer",
  id: "1te",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Donald Duck",
  set: "001",
  strength: 2,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSTAY ALERT! During your turn, your Musketeer characters gain Evasive. (They can challenge characters with Evasive.)",
  version: "Musketeer",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   BodyguardAbility,
//   EvasiveAbility,
//   Type GainAbilityStaticAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const donaldDuckMusketeer: LorcanitoCharacterCard = {
//   Id: "xnp",
//   Name: "Donald Duck",
//   Title: "Musketeer",
//   Characteristics: ["hero", "dreamborn", "musketeer"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n**STAY ALERT!** During your turn, your Musketeer characters gain **Evasive.** _(They can challenge characters with Evasive.)_",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "gain-ability",
//       Name: "Stay Alert!",
//       Text: "During your turn, your Musketeer characters gain **Evasive.** _(They can challenge characters with Evasive.)_",
//       GainedAbility: evasiveAbility,
//       Conditions: [{ type: "during-turn", value: "self" }],
//       Target: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           { filter: "characteristics", value: ["musketeer"] },
//         ],
//       },
//     } as GainAbilityStaticAbility,
//     BodyguardAbility,
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Dav Augereau / Guykua Ruva",
//   Number: 177,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508907,
//   },
//   Rarity: "uncommon",
// };
//
