import type { CharacterCard } from "@tcg/op-types";
import { op17Hajrudin088I18n } from "./op17-088-hajrudin.i18n.ts";

export const op17Hajrudin088: CharacterCard = {
  id: "OP17-088",
  canonicalId: "OP17-088",
  slug: "hajrudin/op17-088",
  name: "Hajrudin",
  printings: [
    {
      id: "OP17-088",
      artId: "OP17-088",
      setCode: "OP17",
      collectorNumber: "088",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-088_0WWmZGn.jpg",
    },
    {
      id: "OP17-088_p1",
      artId: "OP17-088",
      setCode: "OP17",
      collectorNumber: "088",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-088_vJX5HMj.jpg",
      label: "Hajrudin (Pandaman Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP17",
  cost: 7,
  power: 8000,
  counter: 2000,
  traits: ["Giant Elbaph New Giant Pirates"],
  attribute: "strike",
  i18n: op17Hajrudin088I18n,
};
