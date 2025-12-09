import type { CharacterCard } from "@tcg/lorcana";

export const magicaDeSpellShadowForm: CharacterCard = {
  id: "sma",
  cardType: "character",
  name: "Magica De Spell",
  version: "Shadow Form",
  fullName: "Magica De Spell - Shadow Form",
  inkType: ["amethyst", "emerald"],
  franchise: "Ducktales",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nDANCE OF DARKNESS When you play this character, you may return one of your other characters to your hand to draw a card.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 66,
  inkable: false,
  externalIds: {
    ravensburger: "67257d2a601938a9c43bb080208e5a3081a49939",
  },
  abilities: [
    {
      id: "sma-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "sma-2",
      text: "DANCE OF DARKNESS When you play this character, you may return one of your other characters to your hand to draw a card.",
      name: "DANCE OF DARKNESS",
      type: "triggered",
      trigger: {
        event: "play",
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
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
