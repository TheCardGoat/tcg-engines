import type { CharacterCard } from "@tcg/op-types";
import { op09JesusBurgess086I18n } from "./086-jesus-burgess.i18n.ts";

export const op09JesusBurgess086: CharacterCard = {
  id: "OP09-086",
  canonicalId: "OP09-086",
  slug: "jesus-burgess/op09-086",
  name: "Jesus Burgess",
  printings: [
    {
      id: "OP09-086",
      artId: "OP09-086",
      setCode: "OP09",
      collectorNumber: "086",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-086.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "strike",
  effect:
    "This Character cannot be K.O.'d by your opponent's effects.\nIf your Leader has the \"Blackbeard Pirates\" type, this Character gains +1000 power for every 4 cards in your trash.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "byEffect",
            byPlayer: "opponent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
            match: "includes",
          },
        ],
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
              size: 4,
              target: {
                player: "self",
                zones: ["trash"],
                count: {
                  amount: "all",
                },
              },
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op09JesusBurgess086I18n,
};
