import type { CharacterCard } from "@tcg/op-types";
import { op12Sanji070I18n } from "./070-sanji.i18n.ts";

export const op12Sanji070: CharacterCard = {
  id: "OP12-070",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP12",
  cost: 3,
  power: 5000,
  traits: ["Alabasta Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-070_p1_3xkKTDF.jpg",
      imageId: "OP12-070_p1",
    },
  ],
  effect:
    "This Character gains +1000 power for every 5 Events in your trash.\nIf this Character would be removed from the field by your opponent's effect, you may return 1 DON!! card from your field to your DON!! deck instead.",
  i18n: op12Sanji070I18n,
};
