import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellConnivingSorceress: CharacterCard = {
  id: "x7f",
  cardType: "character",
  name: "Magica De Spell",
  version: "Conniving Sorceress",
  fullName: "Magica De Spell - Conniving Sorceress",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "Shift 7 {I} (You may pay 7 {I} to play this on top of one of your characters named Magica De Spell.)\nSHADOW'S GRASP When you play this character, if you used Shift to play her, you may draw 4 cards.",
  cost: 7,
  strength: 7,
  willpower: 7,
  lore: 1,
  cardNumber: 54,
  inkable: false,
  externalIds: {
    ravensburger: "77add645cd869348da0863c0ae18e4d8b4702127",
  },
  abilities: [
    {
      id: "x7f-1",
      text: "Shift 7 {I}",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 7,
      },
    },
    {
      id: "x7f-2",
      text: "SHADOW'S GRASP When you play this character, if you used Shift to play her, you may draw 4 cards.",
      name: "SHADOW'S GRASP",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "used-shift",
        },
        then: {
          type: "draw",
          amount: 4,
          target: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
};
