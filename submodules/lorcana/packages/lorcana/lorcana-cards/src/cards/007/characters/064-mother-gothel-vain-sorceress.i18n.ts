import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const motherGothelVainSorceressI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mother Gothel",
    version: "Vain Sorceress",
    text: [
      {
        title: "NOW YOU'VE UPSET ME",
        description:
          "Whenever one of your characters challenges, you may move 1 damage counter from chosen character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Mutter Gothel",
    version: "Eitle Magierin",
    text: [
      {
        title: "JETZT MACHST DU MICH WÜTEND",
        description:
          "Jedes Mal, wenn einer deiner Charaktere herausfordert, darfst du 1 Schadensmarker von einem deiner Charaktere zu einem gegnerischen Charakter deiner Wahl verschieben.",
      },
    ],
  },
  fr: {
    name: "Mère Gothel",
    version: "Sorcière vaniteuse",
    text: [
      {
        title: "TOUT CELA ME CONTRARIE",
        description:
          "Chaque fois que l'un de vos personnages défie, vous pouvez choisir un personnage et déplacer 1 de ses dommages sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Madre Gothel",
    version: "Strega Vanesia",
    text: [
      {
        title: "ORA MI HAI FATTO ARRABBIARE",
        description:
          "Ogni volta che uno dei tuoi personaggi sfida, puoi spostare 1 segnalino danno da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
