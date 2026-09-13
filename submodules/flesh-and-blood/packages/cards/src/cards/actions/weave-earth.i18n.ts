import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { weaveEarth } from "./weave-earth.ts";

export const weaveEarthI18n = defineFamilyI18n(weaveEarth, {
  en: {
    name: "Weave Earth",
    text: "The next Earth or Elemental attack action card you play this turn gains +3{p}.\nIf it's fused, instead it gains +4{p}.\nGo again",
    typeText: "Earth Action",
  },
});
export const {
  red: weaveEarthRedI18n,
  yellow: weaveEarthYellowI18n,
  blue: weaveEarthBlueI18n,
} = weaveEarthI18n.cards;
