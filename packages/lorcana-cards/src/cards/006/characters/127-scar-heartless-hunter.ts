import type { CharacterCard } from "@tcg/lorcana-types";

export const scarHeartlessHunter: CharacterCard = {
  abilities: [
    {
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
      id: "mp6-1",
      name: "BARED TEETH",
      text: "BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 127,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 5,
  externalIds: {
    ravensburger: "51cf185eed5f063045efe5e721db44e75fd71f54",
  },
  franchise: "Lion King",
  fullName: "Scar - Heartless Hunter",
  id: "mp6",
  inkType: ["ruby"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Scar",
  set: "006",
  strength: 4,
  text: "BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.",
  version: "Heartless Hunter",
  willpower: 2,
};
