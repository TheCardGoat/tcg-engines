import type { CharacterCard } from "@tcg/lorcana-types";

export const chipRangerLeader: CharacterCard = {
  id: "1ue",
  cardType: "character",
  name: "Chip",
  version: "Ranger Leader",
  fullName: "Chip - Ranger Leader",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "THE VALUE OF FRIENDSHIP While you have a character named Dale in play, this character gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 12,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ef51cbc17715fb350e0780b289c630d1a5e5a916",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const chipRangerLeader: LorcanitoCharacterCard = {
//   id: "q8j",
//   name: "Chip",
//   title: "Ranger Leader",
//   characteristics: ["hero", "storyborn"],
//   text: "**THE VALUE OF FRIENDSHIP** While you have a character named Dale in play, this character gains **Support**. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
//   type: "character",
//   abilities: [
//     whileYouHaveACharacterNamedThisCharGains({
//       name: "THE VALUE OF FRIENDSHIP",
//       text: "While you have a character named Dale in play, this character gains **Support**. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
//       ability: supportAbility,
//       characterName: "Dale",
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "French Carlomagno",
//   number: 12,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578169,
//   },
//   rarity: "uncommon",
// };
//
