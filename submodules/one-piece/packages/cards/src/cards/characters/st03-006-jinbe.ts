import type { CharacterCard } from "@tcg/op-types";
import { st03Jinbe006I18n } from "./st03-006-jinbe.i18n.ts";

export const st03Jinbe006: CharacterCard = {
  id: "ST03-006",
  canonicalId: "ST03-006",
  slug: "jinbe/st03-006",
  name: "Jinbe",
  printings: [
    {
      id: "ST03-006",
      artId: "ST03-006",
      setCode: "ST03",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-006.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST03",
  traits: ["Fish-Man", "The Seven Warlords of the Sea", "The Sun Pirates"],
  cost: 2,
  power: 4000,
  attribute: "strike",
  counter: 1000,
  i18n: st03Jinbe006I18n,
};
