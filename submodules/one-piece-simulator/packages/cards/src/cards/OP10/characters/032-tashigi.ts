import type { CharacterCard } from "@tcg/op-types";
import { op10Tashigi032I18n } from "./032-tashigi.i18n.ts";

export const op10Tashigi032: CharacterCard = {
  id: "OP10-032",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP10",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Navy Punk Hazard"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-032_p1.jpg",
      imageId: "OP10-032_p1",
    },
  ],
  effect:
    "If you have a green Character other than [Tashigi] that would be removed from the field by your opponent's effect, you may rest this Character instead.",
  i18n: op10Tashigi032I18n,
};
