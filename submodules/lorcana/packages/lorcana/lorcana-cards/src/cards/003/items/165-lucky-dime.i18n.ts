import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const luckyDimeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lucky Dime",
    text: [
      {
        title: "NUMBER ONE",
        description: "{E}, 2 {I} — Choose a character of yours and gain lore equal to their {L}.",
      },
    ],
  },
  de: {
    name: "Glückskreuzer",
    text: [
      {
        title: "NUMMER EINS, 2",
        description:
          "— Wähle einen deiner Charaktere und sammle so viele Legenden, wie sein -Wert beträgt.",
      },
    ],
  },
  fr: {
    name: "Sou fétiche",
    text: [
      {
        title: "PREMIER SOU, 2",
        description:
          "— Choisissez l'un de vos personnages et gagnez un nombre d'éclats de Lore égal à sa.",
      },
    ],
  },
  it: {
    name: "Numero Uno",
    text: [
      {
        title: "DECINO FORTUNATO, 2",
        description: "— Scegli uno dei tuoi personaggi e ottieni leggenda pari al suo.",
      },
    ],
  },
};
