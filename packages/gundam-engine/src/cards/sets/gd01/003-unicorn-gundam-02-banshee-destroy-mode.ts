import type { UnitCardDefinition } from "../../card-types";

export const UnicornGundam02BansheeDestroyMode: UnitCardDefinition = {
  id: "gd01-003",
  name: "Unicorn Gundam 02 Banshee (Destroy Mode)",
  cardNumber: "GD01-003",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "blue",
  level: 6,
  cost: 4,
  text: "【During Link】【Attack】Choose 12 cards from your trash. Return them to their owner&#039;s deck and shuffle it. If you do, set this Unit as active. It gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-003.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 5,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["earth", "federation"],
  linkRequirements: ["marida-cruz"],
  keywords: [
    {
      keyword: "First-Strike",
    },
  ],
  abilities: [
    {
      trigger: "ON_ATTACK",
      description:
        "【Attack】 Choose 12 cards from your trash. Return them to their owner&#039;s deck and shuffle it. If you do, set this Unit as active. It gains <First Strike> during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.)",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Choose 12 cards from your trash. Return them to their owner&#039;s deck and shuffle it. If you do, set this Unit as active. It gains <First Strike> during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.)",
      },
    },
  ],
};
