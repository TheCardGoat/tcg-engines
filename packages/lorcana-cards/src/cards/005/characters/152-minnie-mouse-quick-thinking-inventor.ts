import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseQuickthinkingInventor: CharacterCard = {
  abilities: [
    {
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
      id: "1h2-1",
      name: "CAKE CATAPULT",
      text: "CAKE CATAPULT When you play this character, chosen character gets -2 {S} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 152,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Inventor"],
  cost: 1,
  externalIds: {
    ravensburger: "c0b4aae2229dabf0c8d5b00e3aeb6187d965ef0c",
  },
  fullName: "Minnie Mouse - Quick-Thinking Inventor",
  id: "1h2",
  inkType: ["sapphire"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Minnie Mouse",
  set: "005",
  strength: 1,
  text: "CAKE CATAPULT When you play this character, chosen character gets -2 {S} this turn.",
  version: "Quick-Thinking Inventor",
  willpower: 2,
};
