import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cadaverousContraband } from "./cadaverous-contraband.ts";

export const cadaverousContrabandI18n = defineFamilyI18n(cadaverousContraband, {
  en: {
    name: "Cadaverous Contraband",
    typeText: "Generic Action - Attack",
    text: "When this hits, you may put a 'non-attack' action card from your graveyard on top of your deck.",
  },
});

export const {
  red: cadaverousContrabandRedI18n,
  yellow: cadaverousContrabandYellowI18n,
  blue: cadaverousContrabandBlueI18n,
} = cadaverousContrabandI18n.cards;
