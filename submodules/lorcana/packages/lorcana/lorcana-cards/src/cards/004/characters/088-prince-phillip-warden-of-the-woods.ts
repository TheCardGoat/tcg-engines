import type { CharacterCard } from "@tcg/lorcana-types";
import { princePhillipWardenOfTheWoodsI18n } from "./088-prince-phillip-warden-of-the-woods.i18n";

export const princePhillipWardenOfTheWoods: CharacterCard = {
  id: "vCW",
  canonicalId: "ci_eM1",
  reprints: ["set4-088", "set9-072"],
  cardType: "character",
  name: "Prince Phillip",
  version: "Warden of the Woods",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "004",
  cardNumber: 88,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_330073fee4914065839565db68acf025",
    tcgPlayer: 650014,
  },
  text: [
    {
      title: "SHINING BEACON",
      description: "Your other Hero characters gain Ward.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        keyword: "Ward",
        target: "YOUR_OTHER_HERO_CHARACTERS",
        type: "gain-keyword",
      },
      id: "1kf-1",
      name: "SHINING BEACON",
      text: "SHINING BEACON Your other Hero characters gain Ward.",
      type: "static",
    },
  ],
  i18n: princePhillipWardenOfTheWoodsI18n,
};
