import type { ItemCard } from "@tcg/lorcana-types";
import { magicMirrorI18n } from "./066-magic-mirror.i18n";

export const magicMirror: ItemCard = {
  id: "7cO",
  canonicalId: "ci_dDL",
  reprints: ["set1-066", "set9-065"],
  cardType: "item",
  name: "Magic Mirror",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "001",
  cardNumber: 66,
  rarity: "rare",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d0073192de544630825d3b25614fcd12",
    tcgPlayer: 650008,
  },
  text: [
    {
      title: "SPEAK!",
      description: "{E}, 4 {I} — Draw a card.",
    },
  ],
  abilities: [
    {
      id: "6c3-1",
      cost: {
        exert: true,
        ink: 4,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "SPEAK!",
      type: "activated",
      text: "SPEAK! {E}, 4 {I} — Draw a card.",
    },
  ],
  i18n: magicMirrorI18n,
};
