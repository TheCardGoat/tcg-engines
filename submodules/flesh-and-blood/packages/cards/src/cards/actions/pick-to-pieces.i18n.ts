import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pickToPieces } from "./pick-to-pieces.ts";

export const pickToPiecesI18n = defineFamilyI18n(pickToPieces, {
  en: {
    name: "Pick to Pieces",
    text: "Stealth\nIf you've played or activated an attack reaction this chain link, this gets +1{p} and \"Damage that would be dealt by this can't be prevented.\"",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: pickToPiecesRedI18n,
  yellow: pickToPiecesYellowI18n,
  blue: pickToPiecesBlueI18n,
} = pickToPiecesI18n.cards;
