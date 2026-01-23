import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipVanquisherOfFoes: CharacterCard = {
  id: "1db",
  cardType: "character",
  name: "Prince Phillip",
  version: "Vanquisher of Foes",
  fullName: "Prince Phillip - Vanquisher of Foes",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "Shift 6 {I} (You may pay 6 {I} to play this on top of one of your characters named Prince Phillip.)\nEvasive (Only characters with Evasive can challenge this character.)\nSWIFT AND SURE When you play this character, banish all opposing damaged characters.",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 3,
  cardNumber: 73,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b1cbda0ae6f55030e3e718582adc878a6ebba693",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { princePhillipVanquisherOfFoes as ogPrincePhillipVanquisherOfFoes } from "@lorcanito/lorcana-engine/cards/004/characters/087-prince-phillip-vanquisher-of-foes";
//
// export const princePhillipVanquisherOfFoes: LorcanitoCharacterCard = {
//   ...ogPrincePhillipVanquisherOfFoes,
//   id: "wj7",
//   reprints: [ogPrincePhillipVanquisherOfFoes.id],
//   number: 73,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650015,
//   },
// };
//
