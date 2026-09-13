import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { velaFlash } from "./vela-flash.ts";

export const velaFlashI18n = defineFamilyI18n(velaFlash, {
  en: {
    name: "Vela Flash",
    text: "Lightning Fusion\nIf Vela Flash was fused, you may play your next 'non-attack' action card this turn as though it were an instant.",
    typeText: "Elemental Runeblade Action - Attack",
  },
});

export const {
  red: velaFlashRedI18n,
  yellow: velaFlashYellowI18n,
  blue: velaFlashBlueI18n,
} = velaFlashI18n.cards;
