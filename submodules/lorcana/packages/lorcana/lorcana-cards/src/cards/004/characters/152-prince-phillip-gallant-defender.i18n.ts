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
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Beste Verteidigung",
        description:
          "Jedes Mal, wenn einer deiner Charaktere mit <Unterstützen> ausgewählt wird, erhält er in diesem Zug <Robust> +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Prince Philippe",
    version: "Galant défenseur",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Meilleure défense",
        description:
          "Chaque fois qu'un de vos personnages est choisi par la capacité <Soutien>, il gagne <Résistance> +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Principe Filippo",
    version: "Difensore Valoroso",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "La Miglior Difesa",
        description:
          "Ogni volta che uno dei tuoi personaggi viene scelto da un <Aiutante>, ottiene <Resistere> +1 per questo turno.",
      },
    ],
  },
};
