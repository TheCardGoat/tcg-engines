import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tBone } from "./t-bone.ts";

export const tBoneI18n = defineFamilyI18n(tBone, {
  en: {
    name: "T-Bone",
    text: "If you control a card on the combat chain that was boosted, the defending hero must defend this with an equipment they control if able.\nBoost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const { red: tBoneRedI18n, yellow: tBoneYellowI18n, blue: tBoneBlueI18n } = tBoneI18n.cards;
