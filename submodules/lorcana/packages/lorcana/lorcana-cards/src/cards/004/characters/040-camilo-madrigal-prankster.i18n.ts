import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const camiloMadrigalPranksterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Camilo Madrigal",
    version: "Prankster",
    text: [
      {
        title: "MANY FORMS",
        description: "At the start of your turn, you may choose one:",
      },
      {
        title: "• This character gets +1 {L} this turn.",
      },
      {
        title: "• This character gains Challenger +2 this turn.",
      },
    ],
  },
  de: {
    name: "Camilo Madrigal",
    version: "Scherzkeks",
    text: [
      {
        title: "VIELE FORMEN",
        description:
          "Zu Beginn deines Zuges, darfst du eine Möglichkeit auswählen: • Dieser Charakter erhält in diesem Zug +1. • Dieser Charakter erhält in diesem Zug Herausfordern +2. (Während der Charakter herausfordert, erhält er +2.)",
      },
    ],
  },
  fr: {
    name: "Camilo Madrigal",
    version: "Farceur",
    text: [
      {
        title: "MÉTAMORPHOSES",
        description:
          "Au début de votre tour, choisissez entre: • Ce personnage gagne +1 pour le reste de ce tour. • Ce personnage gagne Offensif +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Camilo Madrigal",
    version: "Spiritosone",
    text: [
      {
        title: "MOLTE FORME",
        description:
          "All'inizio del tuo turno puoi scegliere uno: • Questo personaggio riceve +1 per questo turno. • Questo personaggio ottiene Sfidante +2 per questo turno.",
      },
    ],
  },
};
