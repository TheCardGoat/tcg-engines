import type { LeaderCard } from "@tcg/op-types";
import { op04DonquixoteDoflamingo019I18n } from "./019-donquixote-doflamingo.i18n.ts";

export const op04DonquixoteDoflamingo019: LeaderCard = {
  id: "OP04-019",
  canonicalId: "OP04-019",
  slug: "donquixote-doflamingo/op04-019",
  name: "Donquixote Doflamingo",
  printings: [
    {
      id: "OP04-019",
      artId: "OP04-019",
      setCode: "OP04",
      collectorNumber: "019",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-019.jpg",
    },
    {
      id: "OP04-019_p1",
      artId: "OP04-019_p1",
      setCode: "OP04",
      collectorNumber: "019",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-019_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["green", "purple"],
  rarity: "L",
  setId: "OP04",
  power: 5000,
  life: 4,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-019_p1.jpg",
      imageId: "OP04-019_p1",
    },
  ],
  effect: "[End of Your Turn] Set up to 2 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op04DonquixoteDoflamingo019I18n,
};
