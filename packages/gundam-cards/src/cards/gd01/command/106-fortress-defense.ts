import type { CommandCardDefinition } from "@tcg/gundam-types";

export const FortressDefense: CommandCardDefinition = {
  cardNumber: "GD01-106",
  cardType: "COMMAND",
  color: "green",
  cost: 2,
  id: "gd01-106",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-106.webp?26013001",
  level: 5,
  name: "Fortress Defense",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 0,
    name: "Dozle Zabi",
    traits: ["zeon"],
  },
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam",
  text: "【Main】Deploy 2 [Zaku Ⅱ]((Zeon)･AP1･HP1) Unit tokens.\n【Pilot】[Dozle Zabi]",
  timing: "MAIN",
};
