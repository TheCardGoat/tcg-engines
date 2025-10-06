import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const genieMainAttraction: LorcanaCharacterCardDefinition = {
  id: "a9u",
  name: "Genie",
  title: "Main Attraction",
  characteristics: ["storyborn", "ally"],
  text: "**SPECTACULAR ENTERTAINER** When this character is exerted, opposing characters cannot ready at the start of your opponents turn.",
  type: "character",
  // IMPLEMENTED IN THE ENGINE ITSELF
  // abilities: [
  //   {
  //     ...chosenExertedCharacterCantReadyWhileThisIsInPlace,
  //     name: "Spectacular Entertainer",
  //     text: "When this character is exerted, opposing characters cannot ready at the start of your opponents turn.",
  //   },
  // ],
  flavour: "Watch carefully! It's time for a little deception!",
  inkwell: true,
  colors: ["amethyst"],
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "Brian Kesinger",
  number: 49,
  set: "SSK",
  rarity: "legendary",
};
