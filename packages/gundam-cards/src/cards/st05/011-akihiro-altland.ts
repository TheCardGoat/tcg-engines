import type { PilotCardDefinition } from "@tcg/gundam-types";

export const AkihiroAltland: PilotCardDefinition = {
  id: "st05-011",
  name: "Akihiro Altland",
  cardNumber: "ST05-011",
  setCode: "ST05",
  cardType: "PILOT",
  rarity: "common",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 (Tekkadan) Unit card that is Lv.2 or lower from your trash. Add it to your hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-011.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  traits: ["tekkadan", "alaya-vijnana"],
  apModifier: 1,
  hpModifier: 1,
  effects: [
    {
      id: "eff-9qq8f22rh",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Add this card to your hand.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
      },
    },
    {
      id: "eff-vpl4km78g",
      type: "CONSTANT",
      description:
        "During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 (Tekkadan) Unit card that is Lv.2 or lower from your trash. Add it to your hand.",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "CUSTOM",
            text: "2 or lower from your trash",
          },
          {
            type: "ADD_TO_HAND",
          },
        ],
      },
    },
  ],
};
