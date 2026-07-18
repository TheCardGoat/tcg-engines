import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const blueFairyGuidingLightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Blue Fairy",
    version: "Guiding Light",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "Support",
      },
    ],
  },
  de: {
    name: "Die Blaue Fee",
    version: "Leitendes Licht",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "La Fée Bleue",
    version: "Guide spirituelle",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Fata Turchina",
    version: "Luce Guida",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
  es: {
    name: "Hada azul",
    version: "Luz guía",
    text: [
      {
        title: "Evasivo",
      },
      {
        title: "Apoyo",
      },
    ],
  },
};
