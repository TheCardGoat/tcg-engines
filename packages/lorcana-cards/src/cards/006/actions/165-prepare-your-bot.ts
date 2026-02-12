import type { ActionCard } from "@tcg/lorcana-types";

export const prepareYourBot: ActionCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      id: "ho1-3",
      text: "* Ready chosen Robot character. They can't quest for the rest of this turn.",
      type: "action",
    },
  ],
  cardNumber: 165,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "3fc04fcbbbf9a961ececd00cd38396d95d1e1f9f",
  },
  franchise: "Big Hero 6",
  id: "ho1",
  inkType: ["sapphire"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Prepare Your Bot",
  set: "006",
  text: "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.",
};
