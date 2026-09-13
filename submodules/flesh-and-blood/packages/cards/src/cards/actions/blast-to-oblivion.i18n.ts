import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blastToOblivion } from "./blast-to-oblivion.ts";

export const blastToOblivionI18n = defineFamilyI18n(blastToOblivion, {
  en: {
    name: "Blast to Oblivion",
    typeText: "Lightning Action - Attack",
    text: "When this attacks, the next time you play an instant card this chain link, you may return target aura permanent with cost 1 or less or target aura token to it's owner's hand.",
  },
});

export const {
  red: blastToOblivionRedI18n,
  yellow: blastToOblivionYellowI18n,
  blue: blastToOblivionBlueI18n,
} = blastToOblivionI18n.cards;
