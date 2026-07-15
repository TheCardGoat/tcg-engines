import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanShadowCatcher: CharacterCard = {
  abilities: [
    {
      effect: {
        source: "chosen-character",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "1q3-1",
      name: "GOTCHA!",
      text: "GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 58,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "dfc8163cdbc129a82ce2ec3503e80504beae6599",
  },
  franchise: "Peter Pan",
  fullName: "Peter Pan - Shadow Catcher",
  id: "1q3",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Peter Pan",
  set: "006",
  strength: 1,
  text: "GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
  version: "Shadow Catcher",
  willpower: 3,
};
