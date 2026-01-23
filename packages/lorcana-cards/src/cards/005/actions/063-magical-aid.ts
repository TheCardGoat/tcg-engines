import type { ActionCard } from "@tcg/lorcana-types";

export const magicalAid: ActionCard = {
  id: "6tm",
  cardType: "action",
  name: "Magical Aid",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  text: "Chosen character gains Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +3 {S} while challenging.)",
  cost: 3,
  cardNumber: 63,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "18972399651ab2488a78e778fd0a9da89decc429",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacterGainsChallengerX,
//   chosenCharacterGainsWhenBanishedReturnToHand,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const magicalAid: LorcanitoActionCard = {
//   id: "sx8",
//   name: "Magical Aid",
//   characteristics: ["action"],
//   text: "Chosen character gains **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn. _(They get +3 {S} while challenging.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Magical Aid",
//       text: "Chosen character gains **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn. _(They get +3 {S} while challenging.)_",
//       effects: [
//         chosenCharacterGainsChallengerX(3),
//         chosenCharacterGainsWhenBanishedReturnToHand,
//       ],
//     },
//   ],
//   flavour: "You’ve got some power in your corner now!\n— Genie",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   illustrator: "Luca Pinelli",
//   number: 63,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561627,
//   },
//   rarity: "uncommon",
// };
//
