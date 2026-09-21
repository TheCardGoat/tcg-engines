import type { CharacterCard } from "@tcg/op-types";
import { op17Kaido042I18n } from "./op17-042-kaido.i18n.ts";

export const op17Kaido042: CharacterCard = {
  id: "OP17-042",
  canonicalId: "OP17-042",
  slug: "kaido/op17-042",
  name: "Kaido",
  printings: [
    {
      id: "OP17-042",
      artId: "OP17-042",
      setCode: "OP17",
      collectorNumber: "042",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-042_VnGadBg.jpg",
      label: "Kaido (042)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP17",
  cost: 4,
  power: 6000,
  traits: ["Rocks Pirates"],
  attribute: "strike",
  effect:
    '[Blocker]\n\n[On Play] You may reveal 3 cards with a type including "Rocks Pirates" from your hand: Give up to 1 of your opponent\'s Characters 3000 power during this turn.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "revealFromHand",
            amount: 3,
            filters: [
              {
                filter: "trait",
                value: "Rocks Pirates",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17Kaido042I18n,
};
