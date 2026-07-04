import type { CharacterCard } from "@tcg/op-types";
import { op13Hack090I18n } from "./090-hack.i18n.ts";

export const op13Hack090: CharacterCard = {
  id: "OP13-090",
  canonicalId: "OP13-090",
  slug: "hack/op13-090",
  name: "Hack",
  printings: [
    {
      id: "OP13-090",
      artId: "OP13-090",
      setCode: "OP13",
      collectorNumber: "090",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-090_IPtyyHd.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP13",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Fish-Man Revolutionary Army Dressrosa"],
  attribute: "strike",
  i18n: op13Hack090I18n,
};
