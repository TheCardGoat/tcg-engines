import type { UnitCardDefinition } from "@tcg/gundam-types";

export const StrikeRouge: UnitCardDefinition = {
  id: "gd01-069",
  name: "Strike Rouge",
  cardNumber: "GD01-069",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "white",
  level: 3,
  cost: 2,
  text: "【Activate･Main】【Once per Turn】①：Choose 1 of your rested white Units with <Blocker>. Set it as active. It can&#039;t attack during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-069.webp?26013001",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 3,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["triple", "ship", "alliance"],
  linkRequirements: ["(orb)-trait"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
};
