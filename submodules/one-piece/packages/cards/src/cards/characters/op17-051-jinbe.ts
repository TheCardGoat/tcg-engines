import type { CharacterCard } from "@tcg/op-types";
import { op17Jinbe051I18n } from "./op17-051-jinbe.i18n.ts";

export const op17Jinbe051: CharacterCard = {
  id: "OP17-051",
  canonicalId: "OP17-051",
  slug: "jinbe/op17-051",
  name: "Jinbe",
  printings: [
    {
      id: "OP17-051",
      artId: "OP17-051",
      setCode: "OP17",
      collectorNumber: "051",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-051_Ym2spb8.jpg",
      label: "Jinbe (051)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP17",
  cost: 7,
  power: 8000,
  counter: 2000,
  traits: ["Fish-Man Impel Down The Sun Pirates"],
  attribute: "strike",
  i18n: op17Jinbe051I18n,
};
