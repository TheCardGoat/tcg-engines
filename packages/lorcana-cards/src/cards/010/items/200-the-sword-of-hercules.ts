import type { ItemCard } from "@tcg/lorcana-types";

export const theSwordOfHercules: ItemCard = {
  id: "1lh",
  cardType: "item",
  name: "The Sword of Hercules",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "010",
  text: "MIGHTY HIT When you play this item, banish chosen opposing Deity character.\nHAND-TO-HAND During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.",
  cost: 2,
  cardNumber: 200,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ce8c06184aecd9b40e1fa325b986a0ea65d8f187",
  },
  abilities: [
    {
      id: "1lh-1",
      type: "triggered",
      name: "MIGHTY HIT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "MIGHTY HIT When you play this item, banish chosen opposing Deity character.",
    },
    {
      id: "1lh-2",
      type: "triggered",
      name: "HAND-TO-HAND",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "HAND-TO-HAND During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.",
    },
  ],
};
