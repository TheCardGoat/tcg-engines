import type { BaseCardDefinition_Structure } from "../../card-types";

export const CorsicaBase: BaseCardDefinition_Structure = {
  id: "st02-016",
  name: "Corsica Base",
  cardNumber: "ST02-016",
  setCode: "ST02",
  cardType: "BASE",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 3,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 [Tallgeese]((OZ)･AP4･HP2) Unit token. If it is your turn and a card with &quot;Corsica Base&quot; in its card name is in your trash, deploy 2 [Leo]((OZ)･AP1･HP1) Unit tokens instead.",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-016.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: NaN,
  hp: 5,
  zones: [
    "earth",
  ],
  traits: [
    "oz",
    "stronghold",
  ],
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Deploy this card.",
      effect: {
        type: "UNKNOWN",
        rawText: "Deploy this card.",
      },
    },
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】 Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 [Tallgeese]((OZ)･AP4･HP2) Unit token. If it is your turn and a card with &quot;Corsica Base&quot; in its card name is in your trash, deploy 2 [Leo]((OZ)･AP1･HP1) Unit tokens instead.",
      effect: {
        type: "UNKNOWN",
        rawText: "Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 [Tallgeese]((OZ)･AP4･HP2) Unit token. If it is your turn and a card with &quot;Corsica Base&quot; in its card name is in your trash, deploy 2 [Leo]((OZ)･AP1･HP1) Unit tokens instead.",
      },
    },
  ],
};
