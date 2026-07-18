import type { CharacterCard } from "@tcg/op-types";
import { op04Mr2BonKureiBentham069I18n } from "./069-mr-2-bon-kurei-bentham.i18n.ts";

export const op04Mr2BonKureiBentham069: CharacterCard = {
  id: "OP04-069",
  canonicalId: "OP04-069",
  slug: "mr-2-bon-kurei-bentham/op04-069",
  name: "Mr.2.Bon.Kurei (Bentham)",
  printings: [
    {
      id: "OP04-069",
      artId: "OP04-069",
      setCode: "OP04",
      collectorNumber: "069",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-069.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    "[On Your Opponent's Attack] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): This Character's base power becomes the same as the power of your opponent's attacking Leader or Character during this turn. [Trigger] DON!! -1: Play this card.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "copyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            duration: "thisTurn",
            triggerEventAttacker: true,
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Mr2BonKureiBentham069I18n,
};
