import type { ItemCard } from "@tcg/lorcana-types";
import { whiteRabbitsPocketWatchI18n } from "./066-white-rabbits-pocket-watch.i18n";

export const whiteRabbitsPocketWatch: ItemCard = {
  id: "9zJ",
  canonicalId: "ci_lFD",
  slug: "lorcana-ci_lFD",
  printings: [
    {
      id: "set9-066",
      artId: "set9-066",
      setCode: "set9",
      collectorNumber: "66",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set1-068", "set9-066"],
  cardType: "item",
  name: "White Rabbit’s Pocket Watch",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "009",
  cardNumber: 66,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_d483668415d54d07861f290ceebc0c38",
    tcgPlayer: "650009",
  },
  text: [
    {
      title: "I'm Late!",
      description:
        "{E}, 1 {I} — Chosen character gains <Rush> this turn. (They can challenge the turn they're played.)",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "ecf-1",
      name: "I'M LATE!",
      text: "I'M LATE!, 1 {I} — Chosen character gains Rush this turn.",
      type: "activated",
    },
  ],
  i18n: whiteRabbitsPocketWatchI18n,
};
