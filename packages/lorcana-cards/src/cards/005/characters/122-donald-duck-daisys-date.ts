import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckDaisysDate: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "1d9-1",
      name: "PLUCKY PLAY",
      text: "PLUCKY PLAY Whenever this character challenges another character, each opponent loses 1 lore.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 122,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "b19631e75285a54e5b0d403510612154cb7cd88f",
  },
  fullName: "Donald Duck - Daisy's Date",
  id: "1d9",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Donald Duck",
  set: "005",
  strength: 2,
  text: "PLUCKY PLAY Whenever this character challenges another character, each opponent loses 1 lore.",
  version: "Daisy's Date",
  willpower: 4,
};
