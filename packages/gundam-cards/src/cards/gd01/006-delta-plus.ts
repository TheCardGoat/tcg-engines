import type { UnitCardDefinition } from "@tcg/gundam-types";

export const DeltaPlus: UnitCardDefinition = {
  id: "gd01-006",
  name: "Delta Plus",
  cardNumber: "GD01-006",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "blue",
  level: 4,
  cost: 3,
  text: "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)\n【During Link】This Unit gets HP+1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-006.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 4,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "federation"],
  linkRequirements: ["(earth-federation)-trait"],
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
  effects: [
    {
      id: "eff-frdqjcfoo",
      type: "CONSTANT",
      description: "This Unit gets HP+1.",
      restrictions: [],
      conditions: [],
      action: {
        type: "MODIFY_STATS",
        attribute: "HP",
        value: 1,
        duration: "TURN",
        target: {
          controller: "SELF",
          cardType: "UNIT",
          filters: [],
          count: {
            min: 1,
            max: 1,
          },
        },
      },
    },
  ],
};
