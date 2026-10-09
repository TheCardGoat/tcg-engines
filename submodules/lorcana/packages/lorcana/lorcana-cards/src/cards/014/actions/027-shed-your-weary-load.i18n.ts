import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shedYourWearyLoadI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Shed Your Weary Load",
    text: "Chosen opponent reveals their hand and discards each non-character card revealed this way.",
  },
  de: {
    name: "Die Last des Alltags",
    text: "Eine gegnerische Person deiner Wahl zeigt alle Handkarten vor und wirft jede Karte, die keine Charakterkarte ist, ab.",
  },
  fr: {
    name: "Prends la route et oublie tes soucis",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 5 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un adversaire qui révèle sa main et défausse chaque carte non-Personnage ainsi révélée.",
      },
    ],
  },
  it: {
    name: "I Nervi Stanno Per Saltar",
    text: [
      {
        title:
          "(Un personaggio con costo 5 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un avversario a tua scelta rivela la sua mano e scarta ogni carta non personaggio rivelata in questo modo.",
      },
    ],
  },
  es: {
    name: "Shed Your Weary Load",
    text: "Chosen opponent reveals their hand and discards each non-character card revealed this way.",
  },
};
