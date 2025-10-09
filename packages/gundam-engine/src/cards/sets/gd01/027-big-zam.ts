import type { UnitCardDefinition } from "../../card-types";

export const BigZam: UnitCardDefinition = {
  id: "gd01-027",
  name: "Big Zam",
  cardNumber: "GD01-027",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "green",
  level: 7,
  cost: 5,
  text: "&lt;Breach 4&gt; (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)
【Deploy】If there are 10 or more (Zeon)/(Neo Zeon) Unit cards in your trash, deal 4 damage to all Units with &lt;Blocker&gt;.
",
  imageUrl: "../images/cards/card/GD01-027.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 5,
  hp: 6,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "zeon",
  ],
  linkRequirements: [
    "dozle-zabi",
  ],
  keywords: [
    {
      keyword: "Breach",
      value: 4,
    },
    {
      keyword: "Blocker",
    },
  ],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】 If there are 10 or more (Zeon)/(Neo Zeon) Unit cards in your trash, deal 4 damage to all Units with <Blocker>.",
      effect: {
        type: "DAMAGE",
        amount: 4,
        target: {
          type: "unknown",
          rawText: "all Units with <Blocker>",
        },
      },
    },
  ],
};
