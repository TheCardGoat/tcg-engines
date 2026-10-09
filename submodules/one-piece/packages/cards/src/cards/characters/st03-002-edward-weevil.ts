import type { CharacterCard } from "@tcg/op-types";
import { st03EdwardWeevil002I18n } from "./st03-002-edward-weevil.i18n.ts";

export const st03EdwardWeevil002: CharacterCard = {
  id: "ST03-002",
  canonicalId: "ST03-002",
  slug: "edward-weevil/st03-002",
  name: "Edward Weevil",
  printings: [
    {
      id: "ST03-002",
      artId: "ST03-002",
      setCode: "ST03",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-002.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST03",
  traits: ["The Seven Warlords of the Sea"],
  cost: 3,
  power: 5000,
  attribute: "slash",
  counter: 1000,
  i18n: st03EdwardWeevil002I18n,
};
