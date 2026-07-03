import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trustInMeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Trust In Me",
    text: "Choose one:\n- Each opposing character gets -1 until the start of your next turn.\n- Each opponent chooses and discards 2 cards.",
  },
  de: {
    name: "Hör auf mich",
    text: [
      {
        title: "Wähle eine Möglichkeit aus:",
      },
      {
        title: "• Gib allen gegnerischen Charakteren bis zu Beginn deines nächsten Zuges -1 {L}.",
      },
      {
        title:
          "• Alle gegnerischen Mitspielenden wählen je 2 Karten aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Aie confiance",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 6 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez entre:",
      },
      {
        title: "• Chaque personnage adverse subit -1 {L} jusqu'au début de votre prochain tour.",
      },
      {
        title: "• Chaque adversaire défausse 2 cartes.",
      },
    ],
  },
  it: {
    name: "Spera in Me",
    text: [
      {
        title:
          "(Un personaggio con costo 6 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Scegli uno:",
      },
      {
        title:
          "• Ogni personaggio avversario riceve -1 {L} fino all'inizio del tuo prossimo turno.",
      },
      {
        title: "• Ogni avversario sceglie e scarta 2 carte.",
      },
    ],
  },
};
