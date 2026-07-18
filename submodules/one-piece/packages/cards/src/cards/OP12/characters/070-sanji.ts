import type { CharacterCard } from "@tcg/op-types";
import { op12Sanji070I18n } from "./070-sanji.i18n.ts";

export const op12Sanji070: CharacterCard = {
  id: "OP12-070",
  canonicalId: "OP12-070",
  slug: "sanji/op12-070",
  name: "Sanji",
  printings: [
    {
      id: "OP12-070",
      artId: "OP12-070",
      setCode: "OP12",
      collectorNumber: "070",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-070_b5HB38h.jpg",
    },
    {
      id: "OP12-070_p1",
      artId: "OP12-070_p1",
      setCode: "OP12",
      collectorNumber: "070",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-070_p1_3xkKTDF.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP12",
  cost: 3,
  power: 5000,
  traits: ["Alabasta Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-070_p1_3xkKTDF.jpg",
      imageId: "OP12-070_p1",
    },
  ],
  effect:
    "This Character gains +1000 power for every 5 Events in your trash.\nIf this Character would be removed from the field by your opponent's effect, you may return 1 DON!! card from your field to your DON!! deck instead.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            valuePerCardGroup: {
              size: 5,
              target: {
                player: "self",
                zones: ["trash"],
                count: {
                  amount: "all",
                },
                filters: [
                  {
                    filter: "cardCategory",
                    value: "event",
                  },
                ],
              },
            },
            duration: "permanent",
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        source: "opponentEffect",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "returnDon",
          player: "self",
          amount: 1,
        },
      },
    ],
  },
  i18n: op12Sanji070I18n,
};
