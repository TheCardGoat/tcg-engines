import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Mistral: UnitCardDefinition = {
  id: "gd01-078",
  name: "Mistral",
  cardNumber: "GD01-078",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 1,
  cost: 1,
  text: "【Deploy】Choose 1 enemy Unit. It gets AP-1 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-078.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 1,
  hp: 1,
  zones: ["space"],
  traits: ["earth", "alliance"],
  linkRequirements: ["-"],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description:
        "【Deploy】 Choose 1 enemy Unit. It gets AP-1 during this turn.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: -1,
        duration: "turn",
      },
    },
  ],
};
