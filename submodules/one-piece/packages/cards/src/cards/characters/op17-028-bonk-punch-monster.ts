import type { CharacterCard } from "@tcg/op-types";
import { op17BonkPunchMonster028I18n } from "./op17-028-bonk-punch-monster.i18n.ts";

export const op17BonkPunchMonster028: CharacterCard = {
  id: "OP17-028",
  canonicalId: "OP17-028",
  slug: "bonk-punch-monster/op17-028",
  name: "Bonk Punch & Monster",
  printings: [
    {
      id: "OP17-028",
      artId: "OP17-028",
      setCode: "OP17",
      collectorNumber: "028",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-028_sxkBdza.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP17",
  cost: 4,
  power: 3000,
  counter: 1000,
  traits: ["Animal Red-Haired Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] K.O. up to 1 of your opponent's rested Characters with a cost of 6 or less.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op17BonkPunchMonster028I18n,
};
