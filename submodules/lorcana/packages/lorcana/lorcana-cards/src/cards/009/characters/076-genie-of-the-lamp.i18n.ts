import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const genieOfTheLampI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Genie",
    version: "Of the Lamp",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "LET'S MAKE SOME MAGIC",
        description: "While this character is exerted, your other characters get +2 {S}.",
      },
    ],
  },
  de: {
    name: "Dschinni",
    version: "Aus der Wunderlampe",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "JETZT WIRD GEZAUBERT",
        description:
          "Solange dieser Charakter erschöpft ist, erhalten deine anderen Charaktere +2.",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "de la Lampe",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "ALORS FAISONS UN PEU DE MAGIE",
        description: "Tant que ce personnage est épuisé, vos autres personnages gagnent +2.",
      },
    ],
  },
  it: {
    name: "Genio",
    version: "Della Lampada",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "SOTTO CON LA MAGIA",
        description: "Mentre questo personaggio è impegnato, i tuoi altri personaggi ricevono +2.",
      },
    ],
  },
};
