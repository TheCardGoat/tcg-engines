import type { CharacterCard } from "@tcg/op-types";
import { op09JaguarDSaul109I18n } from "./109-jaguar-d-saul.i18n.ts";

export const op09JaguarDSaul109: CharacterCard = {
  id: "OP09-109",
  canonicalId: "OP09-109",
  slug: "jaguar-d-saul/op09-109",
  name: "Jaguar.D.Saul",
  printings: [
    {
      id: "OP09-109",
      artId: "OP09-109",
      setCode: "OP09",
      collectorNumber: "109",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-109.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  power: 5000,
  trigger: "If your Leader is [Nico Robin], play this card.",
  traits: ["Giant Navy Ohara"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op09JaguarDSaul109I18n,
};
