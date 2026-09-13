import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { polarCap } from "./polar-cap.ts";

export const polarCapI18n = defineFamilyI18n(polarCap, {
  en: {
    name: "Polar Cap",
    text: (_parameter, color) =>
      `Ice Fusion\nDeal ${color === "red" ? 3 : color === "yellow" ? 4 : 2} arcane damage to any target. If Polar Cap was fused and deals damage to a hero, create a Frostbite token under their control.`,
    typeText: "Elemental Wizard Action",
  },
});

export const {
  red: polarCapRedI18n,
  yellow: polarCapYellowI18n,
  blue: polarCapBlueI18n,
} = polarCapI18n.cards;
