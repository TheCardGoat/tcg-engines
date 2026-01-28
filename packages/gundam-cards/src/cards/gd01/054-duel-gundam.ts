import type { UnitCardDefinition } from "@tcg/gundam-types";

export const DuelGundam: UnitCardDefinition = {
  id: "gd01-054",
  name: "Duel Gundam",
  cardNumber: "GD01-054",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "red",
  level: 3,
  cost: 2,
  text: "While this Unit has 5 or more AP, it gains <Breach 3>.\n\n(When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-054.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 3,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["zaft"],
  linkRequirements: ["(zaft)-trait"],
  keywords: [
    {
      keyword: "Breach",
      value: 3,
    },
  ],
  effects: [
    {
      id: "eff-xvejrpjpx",
      type: "CONSTANT",
      description:
        "While this Unit has 5 or more AP, it gains . (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
      restrictions: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 0,
      },
    },
  ],
};
