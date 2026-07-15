import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Wadatsumi056I18n } from "./056-wadatsumi.i18n.ts";

export const op14eb04Wadatsumi056: CharacterCard = {
  id: "OP14-056",
  canonicalId: "OP14-056",
  slug: "wadatsumi/op14-056",
  name: "Wadatsumi",
  printings: [
    {
      id: "OP14-056",
      artId: "OP14-056",
      setCode: "OP14EB04",
      collectorNumber: "056",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-056_zfDoa7o.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 5000,
  counter: 2000,
  traits: ["Fish-Man The Sun Pirates"],
  attribute: "strike",
  effect:
    "This Character cannot attack.\nWhen a card is trashed from your hand by an effect, this Character's effect is negated during this turn.",
  i18n: op14eb04Wadatsumi056I18n,
};
