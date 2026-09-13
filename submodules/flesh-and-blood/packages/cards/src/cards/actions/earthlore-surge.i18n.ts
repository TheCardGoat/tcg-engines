import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { earthloreSurge } from "./earthlore-surge.ts";

export const earthloreSurgeI18n = defineFamilyI18n(earthloreSurge, {
  en: {
    name: "Earthlore Surge",
    text: "The next attack action card you play this turn gains +5{p}.\nGo again",
    typeText: "Earth Action",
  },
});
export const {
  red: earthloreSurgeRedI18n,
  yellow: earthloreSurgeYellowI18n,
  blue: earthloreSurgeBlueI18n,
} = earthloreSurgeI18n.cards;
