import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flakeOut } from "./flake-out.ts";

export const flakeOutI18n = defineFamilyI18n(flakeOut, {
  en: {
    name: "Flake Out",
    text: "Ice Fusion\nIf Flake Out was fused, it gains dominate.",
    typeText: "Elemental Ranger Action - Arrow Attack",
  },
});

export const {
  red: flakeOutRedI18n,
  yellow: flakeOutYellowI18n,
  blue: flakeOutBlueI18n,
} = flakeOutI18n.cards;
