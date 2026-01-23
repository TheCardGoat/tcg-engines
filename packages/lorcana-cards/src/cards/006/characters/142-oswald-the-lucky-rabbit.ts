import type { CharacterCard } from "@tcg/lorcana-types";

export const oswaldTheLuckyRabbit: CharacterCard = {
  id: "tu2",
  cardType: "character",
  name: "Oswald",
  version: "The Lucky Rabbit",
  fullName: "Oswald - The Lucky Rabbit",
  inkType: ["sapphire"],
  set: "006",
  text: "FAVORABLE CHANCE During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it’s an item card, you may play that item for free and it enters play exerted. Otherwise, put it on the bottom of your deck.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  cardNumber: 142,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6b871e4973f6b230175cf0b121338b49c07804fe",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { revealTopOfDeckPutInPlayOrDeck } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const oswaldTheLuckyRabbit: LorcanitoCharacterCard = {
//   id: "rrw",
//   name: "Oswald",
//   title: "The Lucky Rabbit",
//   characteristics: ["storyborn", "hero"],
//   text: "FAVORABLE CHANCE During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it's an item card, you may play that item for free and they enter play exerted. Otherwise put it on the bottom of your deck.",
//   type: "character",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Favorable Chance",
//       text: "During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it's an item card, you may play that item for free and they enter play exerted. Otherwise put it on the bottom of your deck.",
//       conditions: [{ type: "during-turn", value: "self" }],
//       optional: true,
//       resolveEffectsIndividually: true,
//       effects: revealTopOfDeckPutInPlayOrDeck({
//         mode: "bottom",
//         tutorFilters: [
//           { filter: "zone", value: "deck" },
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "item" },
//         ],
//         playFilters: [{ filter: "type", value: "item" }],
//       }),
//     }),
//   ],
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 1,
//   lore: 2,
//   illustrator: "Tom Bancroft / Kristen Breshears",
//   number: 142,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 579933,
//   },
//   rarity: "legendary",
// };
//
