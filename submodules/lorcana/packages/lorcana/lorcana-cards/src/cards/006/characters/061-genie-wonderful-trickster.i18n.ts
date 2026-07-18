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
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Dschinni-Charaktere auszuspielen.)",
      },
      {
        title: "Deine Belohnung wartet",
        description: "Jedes Mal, wenn du eine Karte ausspielst, ziehe 1 Karte.",
      },
      {
        title: "Verbotener Schatz",
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
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Génie.)",
      },
      {
        title: "Ta récompense t'attend",
        description: "Chaque fois que vous jouez une carte, piochez une carte.",
      },
      {
        title: "Trésor interdit",
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
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Genio.)",
      },
      {
        title: "Il Tuo Premio ti Attende",
        description: "Ogni volta che giochi una carta, pesca una carta.",
      },
      {
        title: "Tesoro Proibito",
        description:
          "Alla fine del tuo turno, metti tutte le carte nella tua mano in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
  es: {
    name: "Genio",
    version: "Maravilloso embaucador",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "TU RECOMPENSA TE ESPERA",
        description: "Cada vez que juegues una carta, roba una carta.",
      },
      {
        title: "TESORO PROHIBIDO",
        description:
          "Al final de tu turno, coloca todas las cartas de tu mano en la parte inferior de tu mazo en cualquier orden.",
      },
    ],
  },
};
