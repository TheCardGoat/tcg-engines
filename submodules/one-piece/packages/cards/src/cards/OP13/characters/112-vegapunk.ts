import type { CharacterCard } from "@tcg/op-types";
import { op13Vegapunk112I18n } from "./112-vegapunk.i18n.ts";

export const op13Vegapunk112: CharacterCard = {
  id: "OP13-112",
  canonicalId: "OP13-112",
  slug: "vegapunk/op13-112",
  name: "Vegapunk",
  printings: [
    {
      id: "OP13-112",
      artId: "OP13-112",
      setCode: "OP13",
      collectorNumber: "112",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-112_HNVPF9X.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  effect:
    "If you have a total of 2 or more given DON!! cards, this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op13Vegapunk112I18n,
};
