import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const robinHoodSneakySleuthI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Robin Hood",
    version: "Sneaky Sleuth",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "CLEVER PLAN",
        description: "This character gets +1 {L} for each opposing damaged character in play.",
      },
    ],
  },
  de: {
    name: "Robin Hood",
    version: "Raffinierter Spion",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Robin-Hood-Charaktere auszuspielen.)",
      },
      {
        title: "Schlauer Plan",
        description:
          "Dieser Charakter erhält +1 {L} für jeden beschädigten Charakter aller gegnerischen Mitspielenden im Spiel.",
      },
    ],
  },
  fr: {
    name: "Robin des Bois",
    version: "Limier furtif",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Robin des Bois.)",
      },
      {
        title: "Un plan brillant",
        description:
          "Ce personnage gagne +1 {L} pour chaque personnage adverse ayant au moins un dommage sur lui.",
      },
    ],
  },
  it: {
    name: "Robin Hood",
    version: "Segugio Furtivo",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Robin Hood.)",
      },
      {
        title: "Piano Astuto",
        description:
          "Questo personaggio riceve +1 {L} per ogni personaggio avversario danneggiato in gioco.",
      },
    ],
  },
  es: {
    name: "Robin Hood",
    version: "Detective astuto",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "PLAN INTELIGENTE",
        description: "Este personaje obtiene +1 {L} por cada personaje enemigo dañado en juego.",
      },
    ],
  },
};
