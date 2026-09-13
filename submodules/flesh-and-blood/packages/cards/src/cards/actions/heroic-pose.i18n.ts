import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heroicPose } from "./heroic-pose.ts";

export const heroicPoseI18n = defineFamilyI18n(heroicPose, {
  en: {
    name: "Heroic Pose",
    text: "Your next attack this turn gets +3{p}.\nThe crowd cheers you.\nGo again",
    typeText: "Revered Action",
  },
});

export const {
  red: heroicPoseRedI18n,
  yellow: heroicPoseYellowI18n,
  blue: heroicPoseBlueI18n,
} = heroicPoseI18n.cards;
