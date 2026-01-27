import type { UnitCardDefinition } from "@tcg/gundam-types";

export const LauncherStrikeGundam: UnitCardDefinition = {
  id: "gd01-072",
  name: "Launcher Strike Gundam",
  cardNumber: "GD01-072",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "white",
  level: 4,
  cost: 3,
  text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-072.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 3,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["earth", "alliance"],
  linkRequirements: ["(earth-alliance)-trait"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  abilities: [
    {
      description:
        "<Blocker> (Rest this Unit to change the attack target to it.)",
      effect: {
        type: "UNKNOWN",
        rawText:
          "<Blocker> (Rest this Unit to change the attack target to it.)",
      },
    },
  ],
};
