import type { CharacterCard } from "@tcg/lorcana-types";

export const puaProtectivePig: CharacterCard = {
  abilities: [
    {
      id: "1x6-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1x6-2",
      name: "FREE FRUIT",
      text: "FREE FRUIT When this character is banished, you may draw a card.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 19,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "f95af696db6076c101efb039fe76e600c045e3cd",
  },
  franchise: "Moana",
  fullName: "Pua - Protective Pig",
  id: "1x6",
  inkType: ["amber", "amethyst"],
  inkable: true,
  lore: 1,
  name: "Pua",
  set: "008",
  strength: 2,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nFREE FRUIT When this character is banished, you may draw a card.",
  version: "Protective Pig",
  willpower: 2,
};
