import type { ActionCard } from "@tcg/lorcana-types";

export const i2i: ActionCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "2 or more characters sang this song",
        },
        then: {
          type: "ready",
          target: "CHOSEN_CHARACTER",
        },
        type: "conditional",
      },
      id: "14j-1",
      text: "Sing Together 9 Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 130,
  cardType: "action",
  cost: 9,
  externalIds: {
    ravensburger: "9106ad9e4c47dedfb11165c78dafa1099067fe04",
  },
  franchise: "Goofy Movie",
  id: "14j",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "I2I",
  set: "009",
  text: "Sing Together 9 Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.",
};
