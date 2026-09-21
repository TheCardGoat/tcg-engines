import type { CharacterCard } from "@tcg/op-types";
import { prb02CarrotP070PirateFoil070I18n } from "./p-070-carrot-p-070-pirate-foil.i18n.ts";

export const prb02CarrotP070PirateFoil070: CharacterCard = {
  id: "P-070",
  canonicalId: "P-070",
  slug: "carrot-p-070-pirate-foil",
  name: "Carrot",
  printings: [
    {
      id: "P-070",
      artId: "P-070",
      setCode: "P",
      collectorNumber: "070",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-070_p3.jpg",
      label: "Carrot - P-070 (Pirate Foil)",
    },
    {
      id: "P-070_r1",
      artId: "P-070_r1",
      setCode: "P",
      collectorNumber: "070",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-070_r1.jpg",
      label: "Carrot - P-070 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb02CarrotP070PirateFoil070I18n,
};
