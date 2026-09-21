import type { CharacterCard } from "@tcg/op-types";
import { op17CaponeGangBege100I18n } from "./op17-100-capone-gang-bege.i18n.ts";

export const op17CaponeGangBege100: CharacterCard = {
  id: "OP17-100",
  canonicalId: "OP17-100",
  slug: "capone-gang-bege/op17-100",
  name: 'Capone"Gang"Bege',
  printings: [
    {
      id: "OP17-100",
      artId: "OP17-100",
      setCode: "OP17",
      collectorNumber: "100",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-100_r5AVN6J.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP17",
  cost: 7,
  power: 8000,
  counter: 2000,
  traits: ["Supernovas Firetank Pirates"],
  attribute: "ranged",
  i18n: op17CaponeGangBege100I18n,
};
