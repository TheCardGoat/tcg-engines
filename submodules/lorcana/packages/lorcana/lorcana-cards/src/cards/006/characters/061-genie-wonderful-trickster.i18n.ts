import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const genieWonderfulTricksterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Genie",
    version: "Wonderful Trickster",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "YOUR REWARD AWAITS",
        description: "Whenever you play a card, draw a card.",
      },
      {
        title: "FORBIDDEN TREASURE",
        description:
          "At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Dschinni",
    version: "Wunderbarer Zauberkünstler",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "DEINE BELOHNUNG WARTET",
        description: "Jedes Mal, wenn du eine Karte ausspielst, ziehe 1 Karte.",
      },
      {
        title: "VERBOTENER SCHATZ",
        description:
          "Am Ende deines Zuges, lege alle Karten aus deiner Hand in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "Farceur merveilleux",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "TA RÉCOMPENSE T'ATTEND",
        description: "Chaque fois que vous jouez une carte, piochez une carte.",
      },
      {
        title: "TRÉSOR INTERDIT",
        description:
          "À la fin de votre tour, placez toutes les cartes de votre main sous votre pioche dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Genio",
    version: "Incredibile Prestigiatore",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "IL TUO PREMIO TI ATTENDE",
        description: "Ogni volta che giochi una carta, pesca una carta.",
      },
      {
        title: "TESORO PROIBITO",
        description:
          "Alla fine del tuo turno, metti tutte le carte nella tua mano in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
