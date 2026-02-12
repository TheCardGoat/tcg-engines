import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaTheRightOne: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "gain-lore",
          amount: 3,
        },
        type: "optional",
      },
      id: "doc-1",
      name: "IF THE SLIPPER FITS",
      text: "IF THE SLIPPER FITS When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 15,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "314a16eb5a595cf0c7fefa00777939b5e367ef18",
  },
  franchise: "Cinderella",
  fullName: "Cinderella - The Right One",
  id: "doc",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Cinderella",
  set: "007",
  strength: 2,
  text: "IF THE SLIPPER FITS When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.",
  version: "The Right One",
  willpower: 4,
};
