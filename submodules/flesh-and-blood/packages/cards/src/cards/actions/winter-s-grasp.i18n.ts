import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { winterSGrasp } from "./winter-s-grasp.ts";

export const winterSGraspI18n = defineFamilyI18n(winterSGrasp, {
  en: {
    name: "Winter's Grasp",
    typeText: "Ice Action - Attack",
  },
});

export const {
  red: winterSGraspRedI18n,
  yellow: winterSGraspYellowI18n,
  blue: winterSGraspBlueI18n,
} = winterSGraspI18n.cards;
