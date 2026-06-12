import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const snowWhiteFairheartedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Snow White",
    version: "Fair-Hearted",
    text: [
      {
        title: "NATURAL LEADER",
        description:
          "This character gains Resist +1 for each other Knight character you have in play.",
      },
    ],
  },
  de: {
    name: "Schneewittchen",
    version: "Ein gutes Herz",
    text: [
      {
        title: "SELBSTVERSTÄNDLICHE ANFÜHRERIN",
        description:
          "Dieser Charakter erhält Robust +1 für jeden anderen Ritter, den du im Spiel hast. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1 pro anderen Ritter.)",
      },
    ],
  },
  fr: {
    name: "Blanche-Neige",
    version: "Cœur juste",
    text: [
      {
        title: "MENEUSE-NÉE",
        description:
          "Ce personnage gagne Résistance +1 pour chaque autre personnage Chevalier que vous avez en jeu. (Les dommages qui lui sont infligés sont réduits de 1 pour chaque autre Chevalier.)",
      },
    ],
  },
  it: {
    name: "Biancaneve",
    version: "Giusta di Cuore",
    text: [
      {
        title: "LEADER NATA",
        description:
          "Questo personaggio ottiene Resistere +1 per ogni altro personaggio Cavaliere che hai in gioco.",
      },
    ],
  },
};
