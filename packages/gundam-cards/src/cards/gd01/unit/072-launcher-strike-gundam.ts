import type { UnitCardDefinition } from "@tcg/gundam-types";

export const LauncherStrikeGundam: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-072",
  cardType: "UNIT",
  color: "white",
  cost: 3,
  hp: 4,
  id: "gd01-072",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-072.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 4,
  linkRequirements: ["(earth-alliance)-trait"],
  name: "Launcher Strike Gundam",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  traits: ["earth", "alliance"],
  zones: ["space", "earth"],
};
