import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanShadowCatcher: CharacterCard = {
  id: "1q3",
  cardType: "character",
  name: "Peter Pan",
  version: "Shadow Catcher",
  fullName: "Peter Pan - Shadow Catcher",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  text: "GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
  cost: 4,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 58,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "dfc8163cdbc129a82ce2ec3503e80504beae6599",
  },
  abilities: [
    {
      id: "1q3-1",
      type: "triggered",
      name: "GOTCHA!",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: "CONTROLLER",
      },
      text: "GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
