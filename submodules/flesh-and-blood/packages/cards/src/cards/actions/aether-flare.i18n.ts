import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { aetherFlare } from "./aether-flare.ts";

export const aetherFlareI18n = defineFamilyI18n(aetherFlare, {
  en: {
    name: "Aether Flare",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target opposing hero.\nThe next card you play this turn with an effect that deals arcane damage, instead deals that much arcane damage plus X, where X is the damage dealt by Aether Flare.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: aetherFlareRedI18n,
  yellow: aetherFlareYellowI18n,
  blue: aetherFlareBlueI18n,
} = aetherFlareI18n.cards;
