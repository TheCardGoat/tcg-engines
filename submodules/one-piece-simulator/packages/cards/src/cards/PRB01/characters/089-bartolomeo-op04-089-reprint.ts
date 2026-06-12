import type { CharacterCard } from "@tcg/op-types";
import { prb01BartolomeoOp04089Reprint089I18n } from "./089-bartolomeo-op04-089-reprint.i18n.ts";

export const prb01BartolomeoOp04089Reprint089: CharacterCard = {
  id: "OP04-089",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "PRB01",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Dressrosa Barto Club"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-089_p2.jpg",
      imageId: "OP04-089_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-089_p3.jpg",
      imageId: "OP04-089_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-089_r1.png",
      imageId: "OP04-089_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-089_p4.jpg",
      imageId: "OP04-089_p4",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb01BartolomeoOp04089Reprint089I18n,
};
