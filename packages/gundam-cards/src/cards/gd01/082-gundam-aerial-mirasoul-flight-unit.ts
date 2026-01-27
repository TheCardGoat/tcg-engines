import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamAerialMirasoulFlightUnit: UnitCardDefinition = {
  id: "gd01-082",
  name: "Gundam Aerial (Mirasoul Flight Unit)",
  cardNumber: "GD01-082",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "white",
  level: 4,
  cost: 3,
  text: "【During Pair】【Activate･Action】【Once per Turn】②：Choose 1 enemy Unit. It gets AP-1 during this battle.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-082.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 4,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirements: ["suletta-mercury"],
  effects: [
    {
      id: "gd01-082-effect-1",
      description:
        "【Activate･Action】 【Once per Turn】②：Choose 1 enemy Unit. It gets AP-1 during this battle.",
      type: "ACTIVATED",
      timing: "ACTION",
      action: {
        type: "MODIFY_STATS",
        parameters: {
          attribute: "ap",
          modifier: -1,
          duration: "turn",
        },
      },
    },
  ],
};
