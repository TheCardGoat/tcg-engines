import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const touchTheSkyEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Touch the Sky",
    text: "Move a character of yours to a location for free. Then, draw cards equal to that location's {L}.",
  },
  de: {
    name: "Touch the Sky",
    text: "Wähle einen deiner Charaktere und bewege ihn kostenlos zu einem Ort. Dann ziehe so viele Karten, wie der {L}-Wert des Ortes beträgt.",
  },
  fr: {
    name: "Vers le ciel",
    text: "Déplacez gratuitement l'un de vos personnages sur un lieu. Ensuite, piochez autant de cartes que le {L} de ce lieu.",
  },
  it: {
    name: "Il Cielo Toccherò",
    text: "Sposta un tuo personaggio in un luogo gratis. Poi, pesca carte pari al {L} di quel luogo.",
  },
};
