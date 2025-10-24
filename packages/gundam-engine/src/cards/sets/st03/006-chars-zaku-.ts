import type { UnitCardDefinition } from "../../card-types";

export const CharsZaku: UnitCardDefinition = {
  id: "st03-006",
  name: "Char's Zaku Ⅱ",
  cardNumber: "ST03-006",
  setCode: "ST03",
  cardType: "UNIT",
  rarity: "legendary",
  color: "green",
  level: 3,
  cost: 2,
  text: "【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Zeon)/(Neo Zeon) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-006.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirements: ["char-aznable"],
  abilities: [
    {
      trigger: "ON_DESTROYED",
      description:
        "【Destroyed】 Look at the top 3 cards of your deck. You may reveal 1 (Zeon)/(Neo Zeon) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Look at the top 3 cards of your deck. You may reveal 1 (Zeon)/(Neo Zeon) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
      },
    },
  ],
};
