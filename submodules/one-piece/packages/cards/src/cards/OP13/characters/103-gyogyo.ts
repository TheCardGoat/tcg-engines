import type { CharacterCard } from "@tcg/op-types";
import { op13Gyogyo103I18n } from "./103-gyogyo.i18n.ts";

export const op13Gyogyo103: CharacterCard = {
  id: "OP13-103",
  canonicalId: "OP13-103",
  slug: "gyogyo",
  name: "Gyogyo",
  printings: [
    {
      id: "OP13-103",
      artId: "OP13-103",
      setCode: "OP13",
      collectorNumber: "103",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-103_dBDGlnT.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP13",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Bonney Pirates"],
  attribute: "wisdom",
  i18n: op13Gyogyo103I18n,
};
