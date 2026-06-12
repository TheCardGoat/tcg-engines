import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const genieMainAttractionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Genie",
    version: "Main Attraction",
    text: [
      {
        title: "PHENOMENAL SHOWMAN",
        description:
          "While this character is exerted, opposing characters can't ready at the start of their turn.",
      },
    ],
  },
  de: {
    name: "Dschinni",
    version: "Hauptattraktion",
    text: [
      {
        title: "SPEKTAKULÄRER ENTERTAINER",
        description:
          "Solange dieser Charakter erschöpft ist, werden gegnerische Charaktere zu Beginn ihres Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "Clou du spectacle",
    text: [
      {
        title: "ARTISTE PHÉNOMÉNAL",
        description:
          "Tant que ce personnage est épuisé, les personnages adverses ne se redressent pas au début de leur tour.",
      },
    ],
  },
  it: {
    name: "Genio",
    version: "Attrazione Principale",
    text: [
      {
        title: "SHOWMAN FENOMENALE",
        description:
          "Mentre questo personaggio è impegnato, i personaggi avversari non si possono preparare all'inizio del loro turno.",
      },
    ],
  },
};
