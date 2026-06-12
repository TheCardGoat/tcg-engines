import type { CharacterCard } from "@tcg/op-types";
import { eb01MsWednesday034I18n } from "./034-ms-wednesday.i18n.ts";

export const eb01MsWednesday034: CharacterCard = {
  id: "EB01-034",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "EB01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-034_p1.jpg",
      imageId: "EB01-034_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Your Opponent's Attack][Once Per Turn] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader's type includes \"Baroque Works\", add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onOpponentAttack",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb01MsWednesday034I18n,
};
