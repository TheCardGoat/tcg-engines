import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mrsIncredibleSuperStretchyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mrs. Incredible",
    version: "Super Stretchy",
    text: [
      {
        title: "FLEXIBLE THINKING",
        description: "At the start of your turn, you may choose one:",
      },
      {
        title: "• This character gains Evasive until the start of your next turn.",
      },
      {
        title: "• This character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Mrs. Incredible",
    version: "Superdehnbar",
    text: [
      {
        title: "Flexibles Denken",
        description: "Zu Beginn deines Zuges, darfst du eine Möglichkeit auswählen:",
      },
      {
        title: "• Dieser Charakter erhält bis zu Beginn deines nächsten Zuges <Wendig>.",
      },
      {
        title: "• Dieser Charakter erhält in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Mme Indestructible",
    version: "Super extensible",
    text: [
      {
        title: "Souplesse d'esprit",
        description: "Au début de votre tour, vous pouvez choisir entre:",
      },
      {
        title: "• Ce personnage gagne <Insaisissable> jusqu'au début de votre prochain tour.",
      },
      {
        title: "• Ce personnage gagne +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Mrs. Incredibile",
    version: "Super Elastica",
    text: [
      {
        title: "Pensiero Flessibile",
        description: "All'inizio del tuo turno, puoi scegliere uno:",
      },
      {
        title:
          "• Questo personaggio ottiene <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
      {
        title: "• Questo personaggio riceve +1 {L} per questo turno.",
      },
    ],
  },
  es: {
    name: "Señora increíble",
    version: "Súper elástico",
    text: [
      {
        title: "PENSAMIENTO FLEXIBLE",
        description: "Al comienzo de tu turno, puedes elegir uno:",
      },
      {
        title: "• Este personaje gana Evasivo hasta el comienzo de tu próximo turno.",
      },
      {
        title: "• Este personaje obtiene +1 {L} este turno.",
      },
    ],
  },
};
