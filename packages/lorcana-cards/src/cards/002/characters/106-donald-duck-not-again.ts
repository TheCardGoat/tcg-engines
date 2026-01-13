import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckNotAgain: CharacterCard = {
  id: "1mm",
  cardType: "character",
  name: "Donald Duck",
  version: "Not Again!",
  fullName: "Donald Duck - Not Again!",
  inkType: ["ruby"],
  set: "002",
  franchise: "Mickey Mouse & Friends",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPHOOEY! This character gets +1 {L} for each 1 damage on him.",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 106,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d130a56e0f8c8813f9fae0f025c3b78620f2fc45",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const donaldDuckNotAgain: LorcanitoCharacterCard = {
//   id: "adi",
//   name: "Donald Duck",
//   title: "Not Again!",
//   characteristics: ["hero", "dreamborn"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHOOEY!** This character gets +1 {L} for each 1 damage on him.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     wheneverQuests({
//       name: "PHOOEY!",
//       text: "This character gets +1 {L} for each 1 damage on him.",
//       effects: [youGainLore({ dynamic: true, sourceAttribute: "damage" })],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 1,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Carmine Pucci / Leonardo Giammichele",
//   number: 106,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527754,
//   },
//   rarity: "legendary",
// };
//
