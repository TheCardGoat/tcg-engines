import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { aMomentSPeace } from "./a-moment-s-peace.ts";

export const aMomentSPeaceI18n = defineFamilyI18n(aMomentSPeace, {
  en: {
    name: "A Moment's Peace",
    typeText: "Warrior Block",
    text: "When this defends a sword attack, you can't be attacked by the sword again this turn.",
  },
});

export const { blue: aMomentSPeaceBlueI18n } = aMomentSPeaceI18n.cards;
