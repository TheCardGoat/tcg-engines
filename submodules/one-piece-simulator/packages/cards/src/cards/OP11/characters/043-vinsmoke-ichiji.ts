import type { CharacterCard } from "@tcg/op-types";
import { op11VinsmokeIchiji043I18n } from "./043-vinsmoke-ichiji.i18n.ts";

export const op11VinsmokeIchiji043: CharacterCard = {
  id: "OP11-043",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP11",
  cost: 7,
  power: 7000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "strike",
  effect:
    '[Blocker]\n[On Your Opponent\'s Attack] [Once Per Turn] This effect can be activated when you only have Characters with a type including "GERMA". Up to 1 of your Leader or Character cards gains +1000 power during this battle. Then, trash 2 cards from the top of your deck.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onOpponentAttack",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11VinsmokeIchiji043I18n,
};
