import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellShadowForm: CharacterCard = {
  abilities: [
    {
      id: "sma-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: "all",
            owner: "any",
            selector: "all",
            zones: ["play"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "sma-2",
      name: "DANCE OF DARKNESS",
      text: "DANCE OF DARKNESS When you play this character, you may return one of your other characters to your hand to draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 66,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 5,
  externalIds: {
    ravensburger: "67257d2a601938a9c43bb080208e5a3081a49939",
  },
  franchise: "Ducktales",
  fullName: "Magica De Spell - Shadow Form",
  id: "sma",
  inkType: ["amethyst", "emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Magica De Spell",
  set: "008",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nDANCE OF DARKNESS When you play this character, you may return one of your other characters to your hand to draw a card.",
  version: "Shadow Form",
  willpower: 3,
};
