import type { CharacterCard } from "@tcg/op-types";
import { op09NicoRobin071I18n } from "./071-nico-robin.i18n.ts";

export const op09NicoRobin071: CharacterCard = {
  id: "OP09-071",
  canonicalId: "OP09-071",
  slug: "nico-robin/op09-071",
  name: "Nico Robin",
  printings: [
    {
      id: "OP09-071",
      artId: "OP09-071",
      setCode: "OP09",
      collectorNumber: "071",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-071.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op09NicoRobin071I18n,
};
