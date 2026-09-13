import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cadaverousTilling } from "./cadaverous-tilling.ts";

export const cadaverousTillingI18n = defineFamilyI18n(cadaverousTilling, {
  en: {
    name: "Cadaverous Tilling",
    text: "Decompose - When this attacks, you may banish 2 Earth cards and an action card from your graveyard. If you do, this gets +2{p}.",
    typeText: "Earth Action - Attack",
  },
});

export const {
  red: cadaverousTillingRedI18n,
  yellow: cadaverousTillingYellowI18n,
  blue: cadaverousTillingBlueI18n,
} = cadaverousTillingI18n.cards;
