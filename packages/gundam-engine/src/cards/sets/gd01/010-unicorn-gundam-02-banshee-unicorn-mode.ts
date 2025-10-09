import type { UnitCardDefinition } from "../../card-types";

export const UnicornGundam02BansheeUnicornMode: UnitCardDefinition = {
  id: "gd01-010",
  name: "Unicorn Gundam 02 Banshee (Unicorn Mode)",
  cardNumber: "GD01-010",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "blue",
  level: 4,
  cost: 3,
  text: "【When Paired】Choose 1 enemy Unit with 3 or less HP. Rest it.
",
  imageUrl: "../images/cards/card/GD01-010.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 4,
  hp: 3,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "earth",
    "federation",
  ],
  linkRequirements: [
    "(cyber-newtype)-trait",
  ],
  abilities: [
    {
      trigger: "WHEN_PAIRED",
      description: "【When Paired】 Choose 1 enemy Unit with 3 or less HP. Rest it.",
      effect: {
        type: "UNKNOWN",
        rawText: "Choose 1 enemy Unit with 3 or less HP. Rest it.",
      },
    },
  ],
};
