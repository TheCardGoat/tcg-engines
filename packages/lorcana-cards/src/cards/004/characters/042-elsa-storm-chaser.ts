import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaStormChaser: CharacterCard = {
  id: "ih5",
  cardType: "character",
  name: "Elsa",
  version: "Storm Chaser",
  fullName: "Elsa - Storm Chaser",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "004",
  text: "TEMPEST {E} — Chosen character gains Challenger +2 and Rush this turn. (They get +2 {S} while challenging. They can challenge the turn they're played.)",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 42,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "4297327bb398ea35bc56d33043916d26c0135202",
  },
  abilities: [
    {
      id: "ih5-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 2,
        duration: "this-turn",
      },
      text: "TEMPEST {E} — Chosen character gains Challenger +2 and Rush this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
};
