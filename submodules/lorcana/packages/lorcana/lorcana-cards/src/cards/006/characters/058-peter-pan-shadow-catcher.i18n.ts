import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peterPanShadowCatcherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Peter Pan",
    version: "Shadow Catcher",
    text: [
      {
        title: "GOTCHA!",
        description:
          "During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Peter Pan",
    version: "Schattenfänger",
    text: [
      {
        title: "HAB DICH!",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, erschöpfe einen gegnerischen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Peter Pan",
    version: "Attrapant son ombre",
    text: [
      {
        title: "JE T'AI EUE!",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, choisissez un personnage adverse et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Peter Pan",
    version: "Acciuffatore di Ombre",
    text: [
      {
        title: "PRESA!",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, impegna un personaggio avversario a tua scelta.",
      },
    ],
  },
};
