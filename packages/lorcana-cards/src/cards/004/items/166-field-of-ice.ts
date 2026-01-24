import type { ItemCard } from "@tcg/lorcana-types";

export const fieldOfIce: ItemCard = {
  id: "1kk",
  cardType: "item",
  name: "Field of Ice",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  text: "ICY DEFENSE Whenever you play a character, they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  cardNumber: 166,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cc7f8815217a006923e994d8abffb2824694e76f",
  },
  abilities: [
    {
      id: "1kk-1",
      type: "triggered",
      name: "ICY DEFENSE",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        value: 1,
      },
      text: "ICY DEFENSE Whenever you play a character, they gain Resist +1 until the start of your next turn.",
    },
  ],
};
