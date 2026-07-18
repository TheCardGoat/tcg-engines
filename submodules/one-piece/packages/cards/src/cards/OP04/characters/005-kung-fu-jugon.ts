import type { CharacterCard } from "@tcg/op-types";
import { op04KungFuJugon005I18n } from "./005-kung-fu-jugon.i18n.ts";

export const op04KungFuJugon005: CharacterCard = {
  id: "OP04-005",
  canonicalId: "OP04-005",
  slug: "kung-fu-jugon",
  name: "Kung Fu Jugon",
  printings: [
    {
      id: "OP04-005",
      artId: "OP04-005",
      setCode: "OP04",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-005.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Animal Alabasta"],
  attribute: "strike",
  effect:
    "If you have a [Kung Fu Jugon] other than this Character, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "field",
            filters: [{ filter: "excludeSelf" }, { filter: "name", value: "Kung Fu Jugon" }],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op04KungFuJugon005I18n,
};
