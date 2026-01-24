import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckDaisysDate: CharacterCard = {
  id: "1d9",
  cardType: "character",
  name: "Donald Duck",
  version: "Daisy's Date",
  fullName: "Donald Duck - Daisy's Date",
  inkType: ["ruby"],
  set: "005",
  text: "PLUCKY PLAY Whenever this character challenges another character, each opponent loses 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 122,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b19631e75285a54e5b0d403510612154cb7cd88f",
  },
  abilities: [
    {
      id: "1d9-1",
      type: "triggered",
      name: "PLUCKY PLAY",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      text: "PLUCKY PLAY Whenever this character challenges another character, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
