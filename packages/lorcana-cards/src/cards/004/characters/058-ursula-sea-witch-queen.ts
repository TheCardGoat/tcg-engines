import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaSeaWitchQueen: CharacterCard = {
  id: "ay4",
  cardType: "character",
  name: "Ursula",
  version: "Sea Witch Queen",
  fullName: "Ursula - Sea Witch Queen",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Ursula.)\nNOW I AM THE RULER! Whenever this character quests, exert chosen character.\nYOU'LL LISTEN TO ME! Other characters can't exert to sing songs.",
  cost: 7,
  strength: 4,
  willpower: 7,
  lore: 3,
  cardNumber: 58,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "27753ec5988e180c10bd43600c45c2fb844dd27f",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   otherCharacterGains,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { exertChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ursulaSeaWitchQueen: LorcanitoCharacterCard = {
//   id: "k0n",
//   name: "Ursula",
//   title: "Sea Witch Queen",
//   characteristics: ["floodborn", "queen", "sorcerer", "villain"],
//   text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Ursula.)_\n\n\n**NOW I'M THE RULER** Whenever this character quests, exert chosen character.\n\n\n**YOU'LL LISTEN TO ME!** Other characters can't exert to sing songs.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "ursula"),
//     wheneverQuests({
//       name: "NOW I'M THE RULER",
//       text: "Whenever this character quests, exert chosen character",
//       effects: [exertChosenCharacter],
//     }),
//     otherCharacterGains({
//       name: "YOU'LL LISTEN TO ME!",
//       text: "Other characters can't exert to sing songs.",
//       gainedAbility: {
//         type: "static",
//         ability: "voiceless",
//       },
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 7,
//   strength: 4,
//   willpower: 7,
//   lore: 3,
//   illustrator: "Lady Shalvin",
//   number: 58,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550529,
//   },
//   rarity: "legendary",
// };
//
