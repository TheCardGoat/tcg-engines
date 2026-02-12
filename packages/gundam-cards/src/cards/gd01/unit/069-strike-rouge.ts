import type { UnitCardDefinition } from "@tcg/gundam-types";

export const StrikeRouge: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-069",
  cardType: "UNIT",
  color: "white",
  cost: 2,
  hp: 2,
  id: "gd01-069",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-069.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 3,
  linkRequirements: ["(orb)-trait"],
  name: "Strike Rouge",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Activate･Main】【Once per Turn】①：Choose 1 of your rested white Units with <Blocker>. Set it as active. It can&#039;t attack during this turn.",
  traits: ["triple", "ship", "alliance"],
  zones: ["space", "earth"],
};
