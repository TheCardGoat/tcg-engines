import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const belleUntrainedMysticI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Belle",
    version: "Untrained Mystic",
    text: [
      {
        title: "HERE NOW, DON'T DO THAT",
        description:
          "When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Belle",
    version: "Ungeübte Mystikerin",
    text: [
      {
        title: "HIER.",
      },
      {
        title: "TUE'S NICHT",
        description:
          "Wenn du diesen Charakter ausspielst, verschiebe 1 Schadensmarker von einem Charakter deiner Wahl zu einem gegnerischen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Belle",
    version: "Mystique novice",
    text: [
      {
        title: "ALLONS, RESTEZ TRANQUILLE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage et déplacez jusqu'à 1 de ses jetons Dommage sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Belle",
    version: "Mistica Inesperta",
    text: [
      {
        title: "STIA FERMO, NON FACCIA COSÌ",
        description:
          "Quando giochi questo personaggio, sposta fino a 1 segnalino danno da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
