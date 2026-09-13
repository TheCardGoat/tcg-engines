import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { whittleFromBone } from "./whittle-from-bone.ts";

export const whittleFromBoneI18n = defineFamilyI18n(whittleFromBone, {
  en: {
    name: "Whittle from Bone",
    text: "Stealth\nWhen this attacks a marked hero, equip a Graphene Chelicera token.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: whittleFromBoneRedI18n,
  yellow: whittleFromBoneYellowI18n,
  blue: whittleFromBoneBlueI18n,
} = whittleFromBoneI18n.cards;
