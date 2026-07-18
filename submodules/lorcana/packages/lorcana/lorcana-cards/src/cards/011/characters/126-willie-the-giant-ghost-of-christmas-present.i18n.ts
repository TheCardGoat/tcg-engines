import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const willieTheGiantGhostOfChristmasPresentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Willie the Giant",
    version: "Ghost of Christmas Present",
    text: [
      {
        title: "Boost 3 {I}",
      },
      {
        title: "THE FOOD OF GENEROSITY",
        description:
          "This character can't quest or challenge unless you put a card under him this turn.",
      },
    ],
  },
  de: {
    name: "Willie der Riese",
    version: "Geist der gegenwärtigen Weihnacht",
    text: [
      {
        title:
          "<Stärken> 3 {I} (Einmal während deines Zuges darfst du 3 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Die Speise der Großzügigkeit",
        description:
          "Dieser Charakter kann nicht erkunden oder herausfordern, außer du hast in diesem Zug bereits eine Karte unter ihn gelegt.",
      },
    ],
  },
  fr: {
    name: "Willie le géant",
    version: "Fantôme du Noël présent",
    text: [
      {
        title:
          "<Boost> 3 {I} (Une fois durant votre tour, vous pouvez payer 3 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Une affaire de générosité",
        description:
          "Ce personnage ne peut ni être envoyé à l'aventure ni défier sauf si vous avez placé une carte sous lui ce tour-ci.",
      },
    ],
  },
  it: {
    name: "Willie il Gigante",
    version: "Fantasma del Natale Presente",
    text: [
      {
        title:
          "<Potenziamento> 3 {I} (Una volta durante il tuo turno, puoi pagare 3 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Il Cibo della Generosità",
        description:
          "Questo personaggio non può andare all'avventura o sfidare a meno che tu non abbia messo una carta sotto di esso in questo turno.",
      },
    ],
  },
  es: {
    name: "Willie el gigante",
    version: "Fantasma del regalo de Navidad",
    text: [
      {
        title: "Impulsar 3 {I}",
      },
      {
        title: "EL ALIMENTO DE LA GENEROSIDAD",
        description:
          "Este personaje no puede realizar misiones ni desafíos a menos que le pongas una carta debajo este turno.",
      },
    ],
  },
};
