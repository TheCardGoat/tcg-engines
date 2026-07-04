import type { CharacterCard } from "@tcg/op-types";
import { eb02Karoo001I18n } from "./001-karoo.i18n.ts";

export const eb02Karoo001: CharacterCard = {
  id: "EB02-001",
  canonicalId: "EB02-001",
  slug: "karoo/eb02-001",
  name: "Karoo",
  printings: [
    {
      id: "EB02-001",
      artId: "EB02-001",
      setCode: "EB02",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-001.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB02",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Animal Alabasta"],
  attribute: "strike",
  i18n: eb02Karoo001I18n,
};
