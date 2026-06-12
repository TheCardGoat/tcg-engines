import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const queenOfHeartsHaughtyMonarchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Queen of Hearts",
    version: "Haughty Monarch",
    text: [
      {
        title: "COUNT OFF!",
        description:
          "While there are 5 or more characters with damage in play, this character gets +3 {L}.",
      },
    ],
  },
  de: {
    name: "Die Herzkönigin",
    version: "Hochmütige Monarchin",
    text: [
      {
        title: "ZÄHLT AB!",
        description:
          "Solange mindestens 5 Charaktere im Spiel beschädigt sind, erhält dieser Charakter +3.",
      },
    ],
  },
  fr: {
    name: "La Reine de Cœur",
    version: "Monarque hautaine",
    text: [
      {
        title: "COMPTEZ-VOUS!",
        description:
          "Tant qu'il y a 5 personnages ou plus en jeu ayant au moins un dommage, ce personnage-ci gagne +3.",
      },
    ],
  },
  it: {
    name: "La Regina di Cuori",
    version: "Monarca Altezzosa",
    text: [
      {
        title: "CONTA!",
        description:
          "Mentre sono in gioco 5 o più personaggi con danno, questo personaggio riceve +3.",
      },
    ],
  },
};
