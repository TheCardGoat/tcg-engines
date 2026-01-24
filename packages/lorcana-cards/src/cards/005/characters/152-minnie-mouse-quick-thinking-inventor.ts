import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseQuickthinkingInventor: CharacterCard = {
  id: "1h2",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Quick-Thinking Inventor",
  fullName: "Minnie Mouse - Quick-Thinking Inventor",
  inkType: ["sapphire"],
  set: "005",
  text: "CAKE CATAPULT When you play this character, chosen character gets -2 {S} this turn.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 152,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c0b4aae2229dabf0c8d5b00e3aeb6187d965ef0c",
  },
  abilities: [
    {
      id: "1h2-1",
      type: "triggered",
      name: "CAKE CATAPULT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "CAKE CATAPULT When you play this character, chosen character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Inventor"],
};
