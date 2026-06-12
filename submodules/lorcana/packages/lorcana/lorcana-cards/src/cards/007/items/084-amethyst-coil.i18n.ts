import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const amethystCoilI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Amethyst Coil",
    text: [
      {
        title: "MAGICAL TOUCH",
        description:
          "During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Amethyst-Reif",
    text: [
      {
        title: "MAGISCHE BERÜHRUNG",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, darfst du 1 Schadensmarker von einem Charakter deiner Wahl zu einem gegnerischen Charakter deiner Wahl verschieben.",
      },
    ],
  },
  fr: {
    name: "Spirale d’améthyste",
    text: [
      {
        title: "TOUCHER MAGIQUE",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, vous pouvez choisir un personnage et déplacer 1 de ses dommages sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Spira d'Ametista",
    text: [
      {
        title: "TOCCO MAGICO",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, puoi spostare 1 segnalino danno da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
