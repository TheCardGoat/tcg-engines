import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueensCastleMirrorChamberI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Queen's Castle",
    version: "Mirror Chamber",
    text: [
      {
        title: "USING THE MIRROR",
        description:
          "At the start of your turn, for each character you have here, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Das Schloss der Königin",
    version: "Spiegel-Kammer",
    text: [
      {
        title: "DEN SPIEGEL BENUTZEN",
        description:
          "Zu Beginn deines Zuges, kannst du für jeden deiner Charaktere an diesem Ort, 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Château de la reine",
    version: "Salle du miroir",
    text: [
      {
        title: "UTILISATION DU MIROIR",
        description:
          "Au début de votre tour, pour chacun de vos personnages sur ce lieu, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Il Castello della Regina",
    version: "Stanza dello Specchio",
    text: [
      {
        title: "USARE LO SPECCHIO",
        description:
          "All'inizio del tuo turno, per ogni personaggio che hai in questo luogo, puoi pescare una carta.",
      },
    ],
  },
};
