import type { CharacterCard } from "@tcg/op-types";
import { eb01EdwardWeevil023I18n } from "./023-edward-weevil.i18n.ts";

export const eb01EdwardWeevil023: CharacterCard = {
  id: "EB01-023",
  canonicalId: "EB01-023",
  slug: "edward-weevil/eb01-023",
  name: "Edward Weevil",
  printings: [
    {
      id: "EB01-023",
      artId: "EB01-023",
      setCode: "EB01",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-023.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "EB01",
  cost: 4,
  power: 6000,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  effect: "[On Play] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: eb01EdwardWeevil023I18n,
};
