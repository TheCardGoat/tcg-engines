import type { CharacterCard } from "@tcg/lorcana-types";

export const scarHeartlessHunter: CharacterCard = {
  id: "mp6",
  cardType: "character",
  name: "Scar",
  version: "Heartless Hunter",
  fullName: "Scar - Heartless Hunter",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "006",
  text: "BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.",
  cost: 5,
  strength: 4,
  willpower: 2,
  lore: 3,
  cardNumber: 127,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "51cf185eed5f063045efe5e721db44e75fd71f54",
  },
  abilities: [
    {
      id: "mp6-1",
      type: "triggered",
      name: "BARED TEETH",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
