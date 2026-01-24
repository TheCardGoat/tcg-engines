import type { ActionCard } from "@tcg/lorcana-types";

export const i2i: ActionCard = {
  id: "14j",
  cardType: "action",
  name: "I2I",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  text: "Sing Together 9 Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.",
  actionSubtype: "song",
  cost: 9,
  cardNumber: 130,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9106ad9e4c47dedfb11165c78dafa1099067fe04",
  },
  abilities: [
    {
      id: "14j-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "2 or more characters sang this song",
        },
        then: {
          type: "ready",
          target: "CHOSEN_CHARACTER",
        },
      },
      text: "Sing Together 9 Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.",
    },
  ],
};
