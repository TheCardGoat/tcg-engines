import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cloudSkiff } from "./cloud-skiff.ts";

export const cloudSkiffI18n = defineFamilyI18n(cloudSkiff, {
  en: {
    name: "Cloud Skiff",
    text: "Once per Turn Instant - {t} a cog you control: This gets +1{p} or go again.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: cloudSkiffRedI18n,
  yellow: cloudSkiffYellowI18n,
  blue: cloudSkiffBlueI18n,
} = cloudSkiffI18n.cards;
