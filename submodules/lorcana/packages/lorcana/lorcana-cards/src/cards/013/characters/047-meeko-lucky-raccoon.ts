import type { CharacterCard } from "@tcg/lorcana-types";
import { meekoLuckyRaccoonI18n } from "./047-meeko-lucky-raccoon.i18n";

export const meekoLuckyRaccoon: CharacterCard = {
  id: "8t3",
  canonicalId: "ci_8t3",
  slug: "lorcana-ci_8t3",
  printings: [
    {
      id: "set13-047",
      artId: "set13-047",
      setCode: "set13",
      collectorNumber: "47",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-047"],
  cardType: "character",
  name: "Meeko",
  version: "Lucky Raccoon",
  inkType: ["amethyst"],
  franchise: "Pocahontas",
  set: "013",
  cardNumber: 47,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  classifications: ["Storyborn", "Ally"],
  i18n: meekoLuckyRaccoonI18n,
};
