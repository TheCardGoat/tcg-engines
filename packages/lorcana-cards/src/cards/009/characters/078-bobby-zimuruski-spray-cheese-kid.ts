import type { CharacterCard } from "@tcg/lorcana-types";

export const bobbyZimuruskiSprayCheeseKid: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          chosen: true,
          target: "CONTROLLER",
          type: "discard",
        },
        type: "optional",
      },
      id: "1kg-1",
      name: "SO CHEESY",
      text: "SO CHEESY When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 78,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "cb878152b6ffe069a87f49091e1ef762cd612744",
  },
  franchise: "Goofy Movie",
  fullName: "Bobby Zimuruski - Spray Cheese Kid",
  id: "1kg",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Bobby Zimuruski",
  set: "009",
  strength: 1,
  text: "SO CHEESY When you play this character, you may draw a card, then choose and discard a card.",
  version: "Spray Cheese Kid",
  willpower: 2,
};
