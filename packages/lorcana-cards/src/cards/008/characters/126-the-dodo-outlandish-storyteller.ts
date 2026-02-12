import type { CharacterCard } from "@tcg/lorcana-types";

export const theDodoOutlandishStoryteller: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      id: "dac-1",
      text: "EXTRAORDINARY SITUATION This character gets +1 {S} for each 1 damage on him.",
      type: "static",
    },
  ],
  cardNumber: 126,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 3,
  externalIds: {
    ravensburger: "2fe3c2368d9375dae2898ac0160a32854bd5601b",
  },
  franchise: "Alice in Wonderland",
  fullName: "The Dodo - Outlandish Storyteller",
  id: "dac",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Dodo",
  set: "008",
  strength: 0,
  text: "EXTRAORDINARY SITUATION This character gets +1 {S} for each 1 damage on him.",
  version: "Outlandish Storyteller",
  willpower: 6,
};
