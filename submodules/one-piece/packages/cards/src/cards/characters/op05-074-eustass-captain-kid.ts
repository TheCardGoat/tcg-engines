import type { CharacterCard } from "@tcg/op-types";
import { op05EustassCaptainKid074I18n } from "./op05-074-eustass-captain-kid.i18n.ts";

export const op05EustassCaptainKid074: CharacterCard = {
  id: "OP05-074",
  canonicalId: "OP05-074",
  slug: "eustass-captain-kid/op05-074",
  name: 'Eustass"Captain"Kid',
  printings: [
    {
      id: "OP05-074",
      artId: "OP05-074",
      setCode: "OP05",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074.jpg",
    },
    {
      id: "OP05-074_p1",
      artId: "OP05-074_p1",
      setCode: "OP05",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_p1.jpg",
    },
    {
      id: "OP05-074_p2",
      artId: "OP05-074_p2",
      setCode: "OP05",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_p2.jpg",
    },
    {
      id: "OP05-074_p3",
      artId: "OP05-074_p3",
      setCode: "OP05",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_p3.jpg",
    },
    {
      id: "OP05-074_p5",
      artId: "OP05-074_p5",
      setCode: "OP05",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_p5.jpg",
      label: 'Eustass"Captain"Kid (OP05-074) (Alternate Art)',
    },
    {
      id: "OP05-074_r1",
      artId: "OP05-074_r1",
      setCode: "OP05",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_r1.jpg",
    },
    {
      id: "OP05-074_r2",
      artId: "OP05-074_r2",
      setCode: "OP05",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_r2.jpg",
      label: 'Eustass"Captain"Kid (OP05-074) (Manga)',
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP05",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "special",

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
