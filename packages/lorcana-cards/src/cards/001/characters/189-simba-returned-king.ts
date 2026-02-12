import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaReturnedKing: CharacterCard = {
  abilities: [
    {
      id: "nj8-1",
      keyword: "Challenger",
      text: "Challenger +4",
      type: "keyword",
      value: 4,
    },
    {
      effect: {
        duration: "this-turn",
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "nj8-2",
      name: "POUNCE",
      text: "POUNCE During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  cardNumber: 189,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "King"],
  cost: 7,
  externalIds: {
    ravensburger: "54d1da804f89e6da94d1e9a335acf6a5baa79ff5",
  },
  franchise: "Lion King",
  fullName: "Simba - Returned King",
  id: "nj8",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Simba",
  set: "001",
  strength: 4,
  text: "Challenger +4 (While challenging, this character gets +4 {S}.)\nPOUNCE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Returned King",
  willpower: 6,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   ChallengerAbility,
//   DuringYourTurnGains,
//   EvasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const simbaReturnedKing: LorcanitoCharacterCard = {
//   Id: "hgu",
//   Name: "Simba",
//   Title: "Returned King",
//   Characteristics: ["hero", "storyborn", "king"],
//   Text: "**Challenger** +4 (While challenging, this character gets\r+4 {S}.)\n**POUNCE** During your turn, this character gains \r**Evasive**. _(They can challenge characters with Evasive.)_",
//   Type: "character",
//   Abilities: [
//     ChallengerAbility(4),
//     DuringYourTurnGains(
//       "Pounce",
//       "During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
//       EvasiveAbility,
//     ),
//   ],
//   Flavour: "„I‘ll do whatever it takes to save my kingdom.",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 7,
//   Strength: 4,
//   Willpower: 6,
//   Lore: 2,
//   Illustrator: "Nicholas Kole",
//   Number: 189,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492741,
//   },
//   Rarity: "rare",
// };
//
