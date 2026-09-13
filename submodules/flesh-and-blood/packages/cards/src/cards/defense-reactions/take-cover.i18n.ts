import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { takeCover } from "./take-cover.ts";

export const takeCoverI18n = defineFamilyI18n(takeCover, {
  en: { name: "Take Cover", text: "Reload", typeText: "Ranger Defense Reaction" },
});

export const {
  red: takeCoverRedI18n,
  yellow: takeCoverYellowI18n,
  blue: takeCoverBlueI18n,
} = takeCoverI18n.cards;
