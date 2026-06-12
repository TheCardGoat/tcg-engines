import type { CharacterCard } from "@tcg/op-types";
import { op05EustassCaptainKid074I18n } from "./074-eustass-captain-kid.i18n.ts";

export const op05EustassCaptainKid074: CharacterCard = {
  id: "OP05-074",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP05",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_p2.jpg",
      imageId: "OP05-074_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_p1.jpg",
      imageId: "OP05-074_p1",
    },
  ],
  effect:
    "[Blocker] [Your Turn][Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, add up to 1 DON!! card from your DON!! deck and set it as active.",
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
  i18n: op05EustassCaptainKid074I18n,
};
