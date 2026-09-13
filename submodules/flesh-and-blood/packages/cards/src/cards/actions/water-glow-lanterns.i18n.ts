import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { waterGlowLanterns } from "./water-glow-lanterns.ts";

export const waterGlowLanternsI18n = defineFamilyI18n(waterGlowLanterns, {
  en: {
    name: "Water Glow Lanterns",
    text: ({ color }) =>
      `Reveal the top card of your deck. If it's ${color}, create a Spectral Shield token.
Go again`,
    typeText: "Illusionist Action",
  },
});

export const {
  red: waterGlowLanternsRedI18n,
  yellow: waterGlowLanternsYellowI18n,
  blue: waterGlowLanternsBlueI18n,
} = waterGlowLanternsI18n.cards;
