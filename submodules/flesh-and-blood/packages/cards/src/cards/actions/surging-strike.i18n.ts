import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { surgingStrike } from "./surging-strike.ts";

export const surgingStrikeI18n = defineFamilyI18n(surgingStrike, {
  en: {
    name: "Surging Strike",
    text: "Go again",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: surgingStrikeRedI18n,
  yellow: surgingStrikeYellowI18n,
  blue: surgingStrikeBlueI18n,
} = surgingStrikeI18n.cards;
