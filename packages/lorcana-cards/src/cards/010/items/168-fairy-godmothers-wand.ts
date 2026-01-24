import type { ItemCard } from "@tcg/lorcana-types";

export const fairyGodmothersWand: ItemCard = {
  id: "1y8",
  cardType: "item",
  name: "Fairy Godmother's Wand",
  inkType: ["sapphire"],
  franchise: "Cinderella",
  set: "010",
  text: "ONLY TILL MIDNIGHT During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
  cost: 2,
  cardNumber: 168,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fd2f1456dcf102baca39854f408a388b31fd54f1",
  },
  abilities: [
    {
      id: "1y8-1",
      type: "triggered",
      name: "ONLY TILL MIDNIGHT",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "CHOSEN_CHARACTER",
      },
      text: "ONLY TILL MIDNIGHT During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn.",
    },
  ],
};
