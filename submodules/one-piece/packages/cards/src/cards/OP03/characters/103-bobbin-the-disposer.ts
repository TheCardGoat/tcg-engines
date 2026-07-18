import type { CharacterCard } from "@tcg/op-types";
import { op03BobbinTheDisposer103I18n } from "./103-bobbin-the-disposer.i18n.ts";

export const op03BobbinTheDisposer103: CharacterCard = {
  id: "OP03-103",
  canonicalId: "OP03-103",
  slug: "bobbin-the-disposer",
  name: "Bobbin the Disposer",
  printings: [
    {
      id: "OP03-103",
      artId: "OP03-103",
      setCode: "OP03",
      collectorNumber: "103",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-103.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  i18n: op03BobbinTheDisposer103I18n,
};
