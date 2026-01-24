import type { ActionCard } from "@tcg/lorcana-types";

export const prepareYourBot: ActionCard = {
  id: "ho1",
  cardType: "action",
  name: "Prepare Your Bot",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.",
  cost: 1,
  cardNumber: 165,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3fc04fcbbbf9a961ececd00cd38396d95d1e1f9f",
  },
  abilities: [
    {
      id: "ho1-3",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      text: "* Ready chosen Robot character. They can't quest for the rest of this turn.",
    },
  ],
};
