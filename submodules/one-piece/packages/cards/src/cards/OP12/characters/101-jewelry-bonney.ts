import type { CharacterCard } from "@tcg/op-types";
import { op12JewelryBonney101I18n } from "./101-jewelry-bonney.i18n.ts";

export const op12JewelryBonney101: CharacterCard = {
  id: "OP12-101",
  canonicalId: "OP12-101",
  slug: "jewelry-bonney/op12-101",
  name: "Jewelry Bonney",
  printings: [
    {
      id: "OP12-101",
      artId: "OP12-101",
      setCode: "OP12",
      collectorNumber: "101",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-101_2LBx03n.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  effect:
    '[Activate: Main] You may rest this Character: Your "Supernovas" type Leader gains +1000 power until the end of your opponent\'s next turn.',
  i18n: op12JewelryBonney101I18n,
};
