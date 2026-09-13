import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { villainousPose } from "./villainous-pose.ts";

export const villainousPoseI18n = defineFamilyI18n(villainousPose, {
  en: {
    name: "Villainous Pose",
    text: "Your next attack this turn gets +4{p}.\nThe crowd boos you.\nGo again",
    typeText: "Reviled Action",
  },
});
export const {
  red: villainousPoseRedI18n,
  yellow: villainousPoseYellowI18n,
  blue: villainousPoseBlueI18n,
} = villainousPoseI18n.cards;
