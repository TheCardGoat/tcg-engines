import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfSuraya } from "./blessing-of-suraya.ts";

export const blessingOfSurayaI18n = defineFamilyI18n(blessingOfSuraya, {
  en: {
    name: "Blessing of Suraya",
    typeText: "Light Action - Aura",
    text: "Go again\nWhenever a card is put into your soul, create a Ponder token. At the start of your turn, put this into your soul.",
  },
});
export const { yellow: blessingOfSurayaYellowI18n } = blessingOfSurayaI18n.cards;
