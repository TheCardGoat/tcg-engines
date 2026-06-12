import type { CharacterCard } from "@tcg/op-types";
import { op06Aramaki043I18n } from "./043-aramaki.i18n.ts";

export const op06Aramaki043: CharacterCard = {
  id: "OP06-043",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP06",
  cost: 8,
  power: 8000,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-043_p1.jpg",
      imageId: "OP06-043_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[Activate:Main] [Once Per Turn] You may trash 1 card from your hand and place 1 Character with a cost of 2 or less at the bottom of the owner's deck: This Character gains +3000 power during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06Aramaki043I18n,
};
