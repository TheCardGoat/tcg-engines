import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chipNDaleRecoveryRangersEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chip 'n' Dale",
    version: "Recovery Rangers",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "(This character counts as being named both Chip and Dale.)",
      },
      {
        title: "SEARCH AND RESCUE",
        description:
          "During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Chip und Chap",
    version: "Ritter der Rückgewinnung",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "SUCHEN UND RETTEN",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, darfst du eine Charakterkarte aus deinem Ablagestapel zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Tic et Tac",
    version: "Rangers-sauveteurs",
    text: [
      {
        title: "Alter 5",
      },
      {
        title:
          "À LA RESCOUSSE Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, vous pouvez renvoyer une carte Personnage de votre défausse dans votre main.",
      },
    ],
  },
  it: {
    name: "Cip e Ciop",
    version: "Agenti di Recupero",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "RICERCA",
        description:
          "E SOCCORSO Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, puoi riprendere in mano una carta personaggio dai tuoi scarti.",
      },
    ],
  },
};
