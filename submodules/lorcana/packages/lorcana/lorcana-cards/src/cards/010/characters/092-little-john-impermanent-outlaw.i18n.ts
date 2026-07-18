import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const littleJohnImpermanentOutlawI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Little John",
    version: "Impermanent Outlaw",
    text: [
      {
        title: "Boost 3 {I}",
      },
      {
        title: "READY TO RASSLE",
        description: "Whenever you put a card under this character, ready him.",
      },
    ],
  },
  de: {
    name: "Little John",
    version: "Vorübergehend Geächteter",
    text: [
      {
        title:
          "<Stärken> 3 {I} (Einmal während deines Zuges darfst du 3 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Bereit, zu randalieren",
        description:
          "Jedes Mal, wenn du eine Karte unter diesen Charakter legst, mache ihn bereit.",
      },
    ],
  },
  fr: {
    name: "Petit Jean",
    version: "Hors-la-loi éphémère",
    text: [
      {
        title:
          "<Boost> 3 {I} (Une fois durant votre tour, vous pouvez payer 3 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Prêt à la castagne",
        description: "Chaque fois qu'une carte est placée sous ce personnage, redressez-le.",
      },
    ],
  },
  it: {
    name: "Little John",
    version: "Fuorilegge Fugace",
    text: [
      {
        title:
          "<Potenziamento> 3 {I} (Una volta durante il tuo turno, puoi pagare 3 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Pronto alla Lotta",
        description: "Ogni volta che metti una carta sotto a questo personaggio, preparalo.",
      },
    ],
  },
  es: {
    name: "Pequeño juan",
    version: "Forajido impermanente",
    text: [
      {
        title: "Impulsar 3 {I}",
      },
      {
        title: "LISTO PARA RASSLE",
        description: "Siempre que pongas una carta debajo de este personaje, prepáralo.",
      },
    ],
  },
};
