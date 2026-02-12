import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelWitheredAndWicked: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "6fh-1",
      name: "WHAT HAVE YOU DONE?!",
      text: "WHAT HAVE YOU DONE?! This character enters play with 3 damage.",
      type: "static",
    },
  ],
  cardNumber: 116,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 2,
  externalIds: {
    ravensburger: "172cf927696b8d203e6d1c4b97a9f06fe6a3d4f4",
  },
  franchise: "Tangled",
  fullName: "Mother Gothel - Withered and Wicked",
  id: "6fh",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mother Gothel",
  set: "002",
  strength: 3,
  text: "WHAT HAVE YOU DONE?! This character enters play with 3 damage.",
  version: "Withered and Wicked",
  willpower: 4,
};
