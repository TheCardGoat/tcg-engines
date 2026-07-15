import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stratosTornadoTitanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stratos",
    version: "Tornado Titan",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "CYCLONE",
        description: "{E} — Gain lore equal to the number of Titan characters you have in play.",
      },
    ],
  },
  de: {
    name: "Orkanos",
    version: "Tornado Titan",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Wirbelsturm",
        description:
          "{E} — Sammle so viele Legenden, wie die Anzahl deiner Titanen im Spiel beträgt.",
      },
    ],
  },
  fr: {
    name: "Stratos",
    version: "Titan du vent",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Cyclone",
        description:
          "{E} — Gagnez un nombre d'éclats de Lore égal au nombre de personnages Titan que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "Stratos",
    version: "Titano del Tornado",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Ciclone",
        description: "{E} — Ottieni leggenda pari al numero di personaggi Titano che hai in gioco.",
      },
    ],
  },
};
