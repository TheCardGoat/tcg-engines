import type { CharacterCard } from "@tcg/op-types";
import { prb01HelmeppoFullArt010I18n } from "./010-helmeppo-full-art.i18n.ts";

export const prb01HelmeppoFullArt010: CharacterCard = {
  id: "ST06-010",
  canonicalId: "ST06-010",
  slug: "helmeppo-full-art",
  name: "Helmeppo (Full Art)",
  printings: [
    {
      id: "ST06-010",
      artId: "ST06-010",
      setCode: "PRB01",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-010_p3.jpg",
    },
    {
      id: "ST06-010_p2",
      artId: "ST06-010_p2",
      setCode: "PRB01",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-010_p2.jpg",
    },
    {
      id: "ST06-010_r1",
      artId: "ST06-010_r1",
      setCode: "PRB01",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-010_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "PRB01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-010_p2.jpg",
      imageId: "ST06-010_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-010_r1.jpg",
      imageId: "ST06-010_r1",
    },
  ],
  effect: "[On Play] Give up to 1 of your opponent's Characters -3 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb01HelmeppoFullArt010I18n,
};
