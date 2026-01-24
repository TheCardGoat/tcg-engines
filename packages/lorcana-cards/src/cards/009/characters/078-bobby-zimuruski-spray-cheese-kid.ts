import type { CharacterCard } from "@tcg/lorcana-types";

export const bobbyZimuruskiSprayCheeseKid: CharacterCard = {
  id: "1kg",
  cardType: "character",
  name: "Bobby Zimuruski",
  version: "Spray Cheese Kid",
  fullName: "Bobby Zimuruski - Spray Cheese Kid",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  text: "SO CHEESY When you play this character, you may draw a card, then choose and discard a card.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 78,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cb878152b6ffe069a87f49091e1ef762cd612744",
  },
  abilities: [
    {
      id: "1kg-1",
      type: "triggered",
      name: "SO CHEESY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      text: "SO CHEESY When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
