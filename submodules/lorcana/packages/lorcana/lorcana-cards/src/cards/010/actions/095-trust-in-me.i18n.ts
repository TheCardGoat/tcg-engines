import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trustInMeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Trust In Me",
    text: "Choose one:\n- Each opposing character gets -1 until the start of your next turn.\n- Each opponent chooses and discards 2 cards.",
  },
  de: {
    name: "Hör auf mich",
    text: "Wähle eine Möglichkeit aus: • Gib allen gegnerischen Charakteren bis zu Beginn deines nächsten Zuges -1. • Alle gegnerischen Mitspielenden wählen je 2 Karten aus ihrer Hand und werfen sie ab.",
  },
  fr: {
    name: "Aie confiance",
    text: "Choisissez entre: • Chaque personnage adverse subit -1 jusqu'au début de votre prochain tour. • Chaque adversaire défausse 2 cartes.",
  },
  it: {
    name: "Spera in Me",
    text: "(Un personaggio con costo 6 o superiore può per cantare questa canzone gratis.) Scegli uno: • Ogni personaggio avversario riceve -1 fino all'inizio del tuo prossimo turno. • Ogni avversario sceglie e scarta 2 carte.",
  },
};
