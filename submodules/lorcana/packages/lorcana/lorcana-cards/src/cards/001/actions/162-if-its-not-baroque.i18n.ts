import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ifItsNotBaroqueI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "If it’s Not Baroque",
    text: "Return an item card from your discard to your hand.",
  },
  de: {
    name: "Ist es nicht Barock",
    text: "Nimm 1 Gegenstandskarte aus deinem Ablagestapel zurück auf deine Hand.",
  },
  fr: {
    name: "SI C'EST PAS BAROQUE...",
    text: "Reprenez en main une carte objet de votre défausse.",
  },
  it: {
    name: "If it’s Not Baroque",
    text: "Return an item card from your discard to your hand.",
  },
  es: {
    name: "Si no es barroco",
    text: "Devuelve una carta de objeto de tu descarte a tu mano.",
  },
};
