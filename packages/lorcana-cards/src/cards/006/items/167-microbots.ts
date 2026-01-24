import type { ItemCard } from "@tcg/lorcana-types";

export const microbots: ItemCard = {
  id: "674",
  cardType: "item",
  name: "Microbots",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "LIMITLESS APPLICATIONS You may have any number of cards named Microbots in your deck.\nINSPIRED TECH When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.",
  cost: 2,
  cardNumber: 167,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "16564aa9bee85f228a9e033b2c6ce86800ff1717",
  },
  abilities: [
    {
      id: "674-2",
      type: "triggered",
      name: "INSPIRED TECH",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "INSPIRED TECH When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.",
    },
  ],
};
