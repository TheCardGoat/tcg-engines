import type { UnitCardDefinition } from "@tcg/gundam-types";

export const SwordStrikeGundam: UnitCardDefinition = {
  id: "gd01-073",
  name: "Sword Strike Gundam",
  cardNumber: "GD01-073",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "white",
  level: 4,
  cost: 3,
  text: "【During Link】【Attack】Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-073.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 4,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "alliance"],
  linkRequirements: ["(earth-alliance)-trait"],
  effects: [
    {
      id: "gd01-073-effect-1",
      description:
        "【Attack】 Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand.",
      type: "TRIGGERED",
      timing: "ATTACK",
      action: {
        type: "CUSTOM",
        text: "Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand.",
      },
    },
  ],
};
