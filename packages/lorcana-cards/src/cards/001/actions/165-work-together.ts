import type { ActionCard } from "@tcg/lorcana";

export const workTogether: ActionCard = {
  id: "118",
  cardType: "action",
  name: "Work Together",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "001",
  text: "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  cardNumber: 165,
  inkable: true,
  externalIds: {
    ravensburger: "e3a118a64cb987ccb8930d3b51c32bdde97eaea6",
  },
  abilities: [
    {
      id: "118-1",
      text: "Chosen character gains Support this turn.",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
};
