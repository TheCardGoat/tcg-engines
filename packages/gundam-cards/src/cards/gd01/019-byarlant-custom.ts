import type { UnitCardDefinition } from "@tcg/gundam-types";

export const ByarlantCustom: UnitCardDefinition = {
  id: "gd01-019",
  name: "Byarlant Custom",
  cardNumber: "GD01-019",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "blue",
  level: 4,
  cost: 2,
  text: "While 4 or more enemy Units are in play, this Unit gains <Blocker>.\n\n(Rest this Unit to change the attack target to it.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-019.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 3,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["earth", "federation"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-a2pbl8fh8",
      type: "CONSTANT",
      description:
        "While 4 or more enemy Units are in play, this Unit gains <Blocker>. (Rest this Unit to change the attack target to it.)",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "GAIN_KEYWORDS",
            keywords: ["Blocker"],
            duration: "PERMANENT",
          },
          {
            type: "CUSTOM",
            text: ")",
          },
        ],
      },
    },
  ],
};
