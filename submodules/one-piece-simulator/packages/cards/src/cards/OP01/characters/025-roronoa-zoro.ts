import type { CharacterCard } from "@tcg/op-types";
import { op01RoronoaZoro025I18n } from "./025-roronoa-zoro.i18n.ts";

export const op01RoronoaZoro025: CharacterCard = {
  id: "OP01-025",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP01",
  cost: 3,
  power: 5000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-025_p1.jpg",
      imageId: "OP01-025_p1",
    },
  ],
  effect: "[Rush] (This card can attack on the turn in which it is played.)",
  effects: {
    keywords: ["rush"],
  },
  i18n: op01RoronoaZoro025I18n,
};
