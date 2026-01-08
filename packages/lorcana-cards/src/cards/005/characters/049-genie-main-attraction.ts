import type { CharacterCard } from "@tcg/lorcana-types";

export const genieMainAttraction: CharacterCard = {
  id: "1ia",
  cardType: "character",
  name: "Genie",
  version: "Main Attraction",
  fullName: "Genie - Main Attraction",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  text: "PHENOMENAL SHOWMAN While this character is exerted, opposing characters can't ready at the start of their turn.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 49,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c3a3e22a3dc8e185181d63b0572644983c11e23a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const genieMainAttraction: LorcanitoCharacterCard = {
//   id: "a9u",
//   name: "Genie",
//   title: "Main Attraction",
//   characteristics: ["storyborn", "ally"],
//   text: "**SPECTACULAR ENTERTAINER** When this character is exerted, opposing characters cannot ready at the start of your opponents turn.",
//   type: "character",
//   // IMPLEMENTED IN THE ENGINE ITSELF
//   // abilities: [
//   //   {
//   //     ...chosenExertedCharacterCantReadyWhileThisIsInPlace,
//   //     name: "Spectacular Entertainer",
//   //     text: "When this character is exerted, opposing characters cannot ready at the start of your opponents turn.",
//   //   },
//   // ],
//   flavour: "Watch carefully! It's time for a little deception!",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 7,
//   strength: 5,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Brian Kesinger",
//   number: 49,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561953,
//   },
//   rarity: "legendary",
// };
//
