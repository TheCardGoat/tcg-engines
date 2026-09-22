import type { CharacterCard } from "@tcg/op-types";
import { op17Jack069I18n } from "./op17-069-jack.i18n.ts";

export const op17Jack069: CharacterCard = {
  id: "OP17-069",
  canonicalId: "OP17-069",
  slug: "jack/op17-069",
  name: "Jack",
  printings: [
    {
      id: "OP17-069",
      artId: "OP17-069",
      setCode: "OP17",
      collectorNumber: "069",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-069_msTCFRS.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP17",
  cost: 9,
  power: 10000,
  traits: ["Fish-Man Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[Rush: Character] (This card can attack Characters on the turn in which it is played.)\n[On Play] DON!! -1: If your Leader has the {Animal Kingdom Pirates} type, give up to 1 of your opponent's Characters -2000 power during this turn.",
  effects: {
    keywords: ["rushCharacter"],
    effects: [
      {
        trigger: "onPlay",
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
            condition: {
              condition: "leaderTrait",
              trait: "Animal Kingdom Pirates",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17Jack069I18n,
};
