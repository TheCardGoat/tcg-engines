import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanMenacingPredator: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "1nj-1",
      name: "DON'T INSULT MY INTELLIGENCE",
      text: "DON'T INSULT MY INTELLIGENCE Whenever one of your characters challenges another character, gain 1 lore.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 104,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "d699b7284880df41462554acf1e1f68689fab0bd",
  },
  franchise: "Jungle Book",
  fullName: "Shere Khan - Menacing Predator",
  id: "1nj",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Shere Khan",
  set: "009",
  strength: 3,
  text: "DON'T INSULT MY INTELLIGENCE Whenever one of your characters challenges another character, gain 1 lore.",
  version: "Menacing Predator",
  willpower: 3,
};
