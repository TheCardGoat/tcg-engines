import type { UnitCardDefinition } from "../../card-types";

export const GundamAerialRebuild: UnitCardDefinition = {
  id: "gd01-067",
  name: "Gundam Aerial Rebuild",
  cardNumber: "GD01-067",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "white",
  level: 6,
  cost: 5,
  text: "【When Paired】Choose 1 Command card that is Lv.5 or lower from your trash. Add it to your hand.
",
  imageUrl: "../images/cards/card/GD01-067.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 5,
  hp: 4,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "academy",
  ],
  linkRequirements: [
    "suletta-mercury",
  ],
  abilities: [
    {
      trigger: "WHEN_PAIRED",
      description: "【When Paired】 Choose 1 Command card that is Lv.5 or lower from your trash. Add it to your hand.",
      effect: {
        type: "UNKNOWN",
        rawText: "Choose 1 Command card that is Lv.5 or lower from your trash. Add it to your hand.",
      },
    },
  ],
};
