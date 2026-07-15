import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rafikiEtherealGuideI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rafiki",
    version: "Ethereal Guide",
    text: [
      {
        title: "Shift 7",
      },
      {
        title: "ASTRAL ATTUNEMENT",
        description:
          "During your turn, whenever a card is put into your inkwell, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Rafiki",
    version: "Geistiger Ratgeber",
    text: [
      {
        title:
          "<Gestaltwandel> 7 (Du kannst 7 {I} zahlen, um diesen Charakter auf einen deiner Rafiki-Charaktere auszuspielen.)",
      },
      {
        title: "Astrale Einstimmung",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Rafiki",
    version: "Guide éthéré",
    text: [
      {
        title:
          "<Alter> 7 (Vous pouvez payer 7 {I} pour jouer ce personnage sur l'un de vos personnages Rafiki.)",
      },
      {
        title: "Harmonisation Astrale",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Rafiki",
    version: "Guida Eterea",
    text: [
      {
        title:
          "<Trasformazione> 7 (Puoi pagare 7 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Rafiki.)",
      },
      {
        title: "Sintonizzazione Astrale",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, puoi pescare una carta.",
      },
    ],
  },
};
