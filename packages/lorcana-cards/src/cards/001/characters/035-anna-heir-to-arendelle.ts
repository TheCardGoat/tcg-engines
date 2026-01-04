import type { CharacterCard } from "@tcg/lorcana-types";

export const annaheirToArendelle: CharacterCard = {
  id: "ibd",
  cardType: "character",
  name: "Anna",
  version: "Heir to Arendelle",
  fullName: "Anna - Heir to Arendelle",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**LOVING HEART** When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 35,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**LOVING HEART** When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn",
      id: "ibd-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Hero", "Queen", "Storyborn"],
};
