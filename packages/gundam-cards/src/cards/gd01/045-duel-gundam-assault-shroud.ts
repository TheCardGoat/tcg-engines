import type { UnitCardDefinition } from "@tcg/gundam-types";

export const DuelGundamAssaultShroud: UnitCardDefinition = {
  id: "gd01-045",
  name: "Duel Gundam (Assault Shroud)",
  cardNumber: "GD01-045",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "red",
  level: 5,
  cost: 4,
  text: "【When Paired】Look at the top 3 cards of your deck. You may deploy 1 (ZAFT) Unit card that is Lv.4 or lower among them. Return the remaining cards randomly to the bottom of your deck.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-045.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 4,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["zaft"],
  linkRequirements: ["yzak-jule"],
  effects: [
    {
      id: "eff-f8zfy8smo",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      description:
        "Look at the top 3 cards of your deck. You may deploy 1 (ZAFT) Unit card that is Lv.4 or lower among them. Return the remaining cards randomly to the bottom of your deck.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "CUSTOM",
            text: "Look at the top 3 cards of your deck",
          },
          {
            type: "CUSTOM",
            text: "4 or lower among them",
          },
          {
            type: "CUSTOM",
            text: "Return the remaining cards randomly to the bottom of your deck",
          },
        ],
      },
    },
  ],
};
