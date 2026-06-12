import type { ItemCard } from "@tcg/lorcana-types";
import { sapphireChromiconI18n } from "./168-sapphire-chromicon.i18n";

export const sapphireChromicon: ItemCard = {
  id: "Xd5",
  canonicalId: "ci_Xd5",
  reprints: ["set5-168"],
  cardType: "item",
  name: "Sapphire Chromicon",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 168,
  rarity: "uncommon",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_c28dceb08757469c965d2620ac1841d8",
    tcgPlayer: 560103,
  },
  text: [
    {
      title: "POWERING UP",
      description: "This item enters play exerted.",
    },
    {
      title: "SAPPHIRE LIGHT",
      description: "{E}, 2 {I}, Banish one of your items — Gain 2 lore.",
    },
  ],
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "cxg-1",
      name: "POWERING UP",
      text: "POWERING UP This item enters play exerted.",
      type: "static",
    },
    {
      cost: {
        exert: true,
        ink: 2,
        banishItem: true,
      },
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "cxg-2",
      name: "SAPPHIRE LIGHT",
      text: "SAPPHIRE LIGHT {E}, 2 {I}, Banish one of your items — Gain 2 lore.",
      type: "activated",
    },
  ],
  i18n: sapphireChromiconI18n,
};
