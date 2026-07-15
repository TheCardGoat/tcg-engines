import type { CharacterCard } from "@tcg/op-types";
import { eb02Jonathan043I18n } from "./043-jonathan.i18n.ts";

export const eb02Jonathan043: CharacterCard = {
  id: "EB02-043",
  canonicalId: "EB02-043",
  slug: "jonathan",
  name: "Jonathan",
  printings: [
    {
      id: "EB02-043",
      artId: "EB02-043",
      setCode: "EB02",
      collectorNumber: "043",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-043.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB02",
  cost: 7,
  power: 9000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  i18n: eb02Jonathan043I18n,
};
