import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaStormChaser: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "ih5-1",
      text: "TEMPEST {E} — Chosen character gains Challenger +2 and Rush this turn.",
      type: "activated",
    },
  ],
  cardNumber: 42,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "4297327bb398ea35bc56d33043916d26c0135202",
  },
  franchise: "Frozen",
  fullName: "Elsa - Storm Chaser",
  id: "ih5",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Elsa",
  set: "004",
  strength: 1,
  text: "TEMPEST {E} — Chosen character gains Challenger +2 and Rush this turn. (They get +2 {S} while challenging. They can challenge the turn they're played.)",
  version: "Storm Chaser",
  willpower: 4,
};
