import type { CharacterCard } from "@tcg/op-types";
import { st03Pacifista012I18n } from "./st03-012-pacifista.i18n.ts";

export const st03Pacifista012: CharacterCard = {
  id: "ST03-012",
  canonicalId: "ST03-012",
  slug: "pacifista/st03-012",
  name: "Pacifista",
  printings: [
    {
      id: "ST03-012",
      artId: "ST03-012",
      setCode: "ST03",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-012.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST03",
  traits: ["Biological Weapon", "Navy"],
  cost: 4,
  power: 6000,
  attribute: "special",
  counter: 1000,
  i18n: st03Pacifista012I18n,
};
