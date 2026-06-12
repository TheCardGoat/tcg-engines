import type { CharacterCard } from "@tcg/op-types";
import { op11Arlong023I18n } from "./023-arlong.i18n.ts";

export const op11Arlong023: CharacterCard = {
  id: "OP11-023",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP11",
  cost: 7,
  power: 7000,
  counter: 1000,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Fish-Man The Sun Pirates Fish-Man Island"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-023_p1.jpg",
      imageId: "OP11-023_p1",
    },
  ],
  effect:
    'If your Leader has the "Fish-Man" type, you have 3 or less Life cards and your opponent has 5 or more rested cards, give this card in your hand 3 cost.',
  i18n: op11Arlong023I18n,
};
