import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cybugInvasiveEnemyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cy-Bug",
    version: "Invasive Enemy",
    text: [
      {
        title: "HIVE MIND",
        description: "This character gets +1 {S} for each other character you have in play.",
      },
    ],
  },
  de: {
    name: "Cy-Bug",
    version: "Invasiver Feind",
    text: [
      {
        title: "Schwarmintelligenz",
        description: "Dieser Charakter erhält +1 {S} für jeden deiner anderen Charaktere im Spiel.",
      },
    ],
  },
  fr: {
    name: "Cybug",
    version: "Ennemi invasif",
    text: [
      {
        title: "Esprit de ruche",
        description:
          "Ce personnage gagne +1 {S} pour chaque autre personnage que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "Scarafoide",
    version: "Nemico Infestante",
    text: [
      {
        title: "Mente Alveare",
        description:
          "Questo personaggio riceve +1 {S} per ogni altro personaggio che hai in gioco.",
      },
    ],
  },
};
