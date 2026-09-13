import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { roninRenegade } from "./ronin-renegade.ts";

export const roninRenegadeI18n = defineFamilyI18n(roninRenegade, {
  en: {
    name: "Ronin Renegade",
    text: "Go again",
    typeText: "Draconic Ninja Action - Attack",
  },
});

export const {
  red: roninRenegadeRedI18n,
  yellow: roninRenegadeYellowI18n,
  blue: roninRenegadeBlueI18n,
} = roninRenegadeI18n.cards;
