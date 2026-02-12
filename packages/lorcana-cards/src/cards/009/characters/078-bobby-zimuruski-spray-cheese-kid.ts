import type { CharacterCard } from "@tcg/lorcana-types";

export const bobbyZimuruskiSprayCheeseKid: CharacterCard = {
  abilities: [
    {
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
      id: "1kg-1",
      name: "SO CHEESY",
      text: "SO CHEESY When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
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
