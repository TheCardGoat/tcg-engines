import type { CharacterCard } from "@tcg/op-types";
import { op05Satori105I18n } from "./op05-105-satori.i18n.ts";

export const op05Satori105: CharacterCard = {
  id: "OP05-105",
  canonicalId: "OP05-105",
  slug: "satori",
  name: "Satori",
  printings: [
    {
      id: "OP05-105",
      artId: "OP05-105",
      setCode: "OP05",
      collectorNumber: "105",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105.jpg",
    },
    {
      id: "OP05-105_p2",
      artId: "OP05-105_p2",
      setCode: "OP05",
      collectorNumber: "105",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_p2.jpg",
    },
    {
      id: "OP05-105_p3",
      artId: "OP05-105_p3",
      setCode: "OP05",
      collectorNumber: "105",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_p3.jpg",
      label: "Satori (Full Art)",
    },
    {
      id: "OP05-105_p4",
      artId: "OP05-105_p4",
      setCode: "OP05",
      collectorNumber: "105",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_p4.jpg",
      label: "Satori (Alternate Art)",
    },
    {
      id: "OP05-105_r1",
      artId: "OP05-105_r1",
      setCode: "OP05",
      collectorNumber: "105",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_r1.jpg",
      label: "Satori (Reprint)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP05",
  cost: 5,
  power: 5000,
  counter: 2000,
  trigger: "You may trash 1 card from your hand: Play this card.",
  traits: ["Sky Island Vassals"],
  attribute: "strike",
  effect: "[Trigger] You may trash 1 card from your hand: Play this card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05Satori105I18n,
};
