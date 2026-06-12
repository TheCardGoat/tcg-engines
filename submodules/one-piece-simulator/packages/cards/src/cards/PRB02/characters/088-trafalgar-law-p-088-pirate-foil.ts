import type { CharacterCard } from "@tcg/op-types";
import { prb02TrafalgarLawP088PirateFoil088I18n } from "./088-trafalgar-law-p-088-pirate-foil.i18n.ts";

export const prb02TrafalgarLawP088PirateFoil088: CharacterCard = {
  id: "P-088",
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 2000,
  trigger:
    'If your Leader has the "Supernovas" type and you and your opponent have a total of 5 or less Life cards, play this card.Disclaimer: This card was reprinted from the original set with a different border (Note: the original print had a full art border).',
  traits: ["Heart Pirates Supernovas"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-088_r1.jpg",
      imageId: "P-088_r1",
    },
  ],
  effect:
    '[Trigger] If your Leader has the "Supernovas" type and you and your opponent have a total of 5 or less Life cards, play this card.Disclaimer: This card was reprinted from the original set with a different border (Note: the original print had a full art border).',
  i18n: prb02TrafalgarLawP088PirateFoil088I18n,
};
