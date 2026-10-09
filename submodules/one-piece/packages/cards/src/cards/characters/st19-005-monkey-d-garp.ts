import type { CharacterCard } from "@tcg/op-types";
import { st19MonkeyDGarp005I18n } from "./st19-005-monkey-d-garp.i18n.ts";
export const st19MonkeyDGarp005: CharacterCard = {
  id: "ST19-005",
  canonicalId: "ST19-005",
  slug: "monkey-d-garp/st19-005",
  name: "Monkey.D.Garp",
  printings: [
    {
      id: "ST19-005",
      artId: "ST19-005",
      setCode: "ST19",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST19-005.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST19",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Activate: Main] [Once Per Turn] You may place 1 card from your trash at the bottom of your deck: Give up to 1 of your opponent's Characters −1 cost during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnTrashToDeck",
            amount: 1,
            position: "bottom",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st19MonkeyDGarp005I18n,
};
