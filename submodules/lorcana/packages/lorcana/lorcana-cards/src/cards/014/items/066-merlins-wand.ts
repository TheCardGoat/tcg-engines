import type { ItemCard } from "@tcg/lorcana-types";
import { merlinsWandI18n } from "./066-merlins-wand.i18n";

export const merlinsWand: ItemCard = {
  id: "DCF",
  canonicalId: "ci_DCF",
  slug: "lorcana-ci_DCF",
  printings: [
    {
      id: "set14-066",
      artId: "set14-066",
      setCode: "set14",
      collectorNumber: "66",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-066"],
  cardType: "item",
  name: "Merlin's Wand",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 66,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  text: [
    {
      title: "Magic Touch",
      description:
        "{E}, Reveal 2 cards with the same name in your hand — You pay 1 {I} less for the next card you play with that name this turn.",
    },
  ],
  abilities: [
    {
      id: "merlins-wand-1",
      name: "Magic Touch",
      type: "activated",
      cost: {
        exert: true,
        revealCards: 2,
        revealSameName: true,
      },
      text: "Magic Touch {E}, Reveal 2 cards with the same name in your hand — You pay 1 {I} less for the next card you play with that name this turn.",
      effect: {
        type: "cost-reduction",
        amount: 1,
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        cardNameFrom: "chosen-card",
      },
    },
  ],
  i18n: merlinsWandI18n,
};
