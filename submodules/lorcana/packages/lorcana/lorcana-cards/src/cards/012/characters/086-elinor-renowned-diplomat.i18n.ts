import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const elinorRenownedDiplomatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Elinor",
    version: "Renowned Diplomat",
    text: [
      {
        title: "COORDINATED EFFORTS",
        description:
          "At the end of your turn, if you have 3 or more exerted characters in play, deal 1 damage to chosen opposing character, gain 1 lore, and draw a card.",
      },
    ],
  },
  de: {
    name: "Elinor",
    version: "Namhafte Diplomatin",
    text: [
      {
        title: "Koordinierte Maßnahmen",
        description:
          "Am Ende deines Zuges, falls du mindestens 3 erschöpfte Charaktere im Spiel hast, füge einem gegnerischen Charakter deiner Wahl 1 Schaden zu, sammle 1 Legende und ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Elinor",
    version: "Diplomate renommée",
    text: [
      {
        title: "Efforts coordonnés",
        description:
          "À la fin de votre tour, si vous avez 3 personnages épuisés ou plus en jeu, choisissez un personnage adverse et infligez-lui 1 dommage, gagnez 1 éclat de Lore et piochez une carte.",
      },
    ],
  },
  it: {
    name: "Elinor",
    version: "Diplomatica Rinomata",
    text: [
      {
        title: "Sforzi Coordinati",
        description:
          "Alla fine del tuo turno, se hai in gioco 3 o più personaggi impegnati, infliggi 1 danno a un personaggio avversario a tua scelta, ottieni 1 leggenda e pesca una carta.",
      },
    ],
  },
};
