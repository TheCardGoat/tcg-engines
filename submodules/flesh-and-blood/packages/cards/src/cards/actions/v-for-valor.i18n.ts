import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vForValor } from "./v-for-valor.ts";

export const vForValorI18n = defineFamilyI18n(vForValor, {
  en: {
    name: "V for Valor",
    text: ({ value1 }) =>
      `Attack Reaction - {r}, destroy this, charge your hero's soul: Target attack gains +${value1}{p}.`,
    typeText: "Light Warrior Action - Aura",
  },
});

export const {
  red: vForValorRedI18n,
  yellow: vForValorYellowI18n,
  blue: vForValorBlueI18n,
} = vForValorI18n.cards;
