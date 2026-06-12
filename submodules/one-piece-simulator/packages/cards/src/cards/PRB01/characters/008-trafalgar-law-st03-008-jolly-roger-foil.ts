import type { CharacterCard } from "@tcg/op-types";
import { prb01TrafalgarLawSt03008JollyRogerFoil008I18n } from "./008-trafalgar-law-st03-008-jolly-roger-foil.i18n.ts";

export const prb01TrafalgarLawSt03008JollyRogerFoil008: CharacterCard = {
  id: "ST03-008",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "PRB01",
  cost: 1,
  power: 1000,
  traits: ["Heart Pirates The Seven Warlords of the Sea"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-008_r2.png",
      imageId: "ST03-008_r2",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb01TrafalgarLawSt03008JollyRogerFoil008I18n,
};
