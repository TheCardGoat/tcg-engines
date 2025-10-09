import type { PilotCardDefinition } from "../../card-types";

export const AkihiroAltland: PilotCardDefinition = {
  id: "st05-011",
  name: "Akihiro Altland",
  cardNumber: "ST05-011",
  setCode: "ST05",
  cardType: "PILOT",
  rarity: "common",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.
【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 (Tekkadan) Unit card that is Lv.2 or lower from your trash. Add it to your hand.
",
  imageUrl: "../images/cards/card/ST05-011.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  traits: [
    "tekkadan",
    "alaya-vijnana",
  ],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Add this card to your hand. 【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 (Tekkadan) Unit card that is Lv.2 or lower from your trash. Add it to your hand.",
      effect: {
        type: "UNKNOWN",
        rawText: "Add this card to your hand. 【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 (Tekkadan) Unit card that is Lv.2 or lower from your trash. Add it to your hand.",
      },
    },
  ],
};
