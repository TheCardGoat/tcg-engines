import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const camiloMadrigalPranksterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Camilo Madrigal",
    version: "Prankster",
    text: "MANY FORMS At the start of your turn, you may choose one:\n- This character gets +1 {L} this turn.\n- This character gains Challenger +2 this turn.",
  },
  de: {
    name: "Camilo Madrigal",
    version: "Scherzkeks",
    text: [
      {
        title: "Viele Formen",
        description: "Zu Beginn deines Zuges, darfst du eine Möglichkeit auswählen:",
      },
      {
        title: "• Dieser Charakter erhält in diesem Zug +1 {L}.",
      },
      {
        title:
          "• Dieser Charakter erhält in diesem Zug <Herausfordern> +2. (Während der Charakter herausfordert, erhält er +2 {S}.)",
      },
    ],
  },
  fr: {
    name: "Camilo Madrigal",
    version: "Farceur",
    text: [
      {
        title: "Métamorphoses",
        description: "Au début de votre tour, choisissez entre:",
      },
      {
        title: "• Ce personnage gagne +1 {L} pour le reste de ce tour.",
      },
      {
        title: "• Ce personnage gagne <Offensif> +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Camilo Madrigal",
    version: "Spiritosone",
    text: [
      {
        title: "Molte Forme",
        description: "All'inizio del tuo turno puoi scegliere uno:",
      },
      {
        title: "• Questo personaggio riceve +1 {L} per questo turno.",
      },
      {
        title:
          "• Questo personaggio ottiene <Sfidante> +2 per questo turno. (Riceve +2 {S} mentre sta sfidando.)",
      },
    ],
  },
  es: {
    name: "Camilo Madrigal",
    version: "Bromista",
    text: "MUCHAS FORMAS Al comienzo de tu turno, puedes elegir una:\n- Este personaje obtiene +1 {L} este turno.\n- Este personaje gana Challenger +2 este turno.",
  },
};
