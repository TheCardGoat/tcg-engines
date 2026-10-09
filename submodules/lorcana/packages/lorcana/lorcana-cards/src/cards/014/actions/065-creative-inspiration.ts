import type { ActionCard } from "@tcg/lorcana-types";
import { creativeInspirationI18n } from "./065-creative-inspiration.i18n";

export const creativeInspiration: ActionCard = {
  id: "mqz",
  canonicalId: "ci_mqz",
  slug: "lorcana-ci_mqz",
  printings: [
    {
      id: "set14-065",
      artId: "set14-065",
      setCode: "set14",
      collectorNumber: "65",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-065"],
  cardType: "action",
  name: "Creative Inspiration",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "014",
  cardNumber: 65,
  rarity: "rare",
  cost: 7,
  inkable: true,
  text: "Draw 4 cards.",
  abilities: [
    {
      type: "action",
      text: "Draw 4 cards.",
      effect: {
        type: "draw",
        amount: 4,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: creativeInspirationI18n,
};
