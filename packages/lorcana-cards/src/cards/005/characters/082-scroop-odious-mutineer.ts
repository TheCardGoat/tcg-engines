import type { CharacterCard } from "@tcg/lorcana-types";

export const scroopOdiousMutineer: CharacterCard = {
  id: "br6",
  cardType: "character",
  name: "Scroop",
  version: "Odious Mutineer",
  fullName: "Scroop - Odious Mutineer",
  inkType: ["emerald"],
  franchise: "Treasure Planet",
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nDO SAY HELLO TO MR. ARROW When you play this character, you may pay 3 {I} to banish chosen damaged character.",
  cost: 3,
  strength: 2,
  willpower: 1,
  lore: 2,
  cardNumber: 82,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2a5d939bc141ebe8540f3584cea9e8e2cb51fc57",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   BanishEffect,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const scroopOdiousMutineer: LorcanitoCharacterCard = {
//   id: "ig9",
//   name: "Scroop",
//   title: "Odious Mutineer",
//   characteristics: ["alien", "sorcerer", "villain", "pirate"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_ **DO SAY HELLO TO MR. ARROW** When you play this character, you may pay 3 {I} to banish chosen damaged character.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     {
//       type: "resolution",
//       name: "DO SAY HELLO TO MR. ARROW",
//       text: "When you play this character, you may pay 3 {I} to banish chosen damaged character.",
//       costs: [{ type: "ink", amount: 3 }],
//       optional: true,
//       effects: [
//         {
//           type: "banish",
//           target: chosenDamagedCharacter,
//         } as BanishEffect,
//       ],
//     },
//   ],
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 1,
//   lore: 2,
//   illustrator: "Justin Runfola",
//   number: 82,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561301,
//   },
//   rarity: "super_rare",
// };
//
