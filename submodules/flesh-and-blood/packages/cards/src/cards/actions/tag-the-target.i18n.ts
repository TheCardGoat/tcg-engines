import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tagTheTarget } from "./tag-the-target.ts";

export const tagTheTargetI18n = defineFamilyI18n(tagTheTarget, {
  en: {
    name: "Tag the Target",
    text: "When this hits a hero, mark them.\nGo again",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: tagTheTargetRedI18n,
  yellow: tagTheTargetYellowI18n,
  blue: tagTheTargetBlueI18n,
} = tagTheTargetI18n.cards;
