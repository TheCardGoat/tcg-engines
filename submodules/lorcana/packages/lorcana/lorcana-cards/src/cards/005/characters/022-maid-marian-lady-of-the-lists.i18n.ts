import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const maidMarianLadyOfTheListsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maid Marian",
    version: "Lady of the Lists",
    text: [
      {
        title: "IF IT PLEASES THE LADY",
        description:
          "When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Maid Marian",
    version: "Herrin der Ränge",
    text: [
      {
        title: "WENN DIE LADY ES WILL",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -5.",
      },
    ],
  },
  fr: {
    name: "Belle Marianne",
    version: "Dame des lices",
    text: [
      {
        title: "SI MADAME VEUT BIEN...",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -5 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Lady Marian",
    version: "Lady della Lizza",
    text: [
      {
        title: "SE LA LADY È D'ACCORDO",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -5 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
