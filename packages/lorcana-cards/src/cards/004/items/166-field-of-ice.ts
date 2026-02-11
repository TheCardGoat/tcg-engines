import type { ItemCard } from "@tcg/lorcana-types";

export const fieldOfIce: ItemCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        value: 1,
      },
      id: "1kk-1",
      name: "ICY DEFENSE",
      text: "ICY DEFENSE Whenever you play a character, they gain Resist +1 until the start of your next turn.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 166,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "cc7f8815217a006923e994d8abffb2824694e76f",
  },
  franchise: "Frozen",
  id: "1kk",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Field of Ice",
  set: "004",
  text: "ICY DEFENSE Whenever you play a character, they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
};
