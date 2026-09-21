import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Vergo061I18n } from "./op14-061-vergo.i18n.ts";

export const op14eb04Vergo061: CharacterCard = {
  id: "OP14-061",
  canonicalId: "OP14-061",
  slug: "vergo/op14-061",
  name: "Vergo",
  printings: [
    {
      id: "OP14-061",
      artId: "OP14-061",
      setCode: "OP14",
      collectorNumber: "061",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-061_E1zUy83.jpg",
    },
    {
      id: "OP14-061_p1",
      artId: "OP14-061_p1",
      setCode: "OP14",
      collectorNumber: "061",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-061_p1_S6owozX.jpg",
      label: "Vergo (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP14",
  cost: 5,
  power: 7000,
  traits: ["Punk Hazard", "Navy", "Donquixote Pirates"],
  attribute: "strike",
  effect:
    "[Once Per Turn] If your {Donquixote Pirates} type Character would be removed from the field by your opponent's effect, you may return 1 DON!! card from your field to your DON!! deck instead.\n[When Attacking] DON!! −1: Give up to 1 of your opponent's Characters −2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
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
            value: -2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "trait",
              value: "Donquixote Pirates",
              match: "includes",
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "returnDon",
          player: "self",
          amount: 1,
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04Vergo061I18n,
};
