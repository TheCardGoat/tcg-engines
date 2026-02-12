import type { ItemCard } from "@tcg/lorcana-types";

export const microbots: ItemCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -1,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "674-2",
      name: "INSPIRED TECH",
      text: "INSPIRED TECH When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 167,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "16564aa9bee85f228a9e033b2c6ce86800ff1717",
  },
  franchise: "Big Hero 6",
  id: "674",
  inkType: ["sapphire"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Microbots",
  set: "006",
  text: "LIMITLESS APPLICATIONS You may have any number of cards named Microbots in your deck.\nINSPIRED TECH When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.",
};
