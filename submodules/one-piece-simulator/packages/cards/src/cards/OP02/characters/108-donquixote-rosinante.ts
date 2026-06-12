import type { CharacterCard } from "@tcg/op-types";
import { op02DonquixoteRosinante108I18n } from "./108-donquixote-rosinante.i18n.ts";

export const op02DonquixoteRosinante108: CharacterCard = {
  id: "OP02-108",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-108_p1.jpg",
      imageId: "OP02-108_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op02DonquixoteRosinante108I18n,
};
