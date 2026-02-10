import type { PilotCardDefinition } from "@tcg/gundam-types";

export const SaylaMass: PilotCardDefinition = {
  id: "gd01-087",
  name: "Sayla Mass",
  cardNumber: "GD01-087",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "rare",
  color: "blue",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.\nWhile this Unit is blue, it gains <Repair 1>.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-087.webp?26013001",
  sourceTitle: "Mobile Suit Gundam",
  traits: ["earth", "federation", "white", "base", "team", "newtype"],
  apModifier: 1,
  hpModifier: 1,
};
