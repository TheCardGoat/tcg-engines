import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaTheRightOne: CharacterCard = {
  id: "doc",
  cardType: "character",
  name: "Cinderella",
  version: "The Right One",
  fullName: "Cinderella - The Right One",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "007",
  text: "IF THE SLIPPER FITS When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 15,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "314a16eb5a595cf0c7fefa00777939b5e367ef18",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};
