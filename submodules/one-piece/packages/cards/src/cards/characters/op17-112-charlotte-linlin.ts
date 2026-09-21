import type { CharacterCard } from "@tcg/op-types";
import { op17CharlotteLinlin112I18n } from "./op17-112-charlotte-linlin.i18n.ts";

export const op17CharlotteLinlin112: CharacterCard = {
  id: "OP17-112",
  canonicalId: "OP17-112",
  slug: "charlotte-linlin/op17-112",
  name: "Charlotte Linlin",
  printings: [
    {
      id: "OP17-112",
      artId: "OP17-112",
      setCode: "OP17",
      collectorNumber: "112",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-112_agIp1Pt.jpg",
      label: "Charlotte Linlin (112)",
    },
    {
      id: "OP17-112_p1",
      artId: "OP17-112_p2",
      setCode: "OP17",
      collectorNumber: "112",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-112_p2.jpg",
      label: "Charlotte Linlin (112) (Manga)",
    },
    {
      id: "OP17-112_p2",
      artId: "OP17-112_p1",
      setCode: "OP17",
      collectorNumber: "112",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-112_p1_sluFFqa.jpg",
      label: "Charlotte Linlin (112) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP17",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Your Turn] The base power of all of your Characters with a [Trigger] and 4000 base power becomes 8000.\n[On Play] Draw 1 card, then choose one:\n•Add up to 1 card from the top of your deck to the top of your Life cards.\n• Add up to 1 card from the top of your opponent's Life cards to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "choice",
            options: [
              [
                {
                  action: "addToLife",
                  target: {
                    player: "self",
                    zones: ["deck"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                  position: "top",
                },
              ],
              [
                {
                  action: "removeFromLife",
                  player: "opponent",
                  count: {
                    amount: 1,
                    upTo: true,
                  },
                  destination: "hand",
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op17CharlotteLinlin112I18n,
};
