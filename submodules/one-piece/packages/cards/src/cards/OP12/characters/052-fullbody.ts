import type { CharacterCard } from "@tcg/op-types";
import { op12Fullbody052I18n } from "./052-fullbody.i18n.ts";

export const op12Fullbody052: CharacterCard = {
  id: "OP12-052",
  canonicalId: "OP12-052",
  slug: "fullbody/op12-052",
  name: "Fullbody",
  printings: [
    {
      id: "OP12-052",
      artId: "OP12-052",
      setCode: "OP12",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-052_6iV382y.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  i18n: op12Fullbody052I18n,
};
