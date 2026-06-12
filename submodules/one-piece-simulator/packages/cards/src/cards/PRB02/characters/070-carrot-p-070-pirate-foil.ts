import type { CharacterCard } from "@tcg/op-types";
import { prb02CarrotP070PirateFoil070I18n } from "./070-carrot-p-070-pirate-foil.i18n.ts";

export const prb02CarrotP070PirateFoil070: CharacterCard = {
  id: "P-070",
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "PRB02",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-070_r1.jpg",
      imageId: "P-070_r1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb02CarrotP070PirateFoil070I18n,
};
