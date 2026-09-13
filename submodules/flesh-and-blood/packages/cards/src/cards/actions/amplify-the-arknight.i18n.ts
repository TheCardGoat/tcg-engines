import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { amplifyTheArknight } from "./amplify-the-arknight.ts";

export const amplifyTheArknightI18n = defineFamilyI18n(amplifyTheArknight, {
  en: {
    name: "Amplify the Arknight",
    text: ({ self }) =>
      self
        ? "This costs {r} less to play for each Runechant you control."
        : "Amplify the Arknight costs {r} less to play for each Runechant you control.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: amplifyTheArknightRedI18n,
  yellow: amplifyTheArknightYellowI18n,
  blue: amplifyTheArknightBlueI18n,
} = amplifyTheArknightI18n.cards;
