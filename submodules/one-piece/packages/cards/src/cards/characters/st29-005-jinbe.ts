import type { CharacterCard } from "@tcg/op-types";
import { st29Jinbe005I18n } from "./st29-005-jinbe.i18n.ts";
export const st29Jinbe005: CharacterCard = {
  id: "ST29-005",
  canonicalId: "ST29-005",
  slug: "jinbe/st29-005",
  name: "Jinbe",
  printings: [
    {
      id: "ST29-005",
      artId: "ST29-005",
      setCode: "ST29",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-005.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 6,
  power: 5000,
  counter: 2000,
  traits: ["Fish-Man", "Egghead", "Straw Hat Crew"],
  attribute: "strike",
  effect: "-",
  trigger: "If your Leader is [Monkey.D.Luffy], play this card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderName",
            name: "Monkey.D.Luffy",
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: st29Jinbe005I18n,
};
