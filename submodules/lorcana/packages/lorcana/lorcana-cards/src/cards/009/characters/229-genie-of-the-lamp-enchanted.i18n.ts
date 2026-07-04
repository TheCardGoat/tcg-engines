import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const genieOfTheLampEnchantedI18n: Record<Languages, I18nProperties> = {
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
        title: "<Wendig>",
      },
      {
        title: "Jetzt wird gezaubert",
        description:
          "Solange dieser Charakter erschöpft ist, erhalten deine anderen Charaktere +2 {S}.",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "de la Lampe",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Alors faisons un peu de magie",
        description: "Tant que ce personnage est épuisé, vos autres personnages gagnent +2 {S}.",
      },
    ],
  },
  it: {
    name: "Genio",
    version: "Della Lampada",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Sotto con la Magia",
        description:
          "Mentre questo personaggio è impegnato, i tuoi altri personaggi ricevono +2 {S}.",
      },
    ],
  },
};
