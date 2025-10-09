import type { UnitCardDefinition } from "../../card-types";

export const Duo039sLeo: UnitCardDefinition = {
  id: "gd01-042",
  name: "Duo&#039;s Leo",
  cardNumber: "GD01-042",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 2,
  cost: 2,
  text: "This Unit may choose an active enemy Unit that is Lv.2 or lower as its attack target.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-042.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 2,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["duo-maxwell"],
  abilities: [
    {
      description:
        "This Unit may choose an active enemy Unit that is Lv.2 or lower as its attack target.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "This Unit may choose an active enemy Unit that is Lv.2 or lower as its attack target.",
      },
    },
  ],
};
