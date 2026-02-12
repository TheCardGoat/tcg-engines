import type { CommandCardDefinition } from "@tcg/gundam-types";

export const TheBlueGiant: CommandCardDefinition = {
  cardNumber: "ST03-014",
  cardType: "COMMAND",
  color: "green",
  cost: 1,
  id: "st03-014",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-014.webp?26013001",
  level: 4,
  name: "The Blue Giant",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 1,
    name: "Ramba Ral",
    traits: ["zeon"],
  },
  rarity: "common",
  setCode: "ST03",
  sourceTitle: "Mobile Suit Gundam",
  text: "【Action】Choose 1 friendly Unit. It can't receive battle damage from enemy Units with 2 or less AP during this battle.\n【Pilot】[Ramba Ral]",
  timing: "ACTION",
};
