import type { CharacterCard } from "@tcg/op-types";
import { op16BartholomewKuma093I18n } from "./op16-093-bartholomew-kuma.i18n.ts";

export const op16BartholomewKuma093: CharacterCard = {
  id: "OP16-093",
  canonicalId: "OP16-093",
  slug: "bartholomew-kuma/op16-093",
  name: "Bartholomew Kuma",
  printings: [
    {
      id: "OP16-093",
      artId: "OP16-093",
      setCode: "OP16",
      collectorNumber: "093",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-093_TT0f5oz.jpg",
      label: "Bartholomew Kuma (093)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP16",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Revolutionary Army The Seven Warlords of the Sea"],
  attribute: "strike",
  effect:
    "[On Play] Draw 2 cards and trash 2 cards from your hand. Then, give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op16BartholomewKuma093I18n,
};
