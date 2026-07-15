import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Moebius: UnitCardDefinition = {
  ap: 1,
  cardNumber: "ST04-004",
  cardType: "UNIT",
  color: "white",
  cost: 1,
  hp: 1,
  id: "st04-004",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-004.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 1,
  linkRequirements: ["-"],
  name: "Moebius",
  rarity: "common",
  setCode: "ST04",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  traits: ["earth", "alliance"],
  zones: ["space"],
};
