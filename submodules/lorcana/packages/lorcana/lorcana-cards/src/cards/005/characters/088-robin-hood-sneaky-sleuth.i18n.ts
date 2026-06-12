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
        title: "Gestaltwandel 3",
      },
      {
        title: "SCHLAUER PLAN",
        description:
          "Dieser Charakter erhält +1 für jeden beschädigten Charakter aller gegnerischen Mitspielenden im Spiel.",
      },
    ],
  },
  fr: {
    name: "Robin des Bois",
    version: "Limier furtif",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "UN PLAN BRILLANT",
        description:
          "Ce personnage gagne +1 pour chaque personnage adverse ayant au moins un dommage sur lui.",
      },
    ],
  },
  it: {
    name: "Robin Hood",
    version: "Segugio Furtivo",
    text: [
      {
        title: "Trasformazione 3",
      },
      {
        title: "PIANO ASTUTO",
        description:
          "Questo personaggio riceve +1 per ogni personaggio avversario danneggiato in gioco.",
      },
    ],
  },
};
