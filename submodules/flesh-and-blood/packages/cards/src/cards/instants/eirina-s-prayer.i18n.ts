import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { eirinasPrayer } from "./eirina-s-prayer.ts";

export const eirinasPrayerI18n = defineFamilyI18n(eirinasPrayer, {
  en: {
    name: "Eirina's Prayer",
    typeText: "Generic Instant",
    text: (amount) =>
      `Reveal the top card of your deck. Prevent the next X arcane damage that would be dealt to your hero this turn, where X is ${amount} minus the pitch value of the card revealed this way.`,
  },
});

export const {
  red: eirinasPrayerRedI18n,
  yellow: eirinasPrayerYellowI18n,
  blue: eirinasPrayerBlueI18n,
} = eirinasPrayerI18n.cards;

export { eirinasPrayerBlueI18n as eirinaSPrayerBlueI18n };
export { eirinasPrayerRedI18n as eirinaSPrayerRedI18n };
export { eirinasPrayerYellowI18n as eirinaSPrayerYellowI18n };
