import type { ActionCard } from "@tcg/lorcana-types";

export const energyBlast: ActionCard = {
  id: "1j8",
  cardType: "action",
  name: "Energy Blast",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  text: "Banish chosen character. Draw a card.",
  cost: 7,
  cardNumber: 131,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c679d181159ab4450f19fa0e4f60c90439382f17",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   drawACard,
//   mayBanish,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const energyBlast: LorcanitoActionCard = {
//   id: "e8s",
//   name: "Energy Blast",
//   characteristics: ["action"],
//   text: "Banish chosen character. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       resolveEffectsIndividually: true,
//       effects: [mayBanish(chosenCharacter), drawACard],
//     },
//   ],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 7,
//   strength: 0,
//   illustrator: "Marco Giorgini",
//   number: 131,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591982,
//   },
//   rarity: "rare",
// };
//
