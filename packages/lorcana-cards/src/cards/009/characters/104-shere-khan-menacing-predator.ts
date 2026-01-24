import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanMenacingPredator: CharacterCard = {
  id: "1nj",
  cardType: "character",
  name: "Shere Khan",
  version: "Menacing Predator",
  fullName: "Shere Khan - Menacing Predator",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "009",
  text: "DON'T INSULT MY INTELLIGENCE Whenever one of your characters challenges another character, gain 1 lore.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 104,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d699b7284880df41462554acf1e1f68689fab0bd",
  },
  abilities: [
    {
      id: "1nj-1",
      type: "triggered",
      name: "DON'T INSULT MY INTELLIGENCE",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "DON'T INSULT MY INTELLIGENCE Whenever one of your characters challenges another character, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
