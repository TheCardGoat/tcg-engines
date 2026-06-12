import type { CharacterCard } from "@tcg/op-types";
import { prb01EustassCaptainKidReprint074I18n } from "./074-eustass-captain-kid-reprint.i18n.ts";

export const prb01EustassCaptainKidReprint074: CharacterCard = {
  id: "OP05-074",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "PRB01",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_r2.jpg",
      imageId: "OP05-074_r2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_p5.jpg",
      imageId: "OP05-074_p5",
    },
  ],
  effect:
    "[Blocker][Your Turn][Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, add up to 1 DON!! card from your DON!! deck and set it as active.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb01EustassCaptainKidReprint074I18n,
};
