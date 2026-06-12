import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gustavTheGiantTerrorOfTheKingdomI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gustav the Giant",
    version: "Terror of the Kingdom",
    text: [
      {
        title: "ALL TIED UP",
        description:
          "This character enters play exerted and can't ready at the start of your turn.",
      },
      {
        title: "BREAK FREE",
        description:
          "During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.",
      },
    ],
  },
  de: {
    name: "Gustav der Riese",
    version: "Schrecken des Königreichs",
    text: [
      {
        title: "GEFESSELT",
        description:
          "Dieser Charakter kommt erschöpft ins Spiel und wird zu Beginn deines Zuges nicht bereit gemacht.",
      },
      {
        title: "BEFREIEN",
        description:
          "Jedes Mal, wenn einer deiner anderen Charaktere in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du diesen Charakter bereit machen.",
      },
    ],
  },
  fr: {
    name: "Gustave le Géant",
    version: "Terreur du royaume",
    text: [
      {
        title: "LIGOTÉ",
        description:
          "Ce personnage entre en jeu épuisé et ne se redresse pas au début de votre tour.",
      },
      {
        title: "LIBÉRÉ",
        description:
          "Chaque fois que l'un de vos autres personnages en bannit un autre via un défi durant votre tour, vous pouvez redresser ce personnage.",
      },
    ],
  },
  it: {
    name: "Gustav il Gigante",
    version: "Terrore del Regno",
    text: [
      {
        title: "LEGATO",
        description:
          "Questo personaggio entra in gioco impegnato e non si può preparare all'inizio del tuo turno.",
      },
      {
        title: "LIBERARSI",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi altri personaggi esilia un altro personaggio in una sfida, puoi preparare questo personaggio.",
      },
    ],
  },
};
