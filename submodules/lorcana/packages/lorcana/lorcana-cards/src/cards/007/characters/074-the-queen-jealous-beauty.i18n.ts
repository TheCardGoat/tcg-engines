import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueenJealousBeautyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Queen",
    version: "Jealous Beauty",
    text: [
      {
        title: "NO ORDINARY APPLE",
        description:
          "{E} — Choose 3 cards from chosen opponent's discard and put them on the bottom of their deck to gain 3 lore. If any Princess cards were moved this way, gain 4 lore instead.",
      },
    ],
  },
  de: {
    name: "Die Königin",
    version: "Eifersüchtige Schönheit",
    text: [
      {
        title: "KEIN",
        description:
          "GEWÖHNLICHER APFEL — Wähle 3 Karten aus einem gegnerischen Ablagestapel und lege diese unter das zugehörige Deck, um 3 Legenden zu sammeln. Falls du so mindestens eine Prinzessinnen-Karte bewegt hast, sammelst du stattdessen 4 Legenden.",
      },
    ],
  },
  fr: {
    name: "La Reine",
    version: "Beauté jalouse",
    text: [
      {
        title: "PAS UNE POMME ORDINAIRE",
        description:
          "— Choisissez un adversaire. Choisissez 3 cartes de sa défausse et placez-les sous sa pioche pour gagner 3 éclats de Lore. Si vous avez déplacé au moins un personnage Princesse de cette façon, gagnez 4 éclats de Lore à la place.",
      },
    ],
  },
  it: {
    name: "Regina",
    version: "Bellezza Gelosa",
    text: [
      {
        title: "NON",
        description:
          "È UNA MELA COME UN'ALTRA — Scegli 3 carte dagli scarti di un avversario a tua scelta e mettile in fondo al suo mazzo per ottenere 3 leggenda. Se una qualsiasi carta Principessa è stata spostata in questo modo, ottieni invece 4 leggenda.",
      },
    ],
  },
};
