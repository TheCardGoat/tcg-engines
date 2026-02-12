import type { ItemCard } from "@tcg/lorcana-types";

export const fairyGodmothersWand: ItemCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "CHOSEN_CHARACTER",
      },
      id: "1y8-1",
      name: "ONLY TILL MIDNIGHT",
      text: "ONLY TILL MIDNIGHT During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 168,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "fd2f1456dcf102baca39854f408a388b31fd54f1",
  },
  franchise: "Cinderella",
  id: "1y8",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Fairy Godmother's Wand",
  set: "010",
  text: "ONLY TILL MIDNIGHT During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
};
