import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinHeroicOutlaw: CharacterCard = {
  id: "c0t",
  cardType: "character",
  name: "Aladdin",
  version: "Heroic Outlaw",
  fullName: "Aladdin - Heroic Outlaw",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 104,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
      id: "c0t-1",
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 2,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Floodborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import {
//   opponentLoseLore,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const aladdinHeroicOutlaw: LorcanitoCharacterCard = {
//   id: "c0t",
//   name: "Aladdin",
//   title: "Heroic Outlaw",
//   characteristics: ["hero", "floodborn"],
//   text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
//   type: "character",
//   abilities: [
//     wheneverBanishesAnotherCharacterInChallenge({
//       name: "Daring Exploit",
//       text: "During your turn, whenever this character banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
//       effects: [youGainLore(2), opponentLoseLore(2)],
//     }),
//     shiftAbility(5, "Aladdin"),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 7,
//   strength: 5,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Nicholas Kole",
//   number: 104,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492740,
//   },
//   rarity: "super_rare",
// };
//
