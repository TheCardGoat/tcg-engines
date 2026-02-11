import type { ItemCard } from "@tcg/lorcana-types";

export const theSwordOfHercules: ItemCard = {
  abilities: [
    {
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "1lh-1",
      name: "MIGHTY HIT",
      text: "MIGHTY HIT When you play this item, banish chosen opposing Deity character.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "1lh-2",
      name: "HAND-TO-HAND",
      text: "HAND-TO-HAND During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 200,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "ce8c06184aecd9b40e1fa325b986a0ea65d8f187",
  },
  franchise: "Hercules",
  id: "1lh",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "The Sword of Hercules",
  set: "010",
  text: "MIGHTY HIT When you play this item, banish chosen opposing Deity character.\nHAND-TO-HAND During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.",
};
