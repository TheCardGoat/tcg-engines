import type { PilotCardDefinition } from "@tcg/gundam-types";

export const FullFrontal: PilotCardDefinition = {
  id: "st03-010",
  name: "Full Frontal",
  cardNumber: "ST03-010",
  setCode: "ST03",
  cardType: "PILOT",
  rarity: "common",
  color: "red",
  level: 6,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【When Paired】You may deploy 1 (Neo Zeon)/(Zeon) Unit card that is Lv.4 or lower from your hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-010.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  traits: ["neo", "zeon", "cyber-newtype"],
  apModifier: 2,
  hpModifier: 2,
  effects: [
    {
      id: "eff-unsagg58k",
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
      id: "eff-mfy8n17wl",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      description:
        "You may deploy 1 (Neo Zeon)/(Zeon) Unit card that is Lv.4 or lower from your hand.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "You may deploy 1 (Neo Zeon)/(Zeon) Unit card that is Lv.4 or lower from your hand.",
      },
    },
  ],
};
