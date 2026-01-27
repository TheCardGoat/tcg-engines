import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Zno: UnitCardDefinition = {
  id: "gd01-063",
  name: "ZnO",
  cardNumber: "GD01-063",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "red",
  level: 2,
  cost: 2,
  text: "During your turn, while this Unit is battling an enemy Unit that is Lv.2 or lower, it gains <First Strike>.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-063.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 2,
  hp: 1,
  zones: ["earth"],
  traits: ["zaft"],
  linkRequirements: ["(zaft)-trait"],
  keywords: [
    {
      keyword: "First-Strike",
    },
  ],
  effects: [
    {
      id: "gd01-063-effect-1",
      description:
        "During your turn, while this Unit is battling an enemy Unit that is Lv.2 or lower, it gains <First Strike>. (While this Unit is attacking, it deals damage before the enemy Unit.)",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "During your turn, while this Unit is battling an enemy Unit that is Lv.2 or lower, it gains <First Strike>. (While this Unit is attacking, it deals damage before the enemy Unit.)",
      },
    },
  ],
};
