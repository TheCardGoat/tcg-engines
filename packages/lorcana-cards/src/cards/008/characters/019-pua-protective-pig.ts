import type { CharacterCard } from "@tcg/lorcana";

export const puaProtectivePig: CharacterCard = {
  id: "1x6",
  cardType: "character",
  name: "Pua",
  version: "Protective Pig",
  fullName: "Pua - Protective Pig",
  inkType: ["amber", "amethyst"],
  franchise: "Moana",
  set: "008",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nFREE FRUIT When this character is banished, you may draw a card.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 19,
  inkable: true,
  externalIds: {
    ravensburger: "f95af696db6076c101efb039fe76e600c045e3cd",
  },
  abilities: [
    {
      id: "1x6-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "1x6-2",
      text: "FREE FRUIT When this character is banished, you may draw a card.",
      name: "FREE FRUIT",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
