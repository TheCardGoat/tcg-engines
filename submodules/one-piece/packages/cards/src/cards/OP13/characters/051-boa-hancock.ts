import type { CharacterCard } from "@tcg/op-types";
import { op13BoaHancock051I18n } from "./051-boa-hancock.i18n.ts";

export const op13BoaHancock051: CharacterCard = {
  id: "OP13-051",
  canonicalId: "OP13-051",
  slug: "boa-hancock/op13-051",
  name: "Boa Hancock",
  printings: [
    {
      id: "OP13-051",
      artId: "OP13-051",
      setCode: "OP13",
      collectorNumber: "051",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-051_gxxw7PU.jpg",
    },
    {
      id: "OP13-051_p1",
      artId: "OP13-051_p1",
      setCode: "OP13",
      collectorNumber: "051",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-051_p1_vuQ63Jj.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP13",
  cost: 3,
  power: 5000,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-051_p1_vuQ63Jj.jpg",
      imageId: "OP13-051_p1",
    },
  ],
  effect: "[On K.O.] If your Leader is [Boa Hancock] or multicolored, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderName",
                name: "Boa Hancock",
              },
              {
                condition: "leaderMulticolored",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op13BoaHancock051I18n,
};
