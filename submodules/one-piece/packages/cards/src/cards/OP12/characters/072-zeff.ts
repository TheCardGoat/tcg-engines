import type { CharacterCard } from "@tcg/op-types";
import { op12Zeff072I18n } from "./072-zeff.i18n.ts";

export const op12Zeff072: CharacterCard = {
  id: "OP12-072",
  canonicalId: "OP12-072",
  slug: "zeff/op12-072",
  name: "Zeff",
  printings: [
    {
      id: "OP12-072",
      artId: "OP12-072",
      setCode: "OP12",
      collectorNumber: "072",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-072_pDgUOG6.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "strike",
  effect:
    "When a DON!! card on your field is returned to your DON!! deck, if your Leader is [Sanji], this Character gains [Rush] during this turn.\n(This card can attack on the turn in which it is played.)",
  i18n: op12Zeff072I18n,
};
