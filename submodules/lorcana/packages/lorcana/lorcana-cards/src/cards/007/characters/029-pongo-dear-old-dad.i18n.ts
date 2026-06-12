import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pongoDearOldDadI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pongo",
    version: "Dear Old Dad",
    text: [
      {
        title: "FOUND YOU, YOU LITTLE RASCAL",
        description:
          "At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.",
      },
    ],
  },
  de: {
    name: "Pongo",
    version: "Guter alter Papa",
    text: [
      {
        title: "HAB DICH, DU KLEINER RACKER",
        description:
          "Sieh dir zu Beginn deines Zuges die Karten in deinem Tintenvorrat an. Du darfst einen Welpen daraus kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Pongo",
    version: "Bon vieux papa",
    text: [
      {
        title: "JE T'AI TROUVÉ, PETIT COQUIN",
        description:
          "Au début de votre tour, regardez les cartes dans votre réserve d'encre. Vous pouvez jouer gratuitement un personnage Chiot s'y trouvant.",
      },
    ],
  },
  it: {
    name: "Pongo",
    version: "Caro Vecchio Papà",
    text: [
      {
        title: "TI HO TROVATO, PICCOLO BIRBANTE",
        description:
          "All'inizio del tuo turno, guarda le carte nel tuo calamaio. Puoi giocare un personaggio Cucciolo da lì, gratis.",
      },
    ],
  },
};
