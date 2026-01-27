import type { UnitCardDefinition } from "@tcg/gundam-types";

export const UnicornGundamUnicornMode: UnitCardDefinition = {
  id: "gd01-005",
  name: "Unicorn Gundam (Unicorn Mode)",
  cardNumber: "GD01-005",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "blue",
  level: 5,
  cost: 4,
  text: "【During Link】【Destroyed】Return this Unit&#039;s paired Pilot to its owner&#039;s hand. Then, discard 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-005.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 4,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["civilian"],
  linkRequirements: ["banagher-links"],
  abilities: [
    {
      trigger: "ON_DESTROYED",
      description:
        "【Destroyed】 Return this Unit&#039;s paired Pilot to its owner&#039;s hand. Then, discard 1.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Return this Unit&#039;s paired Pilot to its owner&#039;s hand. Then, discard 1.",
      },
    },
  ],
};
