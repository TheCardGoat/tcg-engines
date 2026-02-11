import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinHeroicOutlaw: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 2,
        },
        chooser: "CONTROLLER",
      },
      id: "c0t-1",
      text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
      type: "action",
    },
  ],
  cardNumber: 104,
  cardType: "character",
  classifications: ["Hero", "Floodborn"],
  cost: 7,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Aladdin - Heroic Outlaw",
  id: "c0t",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  name: "Aladdin",
  set: "001",
  strength: 5,
  text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
  version: "Heroic Outlaw",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import {
//   OpponentLoseLore,
//   YouGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const aladdinHeroicOutlaw: LorcanitoCharacterCard = {
//   Id: "c0t",
//   Name: "Aladdin",
//   Title: "Heroic Outlaw",
//   Characteristics: ["hero", "floodborn"],
//   Text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
//   Type: "character",
//   Abilities: [
//     WheneverBanishesAnotherCharacterInChallenge({
//       Name: "Daring Exploit",
//       Text: "During your turn, whenever this character banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
//       Effects: [youGainLore(2), opponentLoseLore(2)],
//     }),
//     ShiftAbility(5, "Aladdin"),
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 7,
//   Strength: 5,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Nicholas Kole",
//   Number: 104,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492740,
//   },
//   Rarity: "super_rare",
// };
//
