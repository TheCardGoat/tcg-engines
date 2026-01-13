import type { CharacterCard } from "@tcg/lorcana-types";

export const tadashiHamadaGiftedRoboticist: CharacterCard = {
  id: "36l",
  cardType: "character",
  name: "Tadashi Hamada",
  version: "Gifted Roboticist",
  fullName: "Tadashi Hamada - Gifted Roboticist",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 155,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0b792081c2b89fd31e4a7614861b132820260595",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import {
//   putThisCardIntoYourInkwellExerted,
//   putTopCardOfYourDeckIntoYourInkwellExerted,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const tadashiHamadaGiftedRoboticist: LorcanitoCharacterCard = {
//   id: "aab",
//   missingTestCase: true,
//   name: "Tadashi Hamada",
//   title: "Gifted Roboticist",
//   characteristics: ["storyborn", "mentor", "inventor"],
//   text: "SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "Someone Has To Help",
//       text: "During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.",
//       conditions: [{ type: "during-turn", value: "opponent" }],
//       optional: true,
//       effects: [
//         putThisCardIntoYourInkwellExerted,
//         putTopCardOfYourDeckIntoYourInkwellExerted,
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Aliseth Zermeno",
//   number: 155,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588328,
//   },
//   rarity: "rare",
// };
//
