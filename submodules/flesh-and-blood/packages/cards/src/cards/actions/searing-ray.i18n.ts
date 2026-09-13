import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { searingRay } from "./searing-ray.ts";

export const searingRayI18n = defineFamilyI18n(searingRay, {
  en: {
    name: "Searing Ray",
    typeText: "Light Action - Attack",
    text: "If you have a yellow card in your pitch zone, this gets +2{p}.",
  },
});

export const {
  red: searingRayRedI18n,
  yellow: searingRayYellowI18n,
  blue: searingRayBlueI18n,
} = searingRayI18n.cards;
