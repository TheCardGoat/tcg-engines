import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { backAlleyBreakline } from "./back-alley-breakline.ts";

export const backAlleyBreaklineI18n = defineFamilyI18n(backAlleyBreakline, {
  en: {
    name: "Back Alley Breakline",
    typeText: "Generic Action - Attack",
    text: "If an activated ability or action card effect puts Back Alley Breakline face up into a zone from your deck, gain 1 action point.",
  },
});

export const {
  red: backAlleyBreaklineRedI18n,
  yellow: backAlleyBreaklineYellowI18n,
  blue: backAlleyBreaklineBlueI18n,
} = backAlleyBreaklineI18n.cards;
