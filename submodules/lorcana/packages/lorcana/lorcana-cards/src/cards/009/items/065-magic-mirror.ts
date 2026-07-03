import type { ItemCard } from "@tcg/lorcana-types";
import { magicMirrorI18n } from "./065-magic-mirror.i18n";

export const magicMirror: ItemCard = {
  id: "sKY",
  canonicalId: "ci_dDL",
  slug: "lorcana-ci_dDL",
  printings: [
    {
      id: "set9-065",
      artId: "set9-065",
      setCode: "set9",
      collectorNumber: "65",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set1-066", "set9-065"],
  cardType: "item",
  name: "Magic Mirror",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "009",
  cardNumber: 65,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d0073192de544630825d3b25614fcd12",
    tcgPlayer: "650008",
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
