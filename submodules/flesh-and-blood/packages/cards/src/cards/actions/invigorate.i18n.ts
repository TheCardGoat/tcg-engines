import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { invigorate } from "./invigorate.ts";

export const invigorateI18n = defineFamilyI18n(invigorate, {
  en: {
    name: "Invigorate",
    text: "The next attack you fuse this turn gains +4{p}.\nGo again",
    typeText: "Elemental Action",
  },
});
export const {
  red: invigorateRedI18n,
  yellow: invigorateYellowI18n,
  blue: invigorateBlueI18n,
} = invigorateI18n.cards;
