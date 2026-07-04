import type { EventCard } from "@tcg/op-types";
import { prb01SanjiSPilafJollyRogerFoil056I18n } from "./056-sanji-s-pilaf-jolly-roger-foil.i18n.ts";

export const prb01SanjiSPilafJollyRogerFoil056: EventCard = {
  id: "OP03-056",
  canonicalId: "OP03-056",
  slug: "sanji-s-pilaf-jolly-roger-foil",
  name: "Sanji's Pilaf (Jolly Roger Foil)",
  printings: [
    {
      id: "OP03-056",
      artId: "OP03-056",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_p2.jpg",
    },
    {
      id: "OP03-056_p3",
      artId: "OP03-056_p3",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_p3.jpg",
    },
    {
      id: "OP03-056_r1",
      artId: "OP03-056_r1",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_r1.png",
    },
    {
      id: "OP03-056_p4",
      artId: "OP03-056_p4",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_p4.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "PRB01",
  cost: 3,
  traits: ["East Blue"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_p3.jpg",
      imageId: "OP03-056_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_r1.png",
      imageId: "OP03-056_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_p4.jpg",
      imageId: "OP03-056_p4",
    },
  ],
  effect: "[Main] Draw 2 cards.[Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: prb01SanjiSPilafJollyRogerFoil056I18n,
};
