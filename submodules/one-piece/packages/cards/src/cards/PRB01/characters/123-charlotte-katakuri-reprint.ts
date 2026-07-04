import type { CharacterCard } from "@tcg/op-types";
import { prb01CharlotteKatakuriReprint123I18n } from "./123-charlotte-katakuri-reprint.i18n.ts";

export const prb01CharlotteKatakuriReprint123: CharacterCard = {
  id: "OP03-123",
  canonicalId: "OP03-123",
  slug: "charlotte-katakuri-reprint",
  name: "Charlotte Katakuri (Reprint)",
  printings: [
    {
      id: "OP03-123",
      artId: "OP03-123",
      setCode: "PRB01",
      collectorNumber: "123",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-123_r1.png",
    },
    {
      id: "OP03-123_p4",
      artId: "OP03-123_p4",
      setCode: "PRB01",
      collectorNumber: "123",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-123_p4.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SEC",
  setId: "PRB01",
  cost: 8,
  power: 8000,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-123_p4.jpg",
      imageId: "OP03-123_p4",
    },
  ],
  effect:
    "[On Play] Add up to 1 Character with a cost of 8 or less to the top or bottom of the owner's Life cards face-up.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 8,
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
        ],
      },
    ],
  },
  i18n: prb01CharlotteKatakuriReprint123I18n,
};
