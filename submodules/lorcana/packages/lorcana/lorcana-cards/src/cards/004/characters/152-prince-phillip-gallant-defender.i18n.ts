import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princePhillipGallantDefenderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince Phillip",
    version: "Gallant Defender",
    text: [
      {
        title: "Support",
      },
      {
        title: "BEST DEFENSE",
        description:
          "Whenever one of your characters is chosen for Support, they gain Resist +1 this turn.",
      },
    ],
  },
  de: {
    name: "Prinz Phillip",
    version: "Galanter Verteidiger",
    text: [
      {
        title: "Unterstützen",
      },
      {
        title: "BESTE VERTEIDIGUNG",
        description:
          "Jedes Mal, wenn einer deiner Charaktere mit Unterstützen ausgewählt wird, erhält er in diesem Zug Robust +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Prince Philippe",
    version: "Galant défenseur",
    text: [
      {
        title: "Soutien",
      },
      {
        title: "MEILLEURE DÉFENSE",
        description:
          "Chaque fois qu'un de vos personnages est choisi par la capacité Soutien, il gagne Résistance +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Principe Filippo",
    version: "Difensore Valoroso",
    text: [
      {
        title: "Aiutante",
      },
      {
        title: "LA MIGLIOR DIFESA",
        description:
          "Ogni volta che uno dei tuoi personaggi viene scelto da un Aiutante, ottiene Resistere +1 per questo turno.",
      },
    ],
  },
};
