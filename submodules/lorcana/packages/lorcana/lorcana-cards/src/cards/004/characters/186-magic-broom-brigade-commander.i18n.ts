import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicBroomBrigadeCommanderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Broom",
    version: "Brigade Commander",
    text: [
      {
        title: "Resist +1",
      },
      {
        title: "ARMY OF BROOMS",
        description:
          "This character gets +2 {S} for each other character named Magic Broom you have in play.",
      },
    ],
  },
  de: {
    name: "Zauberbesen",
    version: "Marschmeister",
    text: [
      {
        title: "Robust +1",
      },
      {
        title: "ARMEE VON BESEN",
        description:
          "Dieser Charakter erhält +2 für jeden weiteren Zauberbesen-Charakter, den du im Spiel hast.",
      },
    ],
  },
  fr: {
    name: "Balais Magiques",
    version: "Commandant de brigade",
    text: [
      {
        title: "Résistance +1",
      },
      {
        title: "ARMÉE DE BALAIS",
        description:
          "Ce personnage gagne +2 pour chaque autre personnage Balais magiques que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "Scopa Magica",
    version: "Capitano di Brigata",
    text: [
      {
        title: "Resistere +1",
      },
      {
        title: "ARMATA DI SCOPE",
        description:
          "Questo personaggio riceve +2 per ogni altro personaggio chiamato Scopa Magica che hai in gioco.",
      },
    ],
  },
};
