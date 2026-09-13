import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfSpirits } from "./blessing-of-spirits.ts";

export const blessingOfSpiritsI18n = defineFamilyI18n(blessingOfSpirits, {
  en: {
    name: "Blessing of Spirits",
    typeText: "Illusionist Action - Aura",
    text: (_parameter, color) =>
      `At the start of your turn, destroy this then create ${
        color === "blue"
          ? "a Spectral Shield token"
          : `${color === "red" ? 3 : 2} Spectral Shield tokens`
      }.\nWard 1`,
  },
});

export const {
  red: blessingOfSpiritsRedI18n,
  yellow: blessingOfSpiritsYellowI18n,
  blue: blessingOfSpiritsBlueI18n,
} = blessingOfSpiritsI18n.cards;
